/*
  # Chat System Database Schema

  1. New Tables
    - `users` - User accounts with roles
    - `chat_rooms` - Chat sessions between students and advisors  
    - `messages` - Chat messages with metadata
    - `file_attachments` - File uploads in messages
    - `message_reactions` - Message reactions/emojis
    - `call_sessions` - Voice/video call records
    - `online_status` - User online presence
    - `typing_indicators` - Real-time typing status
    - `chat_room_participants` - Future group chat support
    - `message_read_receipts` - Message read tracking
    - `chat_room_settings` - User-specific chat preferences

  2. Security
    - Enable RLS on all tables
    - Add policies for user access control
    - Secure file handling

  3. Performance
    - Optimized indexes for common queries
    - Efficient message pagination
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends the existing user system)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'advisor', 'admin')),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    advisor_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}'
);

-- Add foreign key constraints for chat_rooms
DO $$ BEGIN
    ALTER TABLE chat_rooms ADD CONSTRAINT fk_chat_rooms_student 
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE chat_rooms ADD CONSTRAINT fk_chat_rooms_advisor 
        FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add unique constraint and indexes for chat_rooms
DO $$ BEGIN
    ALTER TABLE chat_rooms ADD CONSTRAINT unique_chat_pair UNIQUE (student_id, advisor_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_rooms_student_id ON chat_rooms(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_advisor_id ON chat_rooms(advisor_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_last_activity ON chat_rooms(last_activity);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_archived ON chat_rooms(is_archived);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'voice')),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE,
    is_delivered BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    reply_to_message_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for messages
DO $$ BEGIN
    ALTER TABLE messages ADD CONSTRAINT fk_messages_chat_room 
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE messages ADD CONSTRAINT fk_messages_sender 
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE messages ADD CONSTRAINT fk_messages_receiver 
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE messages ADD CONSTRAINT fk_messages_reply_to 
        FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for messages table
CREATE INDEX IF NOT EXISTS idx_messages_chat_room_timestamp ON messages(chat_room_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_message_type ON messages(message_type);

-- File attachments table
CREATE TABLE IF NOT EXISTS file_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    original_name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for file_attachments
DO $$ BEGIN
    ALTER TABLE file_attachments ADD CONSTRAINT fk_file_attachments_message 
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE file_attachments ADD CONSTRAINT fk_file_attachments_uploaded_by 
        FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for file_attachments table
CREATE INDEX IF NOT EXISTS idx_file_attachments_message_id ON file_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_file_attachments_uploaded_by ON file_attachments(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_file_attachments_file_type ON file_attachments(file_type);
CREATE INDEX IF NOT EXISTS idx_file_attachments_uploaded_at ON file_attachments(uploaded_at);

-- Message reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    user_id UUID NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for message_reactions
DO $$ BEGIN
    ALTER TABLE message_reactions ADD CONSTRAINT fk_message_reactions_message 
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE message_reactions ADD CONSTRAINT fk_message_reactions_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add unique constraint for message_reactions
DO $$ BEGIN
    ALTER TABLE message_reactions ADD CONSTRAINT unique_user_message_emoji UNIQUE (user_id, message_id, emoji);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for message_reactions table
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON message_reactions(user_id);

-- Call sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL,
    initiator_id UUID NOT NULL,
    participant_id UUID NOT NULL,
    call_type TEXT NOT NULL CHECK (call_type IN ('voice', 'video')),
    status TEXT DEFAULT 'ringing' CHECK (status IN ('ringing', 'active', 'ended', 'missed')),
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration INTEGER, -- Duration in seconds
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for call_sessions
DO $$ BEGIN
    ALTER TABLE call_sessions ADD CONSTRAINT fk_call_sessions_chat_room 
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE call_sessions ADD CONSTRAINT fk_call_sessions_initiator 
        FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE call_sessions ADD CONSTRAINT fk_call_sessions_participant 
        FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for call_sessions table
CREATE INDEX IF NOT EXISTS idx_call_sessions_chat_room_id ON call_sessions(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_initiator_id ON call_sessions(initiator_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_participant_id ON call_sessions(participant_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(status);
CREATE INDEX IF NOT EXISTS idx_call_sessions_created_at ON call_sessions(created_at);

-- Online status table
CREATE TABLE IF NOT EXISTS online_status (
    user_id UUID PRIMARY KEY,
    status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'away', 'busy')),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraint for online_status
DO $$ BEGIN
    ALTER TABLE online_status ADD CONSTRAINT fk_online_status_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for online_status table
CREATE INDEX IF NOT EXISTS idx_online_status_status ON online_status(status);
CREATE INDEX IF NOT EXISTS idx_online_status_last_seen ON online_status(last_seen);

-- Typing indicators table
CREATE TABLE IF NOT EXISTS typing_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    is_typing BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for typing_indicators
DO $$ BEGIN
    ALTER TABLE typing_indicators ADD CONSTRAINT fk_typing_indicators_chat_room 
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE typing_indicators ADD CONSTRAINT fk_typing_indicators_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add unique constraint for typing_indicators
DO $$ BEGIN
    ALTER TABLE typing_indicators ADD CONSTRAINT unique_user_room_typing UNIQUE (user_id, chat_room_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for typing_indicators table
CREATE INDEX IF NOT EXISTS idx_typing_indicators_chat_room_id ON typing_indicators(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_timestamp ON typing_indicators(timestamp);

-- Chat room participants table (for future group chat support)
CREATE TABLE IF NOT EXISTS chat_room_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Add foreign key constraints for chat_room_participants
DO $$ BEGIN
    ALTER TABLE chat_room_participants ADD CONSTRAINT fk_chat_room_participants_chat_room 
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE chat_room_participants ADD CONSTRAINT fk_chat_room_participants_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add unique constraint for chat_room_participants
DO $$ BEGIN
    ALTER TABLE chat_room_participants ADD CONSTRAINT unique_user_room_participant UNIQUE (user_id, chat_room_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for chat_room_participants table
CREATE INDEX IF NOT EXISTS idx_chat_room_participants_chat_room_id ON chat_room_participants(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_participants_user_id ON chat_room_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_participants_is_active ON chat_room_participants(is_active);

-- Message read receipts table
CREATE TABLE IF NOT EXISTS message_read_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    user_id UUID NOT NULL,
    read_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for message_read_receipts
DO $$ BEGIN
    ALTER TABLE message_read_receipts ADD CONSTRAINT fk_message_read_receipts_message 
        FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE message_read_receipts ADD CONSTRAINT fk_message_read_receipts_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add unique constraint for message_read_receipts
DO $$ BEGIN
    ALTER TABLE message_read_receipts ADD CONSTRAINT unique_user_message_receipt UNIQUE (user_id, message_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for message_read_receipts table
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_message_id ON message_read_receipts(message_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_user_id ON message_read_receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_message_read_receipts_read_at ON message_read_receipts(read_at);

-- Chat room settings table
CREATE TABLE IF NOT EXISTS chat_room_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_room_id UUID NOT NULL,
    user_id UUID NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    custom_name TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints for chat_room_settings
DO $$ BEGIN
    ALTER TABLE chat_room_settings ADD CONSTRAINT fk_chat_room_settings_chat_room 
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE chat_room_settings ADD CONSTRAINT fk_chat_room_settings_user 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Add unique constraint for chat_room_settings
DO $$ BEGIN
    ALTER TABLE chat_room_settings ADD CONSTRAINT unique_user_room_settings UNIQUE (user_id, chat_room_id);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for chat_room_settings table
CREATE INDEX IF NOT EXISTS idx_chat_room_settings_chat_room_id ON chat_room_settings(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_room_settings_user_id ON chat_room_settings(user_id);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(receiver_id, is_read, timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_chat_room_recent ON messages(chat_room_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_user_activity ON chat_rooms(student_id, advisor_id, last_activity DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DO $$ BEGIN
    CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_chat_rooms_updated_at 
        BEFORE UPDATE ON chat_rooms 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_messages_updated_at 
        BEFORE UPDATE ON messages 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_online_status_updated_at 
        BEFORE UPDATE ON online_status 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_chat_room_settings_updated_at 
        BEFORE UPDATE ON chat_room_settings 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Function to update chat room activity when message is sent
CREATE OR REPLACE FUNCTION update_chat_room_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chat_rooms 
    SET last_activity = NEW.timestamp 
    WHERE id = NEW.chat_room_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for chat room activity
DO $$ BEGIN
    CREATE TRIGGER update_chat_room_activity_trigger
        AFTER INSERT ON messages
        FOR EACH ROW EXECUTE FUNCTION update_chat_room_activity();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Function to clean up old typing indicators
CREATE OR REPLACE FUNCTION cleanup_old_typing_indicators()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM typing_indicators 
    WHERE timestamp < NOW() - INTERVAL '5 minutes';
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for cleaning up typing indicators
DO $$ BEGIN
    CREATE TRIGGER cleanup_old_typing_indicators_trigger
        BEFORE INSERT ON typing_indicators
        FOR EACH ROW EXECUTE FUNCTION cleanup_old_typing_indicators();
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS Policies for chat_rooms table
CREATE POLICY "Users can read own chat rooms" ON chat_rooms
    FOR SELECT USING (
        auth.uid()::text = student_id::text OR 
        auth.uid()::text = advisor_id::text
    );

CREATE POLICY "Users can create chat rooms" ON chat_rooms
    FOR INSERT WITH CHECK (
        auth.uid()::text = student_id::text OR 
        auth.uid()::text = advisor_id::text
    );

CREATE POLICY "Users can update own chat rooms" ON chat_rooms
    FOR UPDATE USING (
        auth.uid()::text = student_id::text OR 
        auth.uid()::text = advisor_id::text
    );

-- RLS Policies for messages table
CREATE POLICY "Users can read messages in their chat rooms" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = messages.chat_room_id 
            AND (student_id::text = auth.uid()::text OR advisor_id::text = auth.uid()::text)
        )
    );

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.uid()::text = sender_id::text AND
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = messages.chat_room_id 
            AND (student_id::text = auth.uid()::text OR advisor_id::text = auth.uid()::text)
        )
    );

CREATE POLICY "Users can update own messages" ON messages
    FOR UPDATE USING (auth.uid()::text = sender_id::text);

-- RLS Policies for file_attachments table
CREATE POLICY "Users can read file attachments in their messages" ON file_attachments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messages m
            JOIN chat_rooms cr ON m.chat_room_id = cr.id
            WHERE m.id = file_attachments.message_id
            AND (cr.student_id::text = auth.uid()::text OR cr.advisor_id::text = auth.uid()::text)
        )
    );

CREATE POLICY "Users can upload file attachments" ON file_attachments
    FOR INSERT WITH CHECK (auth.uid()::text = uploaded_by::text);

-- RLS Policies for message_reactions table
CREATE POLICY "Users can read reactions in their chat rooms" ON message_reactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messages m
            JOIN chat_rooms cr ON m.chat_room_id = cr.id
            WHERE m.id = message_reactions.message_id
            AND (cr.student_id::text = auth.uid()::text OR cr.advisor_id::text = auth.uid()::text)
        )
    );

CREATE POLICY "Users can add/remove own reactions" ON message_reactions
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for call_sessions table
CREATE POLICY "Users can read own call sessions" ON call_sessions
    FOR SELECT USING (
        auth.uid()::text = initiator_id::text OR 
        auth.uid()::text = participant_id::text
    );

CREATE POLICY "Users can create call sessions" ON call_sessions
    FOR INSERT WITH CHECK (auth.uid()::text = initiator_id::text);

CREATE POLICY "Users can update own call sessions" ON call_sessions
    FOR UPDATE USING (
        auth.uid()::text = initiator_id::text OR 
        auth.uid()::text = participant_id::text
    );

-- RLS Policies for online_status table
CREATE POLICY "Users can read all online status" ON online_status
    FOR SELECT USING (true);

CREATE POLICY "Users can update own status" ON online_status
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for typing_indicators table
CREATE POLICY "Users can read typing indicators in their chat rooms" ON typing_indicators
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = typing_indicators.chat_room_id 
            AND (student_id::text = auth.uid()::text OR advisor_id::text = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage own typing indicators" ON typing_indicators
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for chat_room_participants table
CREATE POLICY "Users can read participants in their chat rooms" ON chat_room_participants
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR
        EXISTS (
            SELECT 1 FROM chat_rooms 
            WHERE id = chat_room_participants.chat_room_id 
            AND (student_id::text = auth.uid()::text OR advisor_id::text = auth.uid()::text)
        )
    );

-- RLS Policies for message_read_receipts table
CREATE POLICY "Users can read receipts in their chat rooms" ON message_read_receipts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM messages m
            JOIN chat_rooms cr ON m.chat_room_id = cr.id
            WHERE m.id = message_read_receipts.message_id
            AND (cr.student_id::text = auth.uid()::text OR cr.advisor_id::text = auth.uid()::text)
        )
    );

CREATE POLICY "Users can manage own read receipts" ON message_read_receipts
    FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for chat_room_settings table
CREATE POLICY "Users can manage own chat room settings" ON chat_room_settings
    FOR ALL USING (auth.uid()::text = user_id::text);