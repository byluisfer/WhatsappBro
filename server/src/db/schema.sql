-- Create the DB if not exists
CREATE DATABASE IF NOT EXISTS WhatsappBro;
USE WhatsappBro;

-- Create the user with all privileges
CREATE USER IF NOT EXISTS 'Admin' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON WhatsappBro.* TO 'Admin';
FLUSH PRIVILEGES;

-- Create a user table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    profileImage LONGTEXT DEFAULT NULL,
    is_online BOOLEAN DEFAULT FALSE
);

-- Create a contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    contact_id INT NOT NULL,
    UNIQUE KEY unique_contact (user_id, contact_id), -- Constraint to avoid duplicate contacts
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (contact_id) REFERENCES users(id)
);

-- Create a messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    text TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Insert test users
INSERT INTO users (username, email, password, profileImage) VALUES
('User1', 'user1@gmail.com', '$2b$10$iSqYAimPjyC0aachVPxQQ.S6LO0zNQJ50KcegFrksJSqReSOZi0Le', NULL),
('User2', 'user2@gmail.com', '$2b$10$iSqYAimPjyC0aachVPxQQ.S6LO0zNQJ50KcegFrksJSqReSOZi0Le', NULL),
('User3', 'user3@gmail.com', '$2b$10$iSqYAimPjyC0aachVPxQQ.S6LO0zNQJ50KcegFrksJSqReSOZi0Le', NULL);

-- Confirmation message
SELECT 'DB and Tables right created' AS status;