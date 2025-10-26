-- Disable safe update mode temporarily
SET SQL_SAFE_UPDATES = 0;

-- Delete all existing products
DELETE FROM products;

-- Reset auto-increment counter (optional, depends on your database)
ALTER TABLE products AUTO_INCREMENT = 1;

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

-- Insert products based on actual images in the project
-- Category IDs: 1=Water Closets, 2=Basins, 3=Bathroom Sets, 4=Other Products

-- Water Closets (category_id = 1)
INSERT INTO products (name, description, category_id, price, original_price, discount_percentage, image_url, rating, review_count, stock_quantity) VALUES
('CC Delux Water Closet', 'Premium CC Delux water closet with modern design and soft close seat', 1, 45000.00, 52000.00, 13, '/images/CC Delux Water Closet.png', 4.6, 67, 45),
('SD Delux Water Closet', 'Luxury SD Delux water closet with premium finish and dual flush', 1, 48000.00, 55000.00, 13, '/images/SD Delux Water Closet.png', 4.7, 89, 38),
('BT Delux Water Closet', 'Classic BT Delux water closet with traditional rounded design', 1, 42000.00, 48000.00, 13, '/images/BT Delux Water Closet.png', 4.5, 78, 52),
('Italica Water Closet', 'Premium Italica water closet with elegant European styling', 1, 55000.00, 62000.00, 11, '/images/Italica Water Closet.png', 4.8, 112, 28),
('Euro 1 Delux Water Closet', 'Modern Euro 1 Delux water closet with advanced flushing system', 1, 46000.00, 53000.00, 13, '/images/Euro 1 Delux Water Closet.png', 4.6, 95, 41),
('Dina Water Closet', 'Luxury Dina water closet with minimalist design and premium features', 1, 52000.00, 59000.00, 12, '/images/Dina Water Closet.png', 4.9, 134, 33),
('SQ Delux Water Closet', 'Contemporary SQ Delux water closet with square bowl design', 1, 44000.00, 51000.00, 14, '/images/SQ Delux Water Closet.png', 4.7, 103, 47),

-- Basins (category_id = 2)
('CC Delux Basin', 'Elegant CC Delux basin with modern design and premium ceramic finish', 2, 18750.00, 22000.00, 15, '/images/CC Delux Basin.png', 4.9, 93, 65),
('SD Delux Basin', 'Luxury SD Delux basin with premium finish and elegant curves', 2, 28000.00, 32000.00, 13, '/images/SD Delux Basin.png', 4.8, 112, 48),
('BT Delux Basin', 'Classic BT Delux basin with traditional design and quality build', 2, 16500.00, 19000.00, 13, '/images/BT Delux Basin.png', 4.8, 167, 72),
('SQ Delux Basin', 'Space-efficient SQ Delux basin perfect for compact bathrooms', 2, 14000.00, 16500.00, 15, '/images/SQ Delux Basin.png', 4.5, 92, 58),
('Corner Basin', 'Modern corner basin with sleek contemporary design for space saving', 2, 22000.00, 25000.00, 12, '/images/Corner Basin.png', 4.7, 78, 43),
('Baby Basin', 'Stylish baby basin with counter-top design for modern appeal', 2, 25000.00, 29000.00, 14, '/images/Baby Basin.png', 4.9, 145, 36),
('Riyo Basin', 'Premium Riyo basin with exceptional quality and modern aesthetics', 2, 19500.00, 22500.00, 13, '/images/Riyo Basin.png', 4.6, 89, 54),

-- Bathroom Sets (category_id = 3)
('CC Delux Bathroom Set', 'Complete CC Delux bathroom set with modern fixtures and fittings', 3, 15750.00, 18500.00, 15, '/images/CC Delux Bathroom Set.png', 4.8, 124, 32),
('SD Delux Bathroom Set', 'Luxury SD Delux bathroom set with premium finishes and accessories', 3, 25000.00, 30000.00, 17, '/images/SD Delux Bathroom Set.png', 4.9, 89, 27),
('BT Delux Bathroom Set', 'Smart BT Delux bathroom set with contemporary design elements', 3, 38000.00, 45000.00, 16, '/images/BT Delux Bathroom Set.png', 4.8, 54, 19),
('SQ Delux Bathroom Set', 'Complete SQ Delux bathroom set with modern square design', 3, 75000.00, 89000.00, 16, '/images/SQ Delux Bathroom Set.png', 4.9, 67, 15),
('Italica Bathroom Set', 'Premium Italica bathroom set with elegant European styling', 3, 45000.00, 52000.00, 13, '/images/Italica Bathroom Set.png', 4.7, 98, 23),
('Euro 1 Delux Bathroom Set', 'Advanced Euro 1 Delux bathroom set with premium features', 3, 65000.00, 75000.00, 13, '/images/Euro 1 Delux Bathroom Set.png', 4.8, 45, 18),

-- Other Products (category_id = 4)
('Squat Pan', 'High-quality squat pan with modern design and durable construction', 4, 12000.00, 14000.00, 14, '/images/Squat Pan.png', 4.7, 89, 62);

