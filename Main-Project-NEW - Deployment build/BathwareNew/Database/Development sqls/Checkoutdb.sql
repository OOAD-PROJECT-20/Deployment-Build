CREATE DATABASE bathwaredb;
USE bathwaredb;
DROP DATABASE bathwaredb;

SHOW DATABASES;
SHOW TABLES;

DROP TABLE users;
DROP TABLE product;
DROP TABLE cart;
DROP TABLE quotation;
DROP TABLE quotation_items;

-- Users table
CREATE TABLE users (
    user_id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

-- Products table
CREATE TABLE product (
    product_id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (product_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage INT DEFAULT 0,
    image_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    stock_quantity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
-- Cart table
CREATE TABLE cart (
    cart_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (cart_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);
-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cart_customer(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

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
    FOREIGN KEY (customer_id) REFERENCES users(user_id)
);

CREATE TABLE quotation_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (quotation_id) REFERENCES quotation(quotation_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quotation_id BIGINT NOT NULL,                 -- matches quotation.quotation_id
    customer_id BIGINT NOT NULL,                  -- matches users/user_id or customer_id
    total_amount DECIMAL(10,2) NOT NULL,         -- matches quotation.total_price
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_slip VARCHAR(255) NOT NULL,          -- URL to payment slip
    payment_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    deliver_status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'PENDING',
    delivered_date TIMESTAMP DEFAULT NULL,
    CONSTRAINT order_fk_quotation FOREIGN KEY (quotation_id) REFERENCES quotation(quotation_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT order_fk_customer FOREIGN KEY (customer_id) REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);




INSERT INTO users (username, email, password) VALUES 
('Anuda', 'bimsaraanuda@gmail.com', '234244'),
('Bhanu', 'Bhnau@example.com', '123'),
('Randula', 'Ransdula@example.com', '12345'),
('Sithira', 'Sithira@example.com', '3244');


INSERT INTO product (name, description, price, stock_quantity) VALUES
('Shower Head', 'High-pressure stainless steel shower head', 45.00, 25),
('Bath Towel', 'Soft cotton bath towel, 70x140 cm', 20.00, 50),
('Soap Dispenser', 'Wall-mounted liquid soap dispenser', 15.00, 40),
('Bath Mat', 'Non-slip bath mat, 60x40 cm', 18.00, 30),
('Toothbrush Holder', 'Ceramic toothbrush holder with 4 slots', 12.00, 35);


INSERT INTO cart (user_id, product_id, quantity) VALUES
(1, 4, 5),  -- 2 Shower Heads
(1, 3, 7),  -- 1 Soap Dispenser
(1, 5, 3);  -- 3 Bath Mats



-- Insert Cart Items (for jane_smith -> user_id = 2)
INSERT INTO cart (user_id, product_id, quantity) VALUES
(2, 2, 10),  -- 10 Bath Towels
(2, 5, 5);   -- 5 Toothbrush Holders


-- Insert Cart Items (for Anuda_r -> user_id = 3)
INSERT INTO cart (user_id, product_id, quantity) VALUES
(3, 1, 1),  -- 1 Shower Head
(3, 2, 2);  -- 2 Bath Mats



select * from cart;
SELECT * FROM users;
SELECT * FROM quotation;
SELECT * FROM quotation_items;

ALTER TABLE quotation DROP COLUMN cart_id;
SELECT * FROM orders;