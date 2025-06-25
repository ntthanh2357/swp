export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'advisor' | 'admin';
  avatar?: string;
  emailVerified?: boolean;
  createdAt: Date;
}

export interface Student extends User {
  role: 'student';
  targetCountry?: string;
  fieldOfStudy?: string;
  academicLevel?: string;
  bio?: string;
  gpa?: number;
  englishScore?: {
    type: 'IELTS' | 'TOEFL';
    score: number;
  };
}

export interface Advisor extends User {
  role: 'advisor';
  status: 'pending' | 'approved' | 'rejected';
  specializations: string[];
  countries: string[];
  languages: string[];
  experience: string;
  education: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  availability: boolean;
  bio: string;
  packages: ConsultingPackage[];
  verified: boolean;
  totalStudents: number;
  successRate: number;
}

export interface ConsultingPackage {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  features: string[];
}

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  currency: string;
  deadline: Date;
  country: string;
  fieldOfStudy: string[];
  academicLevel: string[];
  requirements: string[];
  description: string;
  applicationUrl: string;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  isSaved?: boolean;
  hasApplied?: boolean;
}

export interface SavedScholarship {
  id: string;
  userId: string;
  scholarshipId: string;
  savedAt: Date;
  notes?: string;
}

export interface ScholarshipApplication {
  id: string;
  userId: string;
  scholarshipId: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
  appliedAt: Date;
  lastUpdated: Date;
  deadline: Date;
  documents: ApplicationDocument[];
  personalStatement?: string;
  additionalInfo?: string;
  canWithdraw: boolean;
  canUpdate: boolean;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: 'transcript' | 'essay' | 'recommendation' | 'certificate' | 'cv' | 'other';
  fileUrl: string;
  uploadedAt: Date;
  required: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminChatRoom {
  id: string;
  adminId: string;
  userId: string; // Can be student or advisor
  userRole: 'student' | 'advisor';
  lastMessage?: Message;
  lastActivity: Date;
  unreadCount: number;
}

export interface Consultation {
  id: string;
  studentId: string;
  advisorId: string;
  packageId: string;
  scheduledAt: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
}

export interface Review {
  id: string;
  studentId: string;
  advisorId: string;
  consultationId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'voice';
  timestamp: Date;
  read: boolean;
  delivered?: boolean;
  edited?: boolean;
  editedAt?: Date;
  replyTo?: string; // ID of message being replied to
  reactions?: MessageReaction[];
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    duration?: number; // for voice messages
  };
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface ChatRoom {
  id: string;
  studentId: string;
  advisorId: string;
  lastMessage?: Message;
  lastActivity: Date;
  unreadCount: number;
  isTyping?: {
    userId: string;
    timestamp: Date;
  };
  isPinned?: boolean;
  isArchived?: boolean;
  settings?: {
    notifications: boolean;
    soundEnabled: boolean;
  };
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface CallSession {
  id: string;
  chatRoomId: string;
  initiatorId: string;
  participantId: string;
  type: 'voice' | 'video';
  status: 'ringing' | 'active' | 'ended' | 'missed';
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in seconds
}

export interface TypingIndicator {
  userId: string;
  chatRoomId: string;
  timestamp: Date;
}

export interface OnlineStatus {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: Date;
}

// Database Schema Interfaces for MySQL
export interface DatabaseUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'student' | 'advisor' | 'admin';
  avatar_url?: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface DatabaseMessage {
  id: string;
  chat_room_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image' | 'voice';
  timestamp: Date;
  is_read: boolean;
  is_delivered: boolean;
  is_edited: boolean;
  edited_at?: Date;
  reply_to_message_id?: string;
  metadata?: string; // JSON string
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseChatRoom {
  id: string;
  student_id: string;
  advisor_id: string;
  created_at: Date;
  updated_at: Date;
  last_activity: Date;
  is_archived: boolean;
  settings?: string; // JSON string
}

export interface DatabaseFileAttachment {
  id: string;
  message_id: string;
  original_name: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_path: string;
  uploaded_by: string;
  uploaded_at: Date;
}

export interface DatabaseCallSession {
  id: string;
  chat_room_id: string;
  initiator_id: string;
  participant_id: string;
  call_type: 'voice' | 'video';
  status: 'ringing' | 'active' | 'ended' | 'missed';
  start_time?: Date;
  end_time?: Date;
  duration?: number;
  created_at: Date;
}

export interface DatabaseOnlineStatus {
  user_id: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen: Date;
  updated_at: Date;
}

// Socket.IO Event Types
export interface SocketEvents {
  // Connection events
  connect: () => void;
  disconnect: () => void;
  
  // Message events
  send_message: (data: {
    chatRoomId: string;
    senderId: string;
    receiverId: string;
    content: string;
    type: 'text' | 'file' | 'image' | 'voice';
    replyTo?: string;
    metadata?: any;
  }) => void;
  
  message_received: (message: Message) => void;
  message_sent: (message: Message) => void;
  message_delivered: (data: { messageId: string; timestamp: Date }) => void;
  message_read: (data: { messageId: string; timestamp: Date }) => void;
  
  // Typing events
  typing_start: (data: { chatRoomId: string; userId: string }) => void;
  typing_stop: (data: { chatRoomId: string; userId: string }) => void;
  user_typing: (data: { userId: string; typing: boolean }) => void;
  
  // Online status events
  user_online: (data: { userId: string; timestamp: Date }) => void;
  user_offline: (data: { userId: string; timestamp: Date }) => void;
  status_update: (data: { userId: string; status: string }) => void;
  
  // Call events
  call_initiate: (data: {
    chatRoomId: string;
    callerId: string;
    receiverId: string;
    type: 'voice' | 'video';
  }) => void;
  
  call_accept: (data: { callId: string }) => void;
  call_reject: (data: { callId: string }) => void;
  call_end: (data: { callId: string }) => void;
  
  // Room events
  join_room: (chatRoomId: string) => void;
  leave_room: (chatRoomId: string) => void;
  
  // File upload events
  file_upload_start: (data: { fileName: string; fileSize: number }) => void;
  file_upload_progress: (data: { progress: number }) => void;
  file_upload_complete: (data: { fileId: string; url: string }) => void;
  file_upload_error: (data: { error: string }) => void;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Chat API Endpoints
export interface ChatApiEndpoints {
  // Messages
  getMessages: (chatRoomId: string, page?: number, limit?: number) => Promise<PaginatedResponse<Message>>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<ApiResponse<Message>>;
  editMessage: (messageId: string, content: string) => Promise<ApiResponse<Message>>;
  deleteMessage: (messageId: string) => Promise<ApiResponse>;
  markAsRead: (chatRoomId: string, messageIds: string[]) => Promise<ApiResponse>;
  
  // Chat Rooms
  getChatRooms: (userId: string) => Promise<ApiResponse<ChatRoom[]>>;
  createChatRoom: (studentId: string, advisorId: string) => Promise<ApiResponse<ChatRoom>>;
  archiveChatRoom: (chatRoomId: string) => Promise<ApiResponse>;
  
  // File Upload
  uploadFile: (file: File, chatRoomId: string) => Promise<ApiResponse<FileAttachment>>;
  
  // Call Management
  initiateCall: (chatRoomId: string, type: 'voice' | 'video') => Promise<ApiResponse<CallSession>>;
  endCall: (callId: string) => Promise<ApiResponse>;
  
  // User Status
  updateOnlineStatus: (status: 'online' | 'offline' | 'away' | 'busy') => Promise<ApiResponse>;
  getUserStatus: (userId: string) => Promise<ApiResponse<OnlineStatus>>;
}