-- Create the DB is not exists
CREATE DATABASE IF NOT EXISTS WhatsappBro;
USE WhatsappBro;

-- Create the user with all privileges
CREATE USER IF NOT EXISTS 'Admin' IDENTIFIED BY '123';
GRANT ALL PRIVILEGES ON WhatsappBro.* TO 'Admin';
FLUSH PRIVILEGES;

-- Create a user table (test)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Insertar usuarios iniciales si no existen
INSERT INTO users (username, email, password) VALUES
('Ibai', 'noah@gmail.com', '123'),
('Pessi', 'augi@gmail.com', '123');

-- Confirmation message
SELECT '✅ DB and Tables right created' AS status;