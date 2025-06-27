const express = require('express');
const { body, param, query } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const supabase = require('../config/database');
const { validateAuth } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// All chat routes require authentication
router.use(validateAuth);

// @route   GET /api/chat/rooms
// @desc    Get user's chat rooms
// @access  Private
router.get('/rooms', async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Build query based on user role
    let query = supabase
      .from('chat_rooms')
      .select(`
        *,
        student:student_id(id, name, avatar_url, email),
        advisor:advisor_id(id, name, avatar_url, email),
        last_message:messages(content, timestamp, sender_id, message_type)
      `)
      .order('last_activity', { ascending: false });

    if (userRole === 'student') {
      query = query.eq('student_id', userId);
    } else if (userRole === 'advisor') {
      query = query.eq('advisor_id', userId);
    } else {
      // Admin can see all chat rooms
      query = query;
    }

    const { data: chatRooms, error } = await query;

    if (error) {
      logger.error('Error fetching chat rooms:', error);
      throw error;
    }

    // Get unread message counts for each chat room
    const chatRoomsWithUnread = await Promise.all(
      chatRooms.map(async (room) => {
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_room_id', room.id)
          .eq('receiver_id', userId)
          .eq('is_read', false);

        return {
          ...room,
          unread_count: unreadCount || 0,
          last_message: room.last_message?.[0] || null
        };
      })
    );

    res.status(200).json({
      success: true,
      data: chatRoomsWithUnread
    });
  } catch (error) {
    logger.error('Get chat rooms error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat rooms'
    });
  }
});

// @route   POST /api/chat/rooms
// @desc    Create or get existing chat room
// @access  Private
router.post('/rooms',
  [
    body('participantId').isUUID().withMessage('Valid participant ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { participantId } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Determine student and advisor IDs
      let studentId, advisorId;
      
      if (userRole === 'student') {
        studentId = userId;
        advisorId = participantId;
      } else if (userRole === 'advisor') {
        studentId = participantId;
        advisorId = userId;
      } else {
        return res.status(403).json({
          success: false,
          error: 'Only students and advisors can create chat rooms'
        });
      }

      // Check if chat room already exists
      const { data: existingRoom, error: fetchError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('student_id', studentId)
        .eq('advisor_id', advisorId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        logger.error('Error checking existing chat room:', fetchError);
        throw fetchError;
      }

      if (existingRoom) {
        return res.status(200).json({
          success: true,
          data: existingRoom,
          message: 'Chat room already exists'
        });
      }

      // Create new chat room
      const { data: newRoom, error: createError } = await supabase
        .from('chat_rooms')
        .insert([{
          student_id: studentId,
          advisor_id: advisorId
        }])
        .select()
        .single();

      if (createError) {
        logger.error('Error creating chat room:', createError);
        throw createError;
      }

      logger.info(`Chat room created: ${newRoom.id} between ${studentId} and ${advisorId}`);

      res.status(201).json({
        success: true,
        data: newRoom,
        message: 'Chat room created successfully'
      });
    } catch (error) {
      logger.error('Create chat room error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create chat room'
      });
    }
  }
);

// @route   GET /api/chat/rooms/:roomId/messages
// @desc    Get messages for a chat room
// @access  Private
router.get('/rooms/:roomId/messages',
  [
    param('roomId').isUUID().withMessage('Valid room ID is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { roomId } = req.params;
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;
      const offset = (page - 1) * limit;

      // Verify user has access to this chat room
      const { data: chatRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .or(`student_id.eq.${userId},advisor_id.eq.${userId}`)
        .single();

      if (roomError || !chatRoom) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this chat room'
        });
      }

      // Get messages with sender information
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, name, avatar_url),
          receiver:receiver_id(id, name, avatar_url),
          reply_to:reply_to_message_id(id, content, sender_id),
          reactions:message_reactions(id, user_id, emoji, created_at),
          attachments:file_attachments(*)
        `)
        .eq('chat_room_id', roomId)
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (messagesError) {
        logger.error('Error fetching messages:', messagesError);
        throw messagesError;
      }

      // Get total count for pagination
      const { count: totalCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('chat_room_id', roomId);

      res.status(200).json({
        success: true,
        data: messages.reverse(), // Reverse to show oldest first
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      });
    } catch (error) {
      logger.error('Get messages error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch messages'
      });
    }
  }
);

// @route   POST /api/chat/rooms/:roomId/messages
// @desc    Send a message
// @access  Private
router.post('/rooms/:roomId/messages',
  [
    param('roomId').isUUID().withMessage('Valid room ID is required'),
    body('content').trim().isLength({ min: 1, max: 10000 }).withMessage('Message content is required and must be under 10,000 characters'),
    body('messageType').optional().isIn(['text', 'file', 'image', 'voice']).withMessage('Invalid message type'),
    body('replyToMessageId').optional().isUUID().withMessage('Reply to message ID must be valid UUID'),
    body('metadata').optional().isObject().withMessage('Metadata must be an object')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { roomId } = req.params;
      const { content, messageType = 'text', replyToMessageId, metadata } = req.body;
      const senderId = req.user.id;

      // Verify user has access to this chat room and get receiver
      const { data: chatRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', roomId)
        .or(`student_id.eq.${senderId},advisor_id.eq.${senderId}`)
        .single();

      if (roomError || !chatRoom) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this chat room'
        });
      }

      // Determine receiver ID
      const receiverId = chatRoom.student_id === senderId ? chatRoom.advisor_id : chatRoom.student_id;

      // Create message
      const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert([{
          chat_room_id: roomId,
          sender_id: senderId,
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

      logger.info(`Message sent in room ${roomId} from ${senderId} to ${receiverId}`);

      res.status(201).json({
        success: true,
        data: message,
        message: 'Message sent successfully'
      });
    } catch (error) {
      logger.error('Send message error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message'
      });
    }
  }
);

// @route   PUT /api/chat/messages/:messageId
// @desc    Edit a message
// @access  Private
router.put('/messages/:messageId',
  [
    param('messageId').isUUID().withMessage('Valid message ID is required'),
    body('content').trim().isLength({ min: 1, max: 10000 }).withMessage('Message content is required and must be under 10,000 characters')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      // Update message (only sender can edit)
      const { data: message, error } = await supabase
        .from('messages')
        .update({
          content,
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .eq('sender_id', userId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            success: false,
            error: 'Message not found or you do not have permission to edit it'
          });
        }
        logger.error('Error editing message:', error);
        throw error;
      }

      res.status(200).json({
        success: true,
        data: message,
        message: 'Message updated successfully'
      });
    } catch (error) {
      logger.error('Edit message error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to edit message'
      });
    }
  }
);

// @route   DELETE /api/chat/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/messages/:messageId',
  [
    param('messageId').isUUID().withMessage('Valid message ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;

      // Delete message (only sender can delete)
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId);

      if (error) {
        logger.error('Error deleting message:', error);
        throw error;
      }

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      logger.error('Delete message error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete message'
      });
    }
  }
);

// @route   POST /api/chat/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.post('/messages/:messageId/read',
  [
    param('messageId').isUUID().withMessage('Valid message ID is required')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.user.id;

      // Update message as read (only receiver can mark as read)
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('receiver_id', userId);

      if (error) {
        logger.error('Error marking message as read:', error);
        throw error;
      }

      // Create read receipt
      await supabase
        .from('message_read_receipts')
        .upsert([{
          message_id: messageId,
          user_id: userId
        }]);

      res.status(200).json({
        success: true,
        message: 'Message marked as read'
      });
    } catch (error) {
      logger.error('Mark message as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark message as read'
      });
    }
  }
);

// @route   POST /api/chat/rooms/:roomId/typing
// @desc    Update typing status
// @access  Private
router.post('/rooms/:roomId/typing',
  [
    param('roomId').isUUID().withMessage('Valid room ID is required'),
    body('isTyping').isBoolean().withMessage('isTyping must be a boolean')
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { roomId } = req.params;
      const { isTyping } = req.body;
      const userId = req.user.id;

      if (isTyping) {
        // Insert or update typing indicator
        await supabase
          .from('typing_indicators')
          .upsert([{
            chat_room_id: roomId,
            user_id: userId,
            is_typing: true
          }]);
      } else {
        // Remove typing indicator
        await supabase
          .from('typing_indicators')
          .delete()
          .eq('chat_room_id', roomId)
          .eq('user_id', userId);
      }

      res.status(200).json({
        success: true,
        message: 'Typing status updated'
      });
    } catch (error) {
      logger.error('Update typing status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update typing status'
      });
    }
  }
);

module.exports = router;