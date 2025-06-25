-- MySQL Database Schema for Chat System
-- This file contains the complete database structure for the chat functionality

-- Users table (extends the existing user system)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('student', 'advisor', 'admin') NOT NULL,
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_created_at (created_at)
);

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    advisor_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    settings JSON NULL, -- Store chat settings as JSON
    
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (advisor_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_chat_pair (student_id, advisor_id),
    INDEX idx_student_id (student_id),
    INDEX idx_advisor_id (advisor_id),
    INDEX idx_last_activity (last_activity),
    INDEX idx_archived (is_archived)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    chat_room_id VARCHAR(36) NOT NULL,
    sender_id VARCHAR(36) NOT NULL,
    receiver_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'file', 'image', 'voice') DEFAULT 'text',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    is_delivered BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP NULL,
    reply_to_message_id VARCHAR(36) NULL,
    metadata JSON NULL, -- Store file info, voice duration, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reply_to_message_id) REFERENCES messages(id) ON DELETE SET NULL,
    
    INDEX idx_chat_room_timestamp (chat_room_id, timestamp),
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_is_read (is_read),
    INDEX idx_message_type (message_type)
);

-- File attachments table
CREATE TABLE IF NOT EXISTS file_attachments (
    id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL, -- Stored file name
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_by VARCHAR(36) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_message_id (message_id),
    INDEX idx_uploaded_by (uploaded_by),
    INDEX idx_file_type (file_type),
    INDEX idx_uploaded_at (uploaded_at)
);

-- Message reactions table
CREATE TABLE IF NOT EXISTS message_reactions (
    id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_message_emoji (user_id, message_id, emoji),
    INDEX idx_message_id (message_id),
    INDEX idx_user_id (user_id)
);

-- Call sessions table
CREATE TABLE IF NOT EXISTS call_sessions (
    id VARCHAR(36) PRIMARY KEY,
    chat_room_id VARCHAR(36) NOT NULL,
    initiator_id VARCHAR(36) NOT NULL,
    participant_id VARCHAR(36) NOT NULL,
    call_type ENUM('voice', 'video') NOT NULL,
    status ENUM('ringing', 'active', 'ended', 'missed') DEFAULT 'ringing',
    start_time TIMESTAMP NULL,
    end_time TIMESTAMP NULL,
    duration INT NULL, -- Duration in seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_chat_room_id (chat_room_id),
    INDEX idx_initiator_id (initiator_id),
    INDEX idx_participant_id (participant_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Online status table
CREATE TABLE IF NOT EXISTS online_status (
    user_id VARCHAR(36) PRIMARY KEY,
    status ENUM('online', 'offline', 'away', 'busy') DEFAULT 'offline',
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_status (status),
    INDEX idx_last_seen (last_seen)
);

-- Typing indicators table (for real-time typing status)
CREATE TABLE IF NOT EXISTS typing_indicators (
    id VARCHAR(36) PRIMARY KEY,
    chat_room_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    is_typing BOOLEAN DEFAULT TRUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_room (user_id, chat_room_id),
    INDEX idx_chat_room_id (chat_room_id),
    INDEX idx_timestamp (timestamp)
);

-- Chat room participants table (for group chats - future extension)
CREATE TABLE IF NOT EXISTS chat_room_participants (
    id VARCHAR(36) PRIMARY KEY,
    chat_room_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    role ENUM('member', 'admin') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_room (user_id, chat_room_id),
    INDEX idx_chat_room_id (chat_room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_is_active (is_active)
);

-- Message read receipts table
CREATE TABLE IF NOT EXISTS message_read_receipts (
    id VARCHAR(36) PRIMARY KEY,
    message_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_message (user_id, message_id),
    INDEX idx_message_id (message_id),
    INDEX idx_user_id (user_id),
    INDEX idx_read_at (read_at)
);

-- Chat room settings table
CREATE TABLE IF NOT EXISTS chat_room_settings (
    id VARCHAR(36) PRIMARY KEY,
    chat_room_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    custom_name VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_room_settings (user_id, chat_room_id),
    INDEX idx_chat_room_id (chat_room_id),
    INDEX idx_user_id (user_id)
);

-- Indexes for performance optimization
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read, timestamp);
CREATE INDEX idx_messages_chat_room_recent ON messages(chat_room_id, timestamp DESC);
CREATE INDEX idx_chat_rooms_user_activity ON chat_rooms(student_id, advisor_id, last_activity DESC);

-- Views for common queries
CREATE VIEW chat_room_summary AS
SELECT 
    cr.id,
    cr.student_id,
    cr.advisor_id,
    cr.last_activity,
    cr.is_archived,
    COUNT(CASE WHEN m.is_read = FALSE AND m.receiver_id = cr.student_id THEN 1 END) as student_unread_count,
    COUNT(CASE WHEN m.is_read = FALSE AND m.receiver_id = cr.advisor_id THEN 1 END) as advisor_unread_count,
    (SELECT content FROM messages WHERE chat_room_id = cr.id ORDER BY timestamp DESC LIMIT 1) as last_message_content,
    (SELECT timestamp FROM messages WHERE chat_room_id = cr.id ORDER BY timestamp DESC LIMIT 1) as last_message_time
FROM chat_rooms cr
LEFT JOIN messages m ON cr.id = m.chat_room_id
GROUP BY cr.id, cr.student_id, cr.advisor_id, cr.last_activity, cr.is_archived;

-- Stored procedures for common operations

DELIMITER //

-- Procedure to create a new chat room
CREATE PROCEDURE CreateChatRoom(
    IN p_student_id VARCHAR(36),
    IN p_advisor_id VARCHAR(36),
    OUT p_chat_room_id VARCHAR(36)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    SET p_chat_room_id = UUID();
    
    INSERT INTO chat_rooms (id, student_id, advisor_id)
    VALUES (p_chat_room_id, p_student_id, p_advisor_id);
    
    -- Initialize settings for both users
    INSERT INTO chat_room_settings (id, chat_room_id, user_id)
    VALUES 
        (UUID(), p_chat_room_id, p_student_id),
        (UUID(), p_chat_room_id, p_advisor_id);
    
    COMMIT;
END //

-- Procedure to send a message
CREATE PROCEDURE SendMessage(
    IN p_chat_room_id VARCHAR(36),
    IN p_sender_id VARCHAR(36),
    IN p_receiver_id VARCHAR(36),
    IN p_content TEXT,
    IN p_message_type VARCHAR(20),
    IN p_reply_to_message_id VARCHAR(36),
    IN p_metadata JSON,
    OUT p_message_id VARCHAR(36)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    SET p_message_id = UUID();
    
    INSERT INTO messages (
        id, chat_room_id, sender_id, receiver_id, content, 
        message_type, reply_to_message_id, metadata
    )
    VALUES (
        p_message_id, p_chat_room_id, p_sender_id, p_receiver_id, p_content,
        p_message_type, p_reply_to_message_id, p_metadata
    );
    
    -- Update chat room last activity
    UPDATE chat_rooms 
    SET last_activity = CURRENT_TIMESTAMP 
    WHERE id = p_chat_room_id;
    
    COMMIT;
END //

-- Procedure to mark messages as read
CREATE PROCEDURE MarkMessagesAsRead(
    IN p_chat_room_id VARCHAR(36),
    IN p_user_id VARCHAR(36)
)
BEGIN
    UPDATE messages 
    SET is_read = TRUE 
    WHERE chat_room_id = p_chat_room_id 
    AND receiver_id = p_user_id 
    AND is_read = FALSE;
    
    -- Insert read receipts
    INSERT INTO message_read_receipts (id, message_id, user_id)
    SELECT UUID(), id, p_user_id
    FROM messages 
    WHERE chat_room_id = p_chat_room_id 
    AND receiver_id = p_user_id 
    AND id NOT IN (
        SELECT message_id FROM message_read_receipts WHERE user_id = p_user_id
    );
END //

DELIMITER ;

-- Triggers for maintaining data consistency

-- Trigger to update chat room last activity when a message is sent
DELIMITER //
CREATE TRIGGER update_chat_room_activity 
AFTER INSERT ON messages
FOR EACH ROW
BEGIN
    UPDATE chat_rooms 
    SET last_activity = NEW.timestamp 
    WHERE id = NEW.chat_room_id;
END //
DELIMITER ;

-- Trigger to clean up old typing indicators
DELIMITER //
CREATE TRIGGER cleanup_old_typing_indicators
BEFORE INSERT ON typing_indicators
FOR EACH ROW
BEGIN
    DELETE FROM typing_indicators 
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL 5 MINUTE);
END //
DELIMITER ;

-- Sample data for testing (optional)
INSERT INTO users (id, email, password_hash, name, role, email_verified) VALUES
('user1', 'student@example.com', 'hashed_password', 'Nguyễn Văn An', 'student', TRUE),
('user2', 'advisor@example.com', 'hashed_password', 'Dr. Sarah Johnson', 'advisor', TRUE);

-- Create a sample chat room
CALL CreateChatRoom('user1', 'user2', @chat_room_id);

-- Send a sample message
CALL SendMessage(@chat_room_id, 'user1', 'user2', 'Hello, I need help with scholarships!', 'text', NULL, NULL, @message_id);