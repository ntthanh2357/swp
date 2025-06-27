import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  Smile, 
  Image, 
  File,
  Download,
  Reply,
  Edit3,
  Trash2,
  Check,
  CheckCheck,
  Users,
  Settings,
  Archive,
  Pin,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Copy,
  Forward,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Message, ChatRoom, FileAttachment } from '../types';
import AvatarUpload from '../components/AvatarUpload';

// Simulated Socket.IO connection
class SocketService {
  private listeners: { [event: string]: Function[] } = {};
  private connected = false;
  private userId: string | null = null;

  connect(userId: string) {
    this.userId = userId;
    this.connected = true;
    console.log(`Socket connected for user: ${userId}`);
    
    // Simulate connection success
    setTimeout(() => {
      this.emit('connected', { userId });
    }, 100);
  }

  disconnect() {
    this.connected = false;
    this.userId = null;
    console.log('Socket disconnected');
  }

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event: string, data: any) {
    console.log(`Emitting ${event}:`, data);
    
    // Simulate server responses
    if (event === 'send_message') {
      setTimeout(() => {
        this.trigger('message_sent', { ...data, id: Date.now().toString() });
      }, 100);
      
      // Simulate message delivery to other user
      setTimeout(() => {
        this.trigger('message_received', { 
          ...data, 
          id: Date.now().toString(),
          delivered: true 
        });
      }, 200);
    }
    
    if (event === 'typing_start') {
      setTimeout(() => {
        this.trigger('user_typing', { userId: data.receiverId, typing: true });
      }, 50);
    }
    
    if (event === 'typing_stop') {
      setTimeout(() => {
        this.trigger('user_typing', { userId: data.receiverId, typing: false });
      }, 50);
    }
    
    if (event === 'mark_as_read') {
      setTimeout(() => {
        this.trigger('messages_read', { chatRoomId: data.chatRoomId, userId: this.userId });
      }, 100);
    }
  }

  private trigger(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

const socketService = new SocketService();

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ [key: string]: boolean }>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Messages organized by chat room ID
  const messagesByRoom: { [chatRoomId: string]: Message[] } = {
    'admin-1': [
      {
        id: '10',
        senderId: '1',
        receiverId: '3',
        content: 'Hi Admin, I have a question about the scholarship approval process.',
        type: 'text',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: false,
      },
      {
        id: '11',
        senderId: '3',
        receiverId: '1',
        content: 'Hello! I\'d be happy to help you with the scholarship approval process. What specific questions do you have?',
        type: 'text',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
      }
    ],
    'admin-2': [
      {
        id: '12',
        senderId: '2',
        receiverId: '3',
        content: 'Thank you for approving my advisor account!',
        type: 'text',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '13',
        senderId: '3',
        receiverId: '2',
        content: 'You\'re welcome! Your qualifications were impressive. I\'m sure you\'ll help many students succeed.',
        type: 'text',
        timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
        read: true,
      }
    ],
    '1': [
      {
        id: '1',
        senderId: '1',
        receiverId: '2',
        content: 'Hi Dr. Johnson, I hope you\'re doing well. I wanted to follow up on our last session about scholarship opportunities for Computer Science students.',
        type: 'text',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '2',
        senderId: '2',
        receiverId: '1',
        content: 'Hello! Yes, I\'ve been researching some excellent opportunities that match your profile perfectly. Let me share what I found.',
        type: 'text',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '3',
        senderId: '2',
        receiverId: '1',
        content: 'scholarship-opportunities-2024.pdf',
        type: 'file',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '4',
        senderId: '2',
        receiverId: '1',
        content: 'I found some excellent scholarship opportunities that match your Computer Science background. The Microsoft and Google programs both have upcoming deadlines.',
        type: 'text',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: user?.role === 'student' ? false : true,
      },
      {
        id: '5',
        senderId: '2',
        receiverId: '1',
        content: 'The Microsoft Scholarship Program offers $5,000 and has a deadline of March 15th. The Google Developer Scholarship is worth $10,000 with a February 28th deadline.',
        type: 'text',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: user?.role === 'student' ? false : true,
      },
      {
        id: '6',
        senderId: '1',
        receiverId: '2',
        content: 'That sounds amazing! Could you send me the detailed application requirements for both scholarships? I want to make sure I have everything ready.',
        type: 'text',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '7',
        senderId: '2',
        receiverId: '1',
        content: 'application-requirements-checklist.pdf',
        type: 'file',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
      },
      {
        id: '8',
        senderId: '2',
        receiverId: '1',
        content: 'I\'ve attached a comprehensive checklist. Would you like to schedule a video call this week to go through your application strategy?',
        type: 'text',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        read: true,
      },
    ],
    '2': [
      {
        id: '20',
        senderId: '3',
        receiverId: '2',
        content: 'Hello Dr. Johnson! I\'m Trần Thị Bình, a medical student interested in studying abroad.',
        type: 'text',
        timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '21',
        senderId: '2',
        receiverId: '3',
        content: 'Hello Bình! I\'d be delighted to help you with your medical school applications. What countries are you considering?',
        type: 'text',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '22',
        senderId: '3',
        receiverId: '2',
        content: 'I\'m mainly looking at the US and UK. I have a strong MCAT score and research experience.',
        type: 'text',
        timestamp: new Date(Date.now() - 24.5 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '23',
        senderId: '2',
        receiverId: '3',
        content: 'Excellent! Both the US and UK have fantastic medical programs. Let me help you identify the best scholarship opportunities.',
        type: 'text',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '24',
        senderId: '3',
        receiverId: '2',
        content: 'Thank you for reviewing my personal statement. Your feedback was incredibly helpful!',
        type: 'text',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
      },
    ],
    '3': [
      {
        id: '30',
        senderId: '1',
        receiverId: '4',
        content: 'Hi Prof. Chen, I\'m interested in MBA programs and business scholarships.',
        type: 'text',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '31',
        senderId: '4',
        receiverId: '1',
        content: 'Great to meet you! I\'d love to help you with your MBA journey. What\'s your background and target schools?',
        type: 'text',
        timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '32',
        senderId: '4',
        receiverId: '1',
        content: 'Let\'s schedule a video call to discuss your MBA application strategy.',
        type: 'text',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
      },
    ],
  };

  // Enhanced chat rooms with more realistic data
  const chatRooms: ChatRoom[] = [
    // For admin, show all users they can chat with
    ...(user?.role === 'admin' ? [
      {
        id: 'admin-1',
        studentId: '1',
        advisorId: '3', // admin ID
        lastMessage: {
          id: '10',
          senderId: '1',
          receiverId: '3',
          content: 'Hi Admin, I have a question about the scholarship approval process.',
          type: 'text',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          read: false,
        },
        lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
        unreadCount: 1,
      },
      {
        id: 'admin-2',
        studentId: '2',
        advisorId: '3', // admin ID
        lastMessage: {
          id: '11',
          senderId: '2',
          receiverId: '3',
          content: 'Thank you for approving my advisor account!',
          type: 'text',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          read: true,
        },
        lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
        unreadCount: 0,
      }
    ] : []),
    {
      id: '1',
      studentId: '1',
      advisorId: '2',
      lastMessage: {
        id: '4',
        senderId: '2',
        receiverId: '1',
        content: 'I found some excellent scholarship opportunities that match your Computer Science background. The Microsoft and Google programs both have upcoming deadlines.',
        type: 'text',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: user?.role === 'student' ? false : true,
      },
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: user?.role === 'student' ? 3 : 0,
    },
    {
      id: '2',
      studentId: '3',
      advisorId: '2',
      lastMessage: {
        id: '5',
        senderId: '3',
        receiverId: '2',
        content: 'Thank you for reviewing my personal statement. Your feedback was incredibly helpful!',
        type: 'text',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
      },
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 0,
    },
    {
      id: '3',
      studentId: '1',
      advisorId: '4',
      lastMessage: {
        id: '6',
        senderId: '4',
        receiverId: '1',
        content: 'Let\'s schedule a video call to discuss your MBA application strategy.',
        type: 'text',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
      },
      lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
    },
  ];

  // Get messages for the current chat room
  const [allMessages, setAllMessages] = useState<{ [chatRoomId: string]: Message[] }>(messagesByRoom);
  
  // Get messages for selected chat
  const messages = selectedChat ? (allMessages[selectedChat] || []) : [];

  const emojis = ['😊', '😂', '❤️', '👍', '👏', '🎉', '🔥', '💯', '🤔', '😍', '🙏', '✨', '📚', '🎓', '💪', '🌟'];

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      socketService.connect(user.id);
      
      // Set up socket event listeners
      socketService.on('message_received', handleMessageReceived);
      socketService.on('message_sent', handleMessageSent);
      socketService.on('user_typing', handleUserTyping);
      socketService.on('user_online', handleUserOnline);
      socketService.on('user_offline', handleUserOffline);
      socketService.on('messages_read', handleMessagesRead);
      
      return () => {
        socketService.off('message_received', handleMessageReceived);
        socketService.off('message_sent', handleMessageSent);
        socketService.off('user_typing', handleUserTyping);
        socketService.off('user_online', handleUserOnline);
        socketService.off('user_offline', handleUserOffline);
        socketService.off('messages_read', handleMessagesRead);
        socketService.disconnect();
      };
    }
  }, [user]);

  const handleMessageReceived = (data: any) => {
    // Only add messages from other users, not from the current user
    if (data.senderId !== user?.id) {
      const newMessage: Message = {
        id: data.id,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        type: data.type,
        timestamp: new Date(data.timestamp),
        read: false,
      };
      
      if (selectedChat) {
        setAllMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage]
        }));
      }
    }
  };

  const handleMessageSent = (data: any) => {
    if (selectedChat) {
      setAllMessages(prev => {
        const roomMessages = prev[selectedChat] || [];
        // Find the temporary message and update it with real ID
        const tempMessage = roomMessages.find(msg => 
          msg.id.startsWith('temp-') && 
          msg.content === data.content && 
          msg.senderId === data.senderId
        );
        
        if (tempMessage) {
          return {
            ...prev,
            [selectedChat]: roomMessages.map(msg => 
              msg.id === tempMessage.id 
                ? { ...msg, id: data.id, timestamp: new Date(data.timestamp) }
                : msg
            )
          };
        }
      
        return prev;
      });
    }
  };

  const handleUserTyping = (data: any) => {
    setTypingUsers(prev => ({ ...prev, [data.userId]: data.typing }));
    
    if (data.typing) {
      setTimeout(() => {
        setTypingUsers(prev => ({ ...prev, [data.userId]: false }));
      }, 3000);
    }
  };

  const handleUserOnline = (data: any) => {
    setOnlineUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
  };

  const handleUserOffline = (data: any) => {
    setOnlineUsers(prev => prev.filter(id => id !== data.userId));
  };

  const handleMessagesRead = (data: any) => {
    if (selectedChat) {
      setAllMessages(prev => ({
        ...prev,
        [selectedChat]: (prev[selectedChat] || []).map(msg => 
          msg.receiverId === data.userId ? { ...msg, read: true } : msg
        )
      }));
    }
  };

  const getOtherParticipant = (chatRoom: ChatRoom) => {
    if (user?.role === 'admin') {
      // For admin chats, determine if chatting with student or advisor
      const isStudentChat = chatRoom.studentId !== user.id;
      const otherUserId = isStudentChat ? chatRoom.studentId : chatRoom.advisorId;
      const isAdvisorChat = chatRoom.advisorId !== user.id && chatRoom.advisorId !== chatRoom.studentId;
      
      if (otherUserId === '1') {
        return {
          id: '1',
          name: 'Nguyễn Văn An',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1',
          role: 'student',
          status: onlineUsers.includes('1') ? 'online' : 'offline',
          lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        };
      } else if (otherUserId === '2') {
        return {
          id: '2',
          name: 'Dr. Sarah Johnson',
          avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1',
          role: 'advisor',
          status: onlineUsers.includes('2') ? 'online' : 'offline',
          lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        };
      }
    } else if (user?.role === 'student') {
      return {
        id: chatRoom.advisorId,
        name: chatRoom.advisorId === '2' ? 'Dr. Sarah Johnson' : 'Prof. Michael Chen',
        avatar: user?.avatar || `https://images.pexels.com/photos/${chatRoom.advisorId === '2' ? '1181690' : '1222271'}/pexels-photo-${chatRoom.advisorId === '2' ? '1181690' : '1222271'}.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1`,
        role: 'advisor',
        status: onlineUsers.includes(chatRoom.advisorId) ? 'online' : 'offline',
        lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
      };
    } else {
      return {
        id: chatRoom.studentId,
        name: chatRoom.studentId === '1' ? 'Nguyễn Văn An' : 'Trần Thị Bình',
        avatar: user?.avatar || `https://images.pexels.com/photos/${chatRoom.studentId === '1' ? '1239291' : '1181686'}/pexels-photo-${chatRoom.studentId === '1' ? '1239291' : '1181686'}.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1`,
        role: 'student',
        status: onlineUsers.includes(chatRoom.studentId) ? 'online' : 'offline',
        lastSeen: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
      };
    }
    
    // Fallback
    return {
      id: 'unknown',
      name: 'Unknown User',
      avatar: '',
      role: 'student',
      status: 'offline',
      lastSeen: new Date(),
    };
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const otherParticipant = getOtherParticipant(chatRooms.find(room => room.id === selectedChat)!);
      
      const newMessage: Message = {
        id: `temp-${Date.now()}`, // Use temporary ID
        senderId: user!.id,
        receiverId: otherParticipant.id,
        content: messageInput.trim(),
        type: 'text',
        timestamp: new Date(),
        read: false,
        ...(replyingTo && { replyTo: replyingTo.id }),
      };

      if (selectedChat) {
        setAllMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage]
        }));
      }
      
      // Emit to socket
      socketService.emit('send_message', {
        chatRoomId: selectedChat,
        senderId: user!.id,
        receiverId: otherParticipant.id,
        content: messageInput.trim(),
        type: 'text',
        timestamp: new Date().toISOString(),
      });

      setMessageInput('');
      setReplyingTo(null);
      handleStopTyping();
    }
  };

  const handleStartTyping = () => {
    if (!isTyping && selectedChat) {
      setIsTyping(true);
      const otherParticipant = getOtherParticipant(chatRooms.find(room => room.id === selectedChat)!);
      socketService.emit('typing_start', {
        chatRoomId: selectedChat,
        senderId: user!.id,
        receiverId: otherParticipant.id,
      });
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 2000);
  };

  const handleStopTyping = () => {
    if (isTyping && selectedChat) {
      setIsTyping(false);
      const otherParticipant = getOtherParticipant(chatRooms.find(room => room.id === selectedChat)!);
      socketService.emit('typing_stop', {
        chatRoomId: selectedChat,
        senderId: user!.id,
        receiverId: otherParticipant.id,
      });
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (selectedChat) {
      setAllMessages(prev => ({
        ...prev,
        [selectedChat]: (prev[selectedChat] || []).map(msg => 
          msg.id === messageId 
            ? { ...msg, content: newContent, edited: true, editedAt: new Date() }
            : msg
        )
      }));
    }
    setEditingMessage(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (selectedChat) {
      setAllMessages(prev => ({
        ...prev,
        [selectedChat]: (prev[selectedChat] || []).filter(msg => msg.id !== messageId)
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedChat) {
      const otherParticipant = getOtherParticipant(chatRooms.find(room => room.id === selectedChat)!);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: user!.id,
        receiverId: otherParticipant.id,
        content: file.name,
        type: 'file',
        timestamp: new Date(),
        read: false,
      };

      if (selectedChat) {
        setAllMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage]
        }));
      }
        setAllMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage]
        }));
      }
      
      socketService.emit('send_message', {
        chatRoomId: selectedChat,
        senderId: user!.id,
        receiverId: otherParticipant.id,
        content: file.name,
        type: 'file',
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingMessage) {
        handleEditMessage(editingMessage, messageInput);
      } else {
        handleSendMessage();
      }
    }
  };

  const handleTyping = (value: string) => {
    setMessageInput(value);
    if (value.length > 0) {
      handleStartTyping();
    } else {
      handleStopTyping();
    }
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setIsInCall(true);
    setCallType(type);
    // In real app, initiate WebRTC call
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setCallType(null);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatLastActivity = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getRepliedMessage = (replyToId: string) => {
    return messages.find(msg => msg.id === replyToId);
  };

  const markAsRead = (chatRoomId: string) => {
    socketService.emit('mark_as_read', { chatRoomId });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (chatRooms.length > 0 && !selectedChat) {
      setSelectedChat(chatRooms[0].id);
    }
  }, [chatRooms, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat);
    }
  }, [selectedChat]);

  const filteredChatRooms = chatRooms.filter(room => {
    const participant = getOtherParticipant(room);
    return participant.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedChatRoom = chatRooms.find(room => room.id === selectedChat);
  const selectedParticipant = selectedChatRoom ? getOtherParticipant(selectedChatRoom) : null;

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Chat List Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                <Archive className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChatRooms.map((chatRoom) => {
            const participant = getOtherParticipant(chatRoom);
            const isTyping = typingUsers[participant.id];
            
            return (
              <div
                key={chatRoom.id}
                onClick={() => setSelectedChat(chatRoom.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedChat === chatRoom.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <AvatarUpload
                      currentAvatar={participant.avatar}
                      userName={participant.name}
                      userId={participant.id}
                      onAvatarChange={() => {}} // Read-only in chat list
                      size="md"
                      editable={false}
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      participant.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {participant.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatLastActivity(chatRoom.lastActivity)}
                        </span>
                        {chatRoom.unreadCount > 0 && (
                          <div className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chatRoom.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-1">
                      {isTyping ? (
                        <p className="text-xs text-blue-600 italic flex items-center">
                          <span className="flex space-x-1 mr-2">
                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </span>
                          typing...
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600 truncate">
                          {chatRoom.lastMessage?.type === 'file' ? (
                            <span className="flex items-center">
                              <File className="h-3 w-3 mr-1" />
                              {chatRoom.lastMessage.content}
                            </span>
                          ) : (
                            chatRoom.lastMessage?.content
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedParticipant ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AvatarUpload
                    currentAvatar={selectedParticipant.avatar}
                    userName={selectedParticipant.name}
                    userId={selectedParticipant.id}
                    onAvatarChange={() => {}} // Read-only in chat header
                    size="sm"
                    editable={false}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedParticipant.name}
                    </h2>
                    <p className="text-sm text-gray-600 capitalize flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        selectedParticipant.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></span>
                      {selectedParticipant.status === 'online' ? 'Online' : `Last seen ${formatLastActivity(selectedParticipant.lastSeen)}`} • {selectedParticipant.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isInCall ? (
                    <>
                      <button 
                        onClick={() => handleStartCall('voice')}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleStartCall('video')}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Video className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className={`p-2 rounded-lg ${isMuted ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                        >
                          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </button>
                        {callType === 'video' && (
                          <button
                            onClick={() => setIsVideoOff(!isVideoOff)}
                            className={`p-2 rounded-lg ${isVideoOff ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                          >
                            {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                          </button>
                        )}
                        <button
                          onClick={handleEndCall}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <PhoneOff className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm text-red-600 font-medium">
                        {callType === 'video' ? 'Video Call' : 'Voice Call'} • 05:23
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={() => setShowChatInfo(!showChatInfo)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Info className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Call Interface */}
            {isInCall && (
              <div className="bg-gray-900 text-white p-4 flex items-center justify-center">
                <div className="text-center">
                  <img
                    src={selectedParticipant.avatar}
                    alt={selectedParticipant.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{selectedParticipant.name}</h3>
                  <p className="text-gray-300">
                    {callType === 'video' ? 'Video call in progress...' : 'Voice call in progress...'}
                  </p>
                </div>
              </div>
            )}

            {/* Reply Banner */}
            {replyingTo && (
              <div className="bg-blue-50 border-b border-blue-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Reply className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Replying to: {replyingTo.content.substring(0, 50)}...
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id;
                const repliedMessage = message.replyTo ? getRepliedMessage(message.replyTo) : null;
                const isSelected = selectedMessages.includes(message.id);
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md group relative ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {/* Replied Message Preview */}
                      {repliedMessage && (
                        <div className={`mb-1 p-2 rounded-lg text-xs border-l-2 ${
                          isOwnMessage 
                            ? 'bg-blue-100 border-blue-400 text-blue-800' 
                            : 'bg-gray-100 border-gray-400 text-gray-600'
                        }`}>
                          <p className="font-medium">
                            {repliedMessage.senderId === user?.id ? 'You' : selectedParticipant.name}
                          </p>
                          <p className="truncate">{repliedMessage.content}</p>
                        </div>
                      )}

                      <div className={`px-4 py-2 rounded-lg relative ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                        {message.type === 'file' ? (
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4" />
                            <span className="text-sm">{message.content}</span>
                            <button className="p-1 hover:bg-black/10 rounded">
                              <Download className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                        
                        <div className={`flex items-center justify-between mt-1 text-xs ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>
                            {formatTime(message.timestamp)}
                            {message.edited && <span className="ml-1">(edited)</span>}
                          </span>
                          {isOwnMessage && (
                            <div className="flex items-center space-x-1">
                              {message.read ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Message Actions */}
                        <div className={`absolute top-0 ${isOwnMessage ? 'left-0' : 'right-0'} transform ${
                          isOwnMessage ? '-translate-x-full' : 'translate-x-full'
                        } opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 p-1`}>
                          <button
                            onClick={() => setReplyingTo(message)}
                            className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                            title="Reply"
                          >
                            <Reply className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                            }}
                            className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                            title="Copy"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                          {isOwnMessage && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingMessage(message.id);
                                  setMessageInput(message.content);
                                }}
                                className="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                                title="Edit"
                              >
                                <Edit3 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="p-1 bg-red-600 text-white rounded hover:bg-red-500"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reply button for received messages */}
                    {!isOwnMessage && (
                      <button
                        onClick={() => setReplyingTo(message)}
                        className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                      >
                        <Reply className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                <div className="grid grid-cols-8 gap-2">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMessageInput(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-xl hover:bg-gray-100 p-1 rounded"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Send image"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording 
                        ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Record voice message'}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                </div>
                
                <div className="flex-1 relative">
                  <textarea
                    value={messageInput}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={editingMessage ? "Edit message..." : "Type your message..."}
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                    style={{ minHeight: '40px' }}
                  />
                </div>
                
                <button
                  onClick={editingMessage ? () => handleEditMessage(editingMessage, messageInput) : handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={editingMessage ? 'Save changes' : 'Send message'}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              
              {editingMessage && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  <Edit3 className="h-4 w-4" />
                  <span>Editing message</span>
                  <button
                    onClick={() => {
                      setEditingMessage(null);
                      setMessageInput('');
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {isRecording && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span>Recording... 00:15</span>
                  <button
                    onClick={() => setIsRecording(false)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a conversation from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Info Sidebar */}
      {showChatInfo && selectedParticipant && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="text-center mb-6">
            <AvatarUpload
              currentAvatar={selectedParticipant.avatar}
              userName={selectedParticipant.name}
              userId={selectedParticipant.id}
              onAvatarChange={() => {}} // Read-only in chat info
              size="lg"
              editable={false}
              className="mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900">{selectedParticipant.name}</h3>
            <p className="text-gray-600 capitalize">{selectedParticipant.role}</p>
            <div className="flex items-center justify-center mt-2">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                selectedParticipant.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
              }`}></span>
              <span className="text-sm text-gray-600">
                {selectedParticipant.status === 'online' ? 'Online' : `Last seen ${formatLastActivity(selectedParticipant.lastSeen)}`}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <span>Voice Call</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Video className="h-5 w-5 text-gray-600" />
                  <span>Video Call</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg">
                  <Archive className="h-5 w-5 text-gray-600" />
                  <span>Archive Chat</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Shared Files</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <File className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">scholarship-opportunities-2024.pdf</span>
                </div>
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                  <File className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">application-requirements-checklist.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;