import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Message, OnlineStatus, TypingIndicator } from '../types';

// Custom hook for managing Socket.IO connection and real-time events
export const useSocket = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [chatRoomId: string]: string[] }>({});
  const socketRef = useRef<any>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  // Initialize socket connection
  useEffect(() => {
    if (user && !socketRef.current) {
      connectSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]);

  const connectSocket = () => {
    try {
      // In a real application, you would use actual Socket.IO
      // import io from 'socket.io-client';
      // socketRef.current = io(process.env.REACT_APP_SOCKET_URL, {
      //   auth: { token: user.token },
      //   transports: ['websocket']
      // });

      // Simulated socket for demo purposes
      socketRef.current = createMockSocket();
      
      setupSocketListeners();
      
    } catch (error) {
      console.error('Socket connection error:', error);
      handleReconnect();
    }
  };

  const createMockSocket = () => {
    const listeners: { [event: string]: Function[] } = {};
    
    return {
      connected: false,
      
      connect: () => {
        console.log('Socket connecting...');
        setTimeout(() => {
          socketRef.current.connected = true;
          setIsConnected(true);
          setReconnectAttempts(0);
          
          // Simulate connection success
          listeners['connect']?.forEach(callback => callback());
          
          // Simulate initial online users
          setTimeout(() => {
            listeners['users_online']?.forEach(callback => 
              callback(['user1', 'user2', 'user3'])
            );
          }, 1000);
        }, 1000);
      },
      
      disconnect: () => {
        console.log('Socket disconnecting...');
        socketRef.current.connected = false;
        setIsConnected(false);
        listeners['disconnect']?.forEach(callback => callback());
      },
      
      emit: (event: string, data: any, callback?: Function) => {
        console.log(`Socket emit: ${event}`, data);
        
        // Simulate server responses
        setTimeout(() => {
          switch (event) {
            case 'join_room':
              listeners['room_joined']?.forEach(cb => cb({ roomId: data }));
              break;
            case 'send_message':
              const messageWithId = { ...data, id: Date.now().toString(), timestamp: new Date() };
              listeners['message_sent']?.forEach(cb => cb(messageWithId));
              // Simulate message received by other user
              setTimeout(() => {
                listeners['message_received']?.forEach(cb => cb(messageWithId));
              }, 100);
              break;
            case 'typing_start':
              listeners['user_typing']?.forEach(cb => cb({ 
                chatRoomId: data.chatRoomId, 
                userId: data.senderId, 
                typing: true 
              }));
              break;
            case 'typing_stop':
              listeners['user_typing']?.forEach(cb => cb({ 
                chatRoomId: data.chatRoomId, 
                userId: data.senderId, 
                typing: false 
              }));
              break;
          }
          
          if (callback) callback({ success: true });
        }, 100);
      },
      
      on: (event: string, callback: Function) => {
        if (!listeners[event]) {
          listeners[event] = [];
        }
        listeners[event].push(callback);
      },
      
      off: (event: string, callback?: Function) => {
        if (listeners[event]) {
          if (callback) {
            listeners[event] = listeners[event].filter(cb => cb !== callback);
          } else {
            delete listeners[event];
          }
        }
      }
    };
  };

  const setupSocketListeners = () => {
    if (!socketRef.current) return;

    // Connection events
    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setReconnectAttempts(0);
      
      // Join user to their personal room
      if (user) {
        socketRef.current.emit('join_user_room', { userId: user.id });
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
      handleReconnect();
    });

    socketRef.current.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
      handleReconnect();
    });

    // Message events
    socketRef.current.on('message_received', (message: Message) => {
      console.log('Message received:', message);
      // This would be handled by the component using this hook
    });

    socketRef.current.on('message_sent', (message: Message) => {
      console.log('Message sent confirmation:', message);
    });

    socketRef.current.on('message_delivered', (data: { messageId: string; timestamp: Date }) => {
      console.log('Message delivered:', data);
    });

    socketRef.current.on('message_read', (data: { messageId: string; userId: string; timestamp: Date }) => {
      console.log('Message read:', data);
    });

    // Typing events
    socketRef.current.on('user_typing', (data: { chatRoomId: string; userId: string; typing: boolean }) => {
      setTypingUsers(prev => {
        const roomTyping = prev[data.chatRoomId] || [];
        if (data.typing) {
          if (!roomTyping.includes(data.userId)) {
            return {
              ...prev,
              [data.chatRoomId]: [...roomTyping, data.userId]
            };
          }
        } else {
          return {
            ...prev,
            [data.chatRoomId]: roomTyping.filter(id => id !== data.userId)
          };
        }
        return prev;
      });
    });

    // Online status events
    socketRef.current.on('user_online', (data: { userId: string }) => {
      setOnlineUsers(prev => {
        if (!prev.includes(data.userId)) {
          return [...prev, data.userId];
        }
        return prev;
      });
    });

    socketRef.current.on('user_offline', (data: { userId: string }) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    socketRef.current.on('users_online', (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    // Call events
    socketRef.current.on('call_incoming', (data: any) => {
      console.log('Incoming call:', data);
      // Handle incoming call UI
    });

    socketRef.current.on('call_accepted', (data: any) => {
      console.log('Call accepted:', data);
    });

    socketRef.current.on('call_rejected', (data: any) => {
      console.log('Call rejected:', data);
    });

    socketRef.current.on('call_ended', (data: any) => {
      console.log('Call ended:', data);
    });

    // Start connection
    socketRef.current.connect();
  };

  const handleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${maxReconnectAttempts})`);
      setReconnectAttempts(prev => prev + 1);
      connectSocket();
    }, delay);
  };

  // Socket event emitters
  const emitJoinRoom = (chatRoomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join_room', chatRoomId);
    }
  };

  const emitLeaveRoom = (chatRoomId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave_room', chatRoomId);
    }
  };

  const emitSendMessage = (messageData: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', messageData);
    }
  };

  const emitTypingStart = (chatRoomId: string, receiverId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing_start', { 
        chatRoomId, 
        senderId: user?.id, 
        receiverId 
      });
    }
  };

  const emitTypingStop = (chatRoomId: string, receiverId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing_stop', { 
        chatRoomId, 
        senderId: user?.id, 
        receiverId 
      });
    }
  };

  const emitMarkAsRead = (chatRoomId: string, messageIds: string[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('mark_as_read', { 
        chatRoomId, 
        messageIds, 
        userId: user?.id 
      });
    }
  };

  const emitCallInitiate = (chatRoomId: string, receiverId: string, type: 'voice' | 'video') => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('call_initiate', {
        chatRoomId,
        callerId: user?.id,
        receiverId,
        type
      });
    }
  };

  const emitCallAccept = (callId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('call_accept', { callId });
    }
  };

  const emitCallReject = (callId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('call_reject', { callId });
    }
  };

  const emitCallEnd = (callId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('call_end', { callId });
    }
  };

  // Event listener management
  const addEventListener = (event: string, callback: Function) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const removeEventListener = (event: string, callback?: Function) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    // Connection state
    isConnected,
    reconnectAttempts,
    
    // User state
    onlineUsers,
    typingUsers,
    
    // Event emitters
    emitJoinRoom,
    emitLeaveRoom,
    emitSendMessage,
    emitTypingStart,
    emitTypingStop,
    emitMarkAsRead,
    emitCallInitiate,
    emitCallAccept,
    emitCallReject,
    emitCallEnd,
    
    // Event listeners
    addEventListener,
    removeEventListener,
    
    // Utility
    socket: socketRef.current,
  };
};

export default useSocket;