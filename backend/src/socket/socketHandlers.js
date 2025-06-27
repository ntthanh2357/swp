const jwt = require('jsonwebtoken');
const supabase = require('../config/database');
const logger = require('../utils/logger');

// Store connected users
const connectedUsers = new Map();

const socketHandlers = (io, socket) => {
  // Authenticate socket connection
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        socket.emit('auth_error', { message: 'Authentication failed' });
        return;
      }

      socket.userId = user.id;
      socket.user = user;
      
      // Add user to connected users
      connectedUsers.set(user.id, {
        socketId: socket.id,
        user: user,
        lastSeen: new Date()
      });

      // Update online status
      await supabase
        .from('online_status')
        .upsert([{
          user_id: user.id,
          status: 'online',
          last_seen: new Date().toISOString()
        }]);

      // Join user to their rooms
      const { data: chatRooms } = await supabase
        .from('chat_rooms')
        .select('id')
        .or(`student_id.eq.${user.id},advisor_id.eq.${user.id}`);

      if (chatRooms) {
        chatRooms.forEach(room => {
          socket.join(`room_${room.id}`);
        });
      }

      socket.emit('authenticated', { user: { id: user.id, name: user.name, role: user.role } });
      
      // Broadcast user online status
      socket.broadcast.emit('user_online', { userId: user.id });
      
      logger.info(`Socket authenticated for user: ${user.id}`);
    } catch (error) {
      logger.error('Socket authentication error:', error);
      socket.emit('auth_error', { message: 'Invalid token' });
    }
  });

  // Join chat room
  socket.on('join_room', async (roomId) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    try {
      // Verify user has access to room
      const { data: room, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .or(`student_id.eq.${socket.userId},advisor_id.eq.${socket.userId}`)
        .single();

      if (error || !room) {
        socket.emit('error', { message: 'Access denied to room' });
        return;
      }

      socket.join(`room_${roomId}`);
      socket.currentRoom = roomId;
      
      // Mark messages as delivered
      await supabase
        .from('messages')
        .update({ is_delivered: true })
        .eq('chat_room_id', roomId)
        .eq('receiver_id', socket.userId)
        .eq('is_delivered', false);

      socket.emit('room_joined', { roomId });
      logger.info(`User ${socket.userId} joined room ${roomId}`);
    } catch (error) {
      logger.error('Join room error:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Leave chat room
  socket.on('leave_room', (roomId) => {
    socket.leave(`room_${roomId}`);
    if (socket.currentRoom === roomId) {
      socket.currentRoom = null;
    }
    socket.emit('room_left', { roomId });
  });

  // Send message
  socket.on('send_message', async (data) => {
    if (!socket.userId) {
      socket.emit('error', { message: 'Not authenticated' });
      return;
    }

    try {
      const { chatRoomId, content, messageType = 'text', replyToMessageId, metadata } = data;

      // Verify user has access to room
      const { data: room, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', chatRoomId)
        .or(`student_id.eq.${socket.userId},advisor_id.eq.${socket.userId}`)
        .single();

      if (roomError || !room) {
        socket.emit('error', { message: 'Access denied to room' });
        return;
      }

      // Determine receiver
      const receiverId = room.student_id === socket.userId ? room.advisor_id : room.student_id;

      // Create message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          chat_room_id: chatRoomId,
          sender_id: socket.userId,
          receiver_id: receiverId,
          content,
          message_type: messageType,
          reply_to_message_id: replyToMessageId,
          metadata: metadata || {}
        }])
        .select(`
          *,
          sender:sender_id(id, name, avatar_url),
          receiver:receiver_id(id, name, avatar_url)
        `)
        .single();

      if (messageError) {
        logger.error('Error creating message:', messageError);
        throw messageError;
      }

      // Emit to room participants
      io.to(`room_${chatRoomId}`).emit('message_received', message);
      
      // Send confirmation to sender
      socket.emit('message_sent', { messageId: message.id, timestamp: message.timestamp });

      logger.info(`Message sent: ${message.id} in room ${chatRoomId}`);
    } catch (error) {
      logger.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicators
  socket.on('typing_start', async (data) => {
    if (!socket.userId) return;

    const { chatRoomId } = data;
    
    try {
      // Store typing indicator
      await supabase
        .from('typing_indicators')
        .upsert([{
          chat_room_id: chatRoomId,
          user_id: socket.userId,
          is_typing: true
        }]);

      // Broadcast to room (except sender)
      socket.to(`room_${chatRoomId}`).emit('user_typing', {
        userId: socket.userId,
        chatRoomId,
        typing: true
      });
    } catch (error) {
      logger.error('Typing start error:', error);
    }
  });

  socket.on('typing_stop', async (data) => {
    if (!socket.userId) return;

    const { chatRoomId } = data;
    
    try {
      // Remove typing indicator
      await supabase
        .from('typing_indicators')
        .delete()
        .eq('chat_room_id', chatRoomId)
        .eq('user_id', socket.userId);

      // Broadcast to room (except sender)
      socket.to(`room_${chatRoomId}`).emit('user_typing', {
        userId: socket.userId,
        chatRoomId,
        typing: false
      });
    } catch (error) {
      logger.error('Typing stop error:', error);
    }
  });

  // Mark messages as read
  socket.on('mark_as_read', async (data) => {
    if (!socket.userId) return;

    try {
      const { chatRoomId, messageIds } = data;

      // Update messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('chat_room_id', chatRoomId)
        .eq('receiver_id', socket.userId)
        .in('id', messageIds);

      // Create read receipts
      const readReceipts = messageIds.map(messageId => ({
        message_id: messageId,
        user_id: socket.userId
      }));

      await supabase
        .from('message_read_receipts')
        .upsert(readReceipts);

      // Notify sender
      socket.to(`room_${chatRoomId}`).emit('messages_read', {
        messageIds,
        readBy: socket.userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Mark as read error:', error);
    }
  });

  // Call management
  socket.on('call_initiate', async (data) => {
    if (!socket.userId) return;

    try {
      const { chatRoomId, type, receiverId } = data;

      // Create call session
      const { data: callSession, error } = await supabase
        .from('call_sessions')
        .insert([{
          chat_room_id: chatRoomId,
          initiator_id: socket.userId,
          participant_id: receiverId,
          call_type: type,
          status: 'ringing'
        }])
        .select()
        .single();

      if (error) throw error;

      // Notify participants
      io.to(`room_${chatRoomId}`).emit('call_incoming', {
        callId: callSession.id,
        initiatorId: socket.userId,
        type,
        chatRoomId
      });

      logger.info(`Call initiated: ${callSession.id}`);
    } catch (error) {
      logger.error('Call initiate error:', error);
      socket.emit('error', { message: 'Failed to initiate call' });
    }
  });

  socket.on('call_accept', async (data) => {
    if (!socket.userId) return;

    try {
      const { callId } = data;

      // Update call session
      await supabase
        .from('call_sessions')
        .update({
          status: 'active',
          start_time: new Date().toISOString()
        })
        .eq('id', callId)
        .eq('participant_id', socket.userId);

      // Notify call participants
      const { data: callSession } = await supabase
        .from('call_sessions')
        .select('chat_room_id')
        .eq('id', callId)
        .single();

      if (callSession) {
        io.to(`room_${callSession.chat_room_id}`).emit('call_accepted', { callId });
      }
    } catch (error) {
      logger.error('Call accept error:', error);
    }
  });

  socket.on('call_reject', async (data) => {
    if (!socket.userId) return;

    try {
      const { callId } = data;

      // Update call session
      await supabase
        .from('call_sessions')
        .update({
          status: 'ended',
          end_time: new Date().toISOString()
        })
        .eq('id', callId);

      // Notify call participants
      const { data: callSession } = await supabase
        .from('call_sessions')
        .select('chat_room_id')
        .eq('id', callId)
        .single();

      if (callSession) {
        io.to(`room_${callSession.chat_room_id}`).emit('call_rejected', { callId });
      }
    } catch (error) {
      logger.error('Call reject error:', error);
    }
  });

  socket.on('call_end', async (data) => {
    if (!socket.userId) return;

    try {
      const { callId } = data;

      // Get call session for duration calculation
      const { data: callSession } = await supabase
        .from('call_sessions')
        .select('*')
        .eq('id', callId)
        .single();

      if (callSession && callSession.start_time) {
        const duration = Math.floor((new Date() - new Date(callSession.start_time)) / 1000);
        
        await supabase
          .from('call_sessions')
          .update({
            status: 'ended',
            end_time: new Date().toISOString(),
            duration
          })
          .eq('id', callId);
      } else {
        await supabase
          .from('call_sessions')
          .update({
            status: 'ended',
            end_time: new Date().toISOString()
          })
          .eq('id', callId);
      }

      // Notify call participants
      if (callSession) {
        io.to(`room_${callSession.chat_room_id}`).emit('call_ended', { callId });
      }
    } catch (error) {
      logger.error('Call end error:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    if (socket.userId) {
      // Remove from connected users
      connectedUsers.delete(socket.userId);

      // Update online status
      try {
        await supabase
          .from('online_status')
          .upsert([{
            user_id: socket.userId,
            status: 'offline',
            last_seen: new Date().toISOString()
          }]);

        // Broadcast user offline status
        socket.broadcast.emit('user_offline', { userId: socket.userId });
        
        logger.info(`User ${socket.userId} disconnected`);
      } catch (error) {
        logger.error('Disconnect error:', error);
      }
    }
  });

  // Error handling
  socket.on('error', (error) => {
    logger.error('Socket error:', error);
  });
};

module.exports = socketHandlers;