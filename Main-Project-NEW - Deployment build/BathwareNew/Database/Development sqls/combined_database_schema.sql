-- =====================================================
-- COMBINED DATABASE SCHEMA FOR BATHWARE SYSTEM
-- =====================================================
-- This file combines all 3 separate SQL files into one unified schema
-- All INT types have been changed to BIGINT to match Java Long types
-- =====================================================

-- Create the main database
CREATE DATABASE IF NOT EXISTS bathware_system;
USE bathware_system;

-- =====================================================
-- USER MANAGEMENT TABLES (from userprof.sql)
-- =====================================================

-- Main user table
CREATE TABLE user (
    userId BIGINT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(100) NOT NULL UNIQUE,
    userPassword VARCHAR(100) NOT NULL,
    telephone VARCHAR(15),
    authority VARCHAR(15) NOT NULL,
    email VARCHAR(255)
);

-- Admin table
CREATE TABLE admin (
    adminId BIGINT AUTO_INCREMENT PRIMARY KEY,
    userId BIGINT NOT NULL,
    adminLevel BIGINT,
    FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
);

-- Customer table
CREATE TABLE customer (
    customerId BIGINT AUTO_INCREMENT PRIMARY KEY,
    userId BIGINT UNIQUE,
    FOREIGN KEY (userId) REFERENCES user(userId) ON DELETE CASCADE
);

-- =====================================================
-- PRODUCT MANAGEMENT TABLES (from Productdb.sql)
-- =====================================================

-- Categories table
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage BIGINT DEFAULT 0,
    image_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count BIGINT DEFAULT 0,
    stock_quantity BIGINT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- =====================================================
-- CART MANAGEMENT TABLES (from Checkoutdb.sql)
-- =====================================================

-- Cart table
CREATE TABLE cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(userId) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- =====================================================
-- ORDER & QUOTATION TABLES (from Checkoutdb.sql)
-- =====================================================

-- Quotation table
CREATE TABLE quotation (
    quotation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    qname VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    qnumber VARCHAR(20) NOT NULL,
    qstatus ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    FOREIGN KEY (customer_id) REFERENCES user(userId) ON DELETE CASCADE
);

-- Quotation items table
CREATE TABLE quotation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (quotation_id) REFERENCES quotation(quotation_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_slip VARCHAR(255) NOT NULL,
    payment_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    deliver_status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'PENDING',
    delivered_date TIMESTAMP DEFAULT NULL,
    FOREIGN KEY (quotation_id) REFERENCES quotation(quotation_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES user(userId) ON DELETE CASCADE
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample users
INSERT INTO user (userName, userPassword, telephone, authority, email) VALUES
('admin', 'adminpass', '1234567890', 'ADMIN', 'admin@example.com'),
('user', 'userpass', '0987654321', 'USER', 'user@example.com'),
('customer1', 'pass123', '0712345678', 'USER', 'customer1@gmail.com'),
('customer2', 'pass234', '0723456789', 'USER', 'customer2@gmail.com');

-- Insert admin and customer records
INSERT INTO admin (userId, adminLevel) VALUES (1, 1);
INSERT INTO customer (userId) VALUES (2), (3), (4);

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Water Closets', 'Toilets, commodes, and WC systems'),
('Basins', 'Wash basins, sinks, and basin accessories'),
('Bathroom Sets', 'Complete bathroom sets and packages'),
('Other Products', 'Bathroom accessories, tiles, and miscellaneous items');

-- Insert sample products
INSERT INTO products (name, description, category_id, price, original_price, discount_percentage, image_url, rating, review_count, stock_quantity) VALUES
-- Water Closets (category_id = 1)
('Smart Toilet Commode', 'Advanced smart toilet with bidet functionality', 1, 45000.00, 52000.00, 13, '/images/smart-toilet.jpg', 4.6, 67, 25),
('Wall Mounted Toilet', 'Space-saving wall mounted toilet system', 1, 35000.00, 40000.00, 13, '/images/wall-toilet.jpg', 4.7, 78, 30),
('Bidet Toilet Seat', 'Advanced bidet toilet seat with multiple features', 1, 22000.00, 26000.00, 15, '/images/bidet-seat.jpg', 4.7, 98, 55),
('Close Coupled Toilet', 'Standard close coupled toilet with soft close seat', 1, 28000.00, 33000.00, 15, '/images/close-toilet.jpg', 4.9, 143, 50),

-- Basins (category_id = 2)
('Ceramic Wash Basin', 'Elegant ceramic wash basin with modern design', 2, 18750.00, 22000.00, 15, '/images/ceramic-basin.jpg', 4.9, 93, 60),
('Granite Counter Basin', 'Luxury granite counter basin with premium finish', 2, 28000.00, 32000.00, 13, '/images/granite-basin.jpg', 4.8, 112, 35),
('Pedestal Wash Basin', 'Classic pedestal wash basin design', 2, 16500.00, 19000.00, 13, '/images/pedestal-basin.jpg', 4.8, 167, 70),
('Corner Wash Basin', 'Space-efficient corner wash basin', 2, 14000.00, 16500.00, 15, '/images/corner-basin.jpg', 4.5, 92, 40),

-- Bathroom Sets (category_id = 3)
('Premium Shower Head Set', 'High-quality shower head with multiple spray patterns', 3, 15750.00, 18500.00, 15, '/images/shower-head.jpg', 4.8, 124, 50),
('Rain Shower System', 'Luxury rain shower system with multiple functions', 3, 25000.00, 30000.00, 17, '/images/rain-shower.jpg', 4.9, 89, 45),
('Digital Shower Panel', 'Smart digital shower panel with temperature control', 3, 38000.00, 45000.00, 16, '/images/digital-shower.jpg', 4.8, 54, 20),

-- Other Products (category_id = 4)
('Modern Basin Mixer Tap', 'Contemporary design mixer tap for wash basins', 4, 8500.00, 9800.00, 13, '/images/mixer-tap.jpg', 4.7, 89, 75),
('Ceramic Wall Tiles - Ocean Blue', 'Beautiful ocean blue ceramic tiles for bathroom walls', 4, 2800.00, 3200.00, 13, '/images/blue-tiles.jpg', 4.9, 201, 200),
('Bathroom Mirror Cabinet', 'Spacious mirror cabinet with LED lighting', 4, 12300.00, 14500.00, 15, '/images/mirror-cabinet.jpg', 4.8, 156, 40),
('Double Handle Basin Tap', 'Classic double handle tap for traditional bathrooms', 4, 6500.00, 7800.00, 17, '/images/double-tap.jpg', 4.5, 145, 80),
('Marble Floor Tiles', 'Premium marble floor tiles for elegant bathrooms', 4, 4200.00, 5000.00, 16, '/images/marble-tiles.jpg', 4.6, 234, 150),
('Kitchen Sink Mixer', 'Professional kitchen sink mixer with pull-out spray', 4, 9800.00, 11500.00, 15, '/images/kitchen-mixer.jpg', 4.6, 125, 65),
('Heated Towel Rack', 'Electric heated towel rack for luxury bathrooms', 4, 15000.00, 18000.00, 17, '/images/towel-rack.jpg', 4.7, 76, 25),
('Mosaic Wall Tiles', 'Decorative mosaic tiles for accent walls', 4, 3500.00, 4200.00, 17, '/images/mosaic-tiles.jpg', 4.8, 189, 120),
('Bathroom Exhaust Fan', 'Quiet and efficient bathroom exhaust fan', 4, 4500.00, 5500.00, 18, '/images/exhaust-fan.jpg', 4.6, 203, 100),
('Sensor Tap Automatic', 'Touchless automatic sensor tap for hygiene', 4, 12000.00, 14000.00, 14, '/images/sensor-tap.jpg', 4.7, 87, 45),
('Luxury Bathtub Faucet', 'Premium bathtub faucet with elegant design', 4, 32000.00, 38000.00, 16, '/images/bathtub-faucet.jpg', 4.9, 45, 15);

-- =====================================================
-- DATABASE USER CREATION
-- =====================================================

-- Create database user for Spring Boot application
DROP USER IF EXISTS 'springuser'@'localhost';
CREATE USER 'springuser'@'localhost' IDENTIFIED BY 'springpass';
GRANT ALL PRIVILEGES ON bathware_system.* TO 'springuser'@'localhost';
FLUSH PRIVILEGES;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Show all tables
SHOW TABLES;

-- Show table structures
DESCRIBE user;
DESCRIBE products;
DESCRIBE cart;
DESCRIBE quotation;
DESCRIBE orders;

-- Sample queries to verify data
SELECT COUNT(*) as total_users FROM user;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_categories FROM categories;