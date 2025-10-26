-- Create database
CREATE DATABASE IF NOT EXISTS kodikara_enterprises;
USE kodikara_enterprises;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

-- Create cart_customer table
CREATE TABLE IF NOT EXISTS cart_customer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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

-- Create cart_product table
CREATE TABLE IF NOT EXISTS cart_product (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cart_customer(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Water Closets', 'Toilets, commodes, and WC systems'),
('Basins', 'Wash basins, sinks, and basin accessories'),
('Bathroom Sets', 'Complete bathroom sets and packages'),
('Other Products', 'Bathroom accessories, tiles, and miscellaneous items');

-- Insert sample products
INSERT INTO products (name, description, category_id, price, original_price, discount_percentage, image_url, rating, review_count, stock_quantity) VALUES
-- Water Closets (category_id = 1)
('Smart Toilet Commode', 'Advanced smart toilet with bidet functionality', 1, 45000.00, 52000.00, 13, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 4.6, 67, 25),
('Wall Mounted Toilet', 'Space-saving wall mounted toilet system', 1, 35000.00, 40000.00, 13, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 4.7, 78, 30),
('Bidet Toilet Seat', 'Advanced bidet toilet seat with multiple features', 1, 22000.00, 26000.00, 15, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 4.7, 98, 55),
('Close Coupled Toilet', 'Standard close coupled toilet with soft close seat', 1, 28000.00, 33000.00, 15, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 4.9, 143, 50),

-- Basins (category_id = 2)
('Ceramic Wash Basin', 'Elegant ceramic wash basin with modern design', 2, 18750.00, 22000.00, 15, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.9, 93, 60),
('Granite Counter Basin', 'Luxury granite counter basin with premium finish', 2, 28000.00, 32000.00, 13, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.8, 112, 35),
('Pedestal Wash Basin', 'Classic pedestal wash basin design', 2, 16500.00, 19000.00, 13, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.8, 167, 70),
('Corner Wash Basin', 'Space-efficient corner wash basin', 2, 14000.00, 16500.00, 15, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.5, 92, 40),

-- Bathroom Sets (category_id = 3)
('Premium Shower Head Set', 'High-quality shower head with multiple spray patterns', 3, 15750.00, 18500.00, 15, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=300&fit=crop', 4.8, 124, 50),
('Rain Shower System', 'Luxury rain shower system with multiple functions', 3, 25000.00, 30000.00, 17, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=300&fit=crop', 4.9, 89, 45),
('Digital Shower Panel', 'Smart digital shower panel with temperature control', 3, 38000.00, 45000.00, 16, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=300&fit=crop', 4.8, 54, 20),

-- Other Products (category_id = 4)
('Modern Basin Mixer Tap', 'Contemporary design mixer tap for wash basins', 4, 8500.00, 9800.00, 13, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.7, 89, 75),
('Ceramic Wall Tiles - Ocean Blue', 'Beautiful ocean blue ceramic tiles for bathroom walls', 4, 2800.00, 3200.00, 13, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop', 4.9, 201, 200),
('Bathroom Mirror Cabinet', 'Spacious mirror cabinet with LED lighting', 4, 12300.00, 14500.00, 15, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 4.8, 156, 40),
('Double Handle Basin Tap', 'Classic double handle tap for traditional bathrooms', 4, 6500.00, 7800.00, 17, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.5, 145, 80),
('Marble Floor Tiles', 'Premium marble floor tiles for elegant bathrooms', 4, 4200.00, 5000.00, 16, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop', 4.6, 234, 150),
('Kitchen Sink Mixer', 'Professional kitchen sink mixer with pull-out spray', 4, 9800.00, 11500.00, 15, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.6, 125, 65),
('Heated Towel Rack', 'Electric heated towel rack for luxury bathrooms', 4, 15000.00, 18000.00, 17, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 4.7, 76, 25),
('Mosaic Wall Tiles', 'Decorative mosaic tiles for accent walls', 4, 3500.00, 4200.00, 17, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop', 4.8, 189, 120),
('Bathroom Exhaust Fan', 'Quiet and efficient bathroom exhaust fan', 4, 4500.00, 5500.00, 18, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop', 4.6, 203, 100),
('Sensor Tap Automatic', 'Touchless automatic sensor tap for hygiene', 4, 12000.00, 14000.00, 14, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.7, 87, 45),
('Luxury Bathtub Faucet', 'Premium bathtub faucet with elegant design', 4, 32000.00, 38000.00, 16, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop', 4.9, 45, 15);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_product_user ON cart_product(user_id);
