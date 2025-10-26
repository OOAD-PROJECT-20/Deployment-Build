-- =====================================================
-- PostgreSQL Database Schema for Bathware System
-- Deployment Version for Render.com
-- =====================================================
-- NOTE: In Render, the database is already created
-- You only need to run the table creation and data insertion

-- =====================================================
-- PART 1: TABLE CREATION
-- =====================================================

-- Main user table
CREATE TABLE IF NOT EXISTS "user" (
    "userId" BIGSERIAL PRIMARY KEY,
    "userName" VARCHAR(100) NOT NULL UNIQUE,
    "userPassword" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(15),
    "authority" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255)
);

-- Admin table
CREATE TABLE IF NOT EXISTS "admin" (
    "adminId" BIGSERIAL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "adminLevel" BIGINT,
    FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE
);

-- Customer table
CREATE TABLE IF NOT EXISTS "customer" (
    "customerId" BIGSERIAL PRIMARY KEY,
    "userId" BIGINT UNIQUE,
    FOREIGN KEY ("userId") REFERENCES "user"("userId") ON DELETE CASCADE
);

-- Categories table
CREATE TABLE IF NOT EXISTS "categories" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL UNIQUE,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS "products" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category_id" BIGINT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "original_price" DECIMAL(10,2),
    "discount_percentage" BIGINT DEFAULT 0,
    "image_url" VARCHAR(500),
    "rating" DECIMAL(3,2) DEFAULT 0.00,
    "review_count" BIGINT DEFAULT 0,
    "stock_quantity" BIGINT DEFAULT 0,
    "is_active" BOOLEAN DEFAULT TRUE,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE
);

-- Cart table
CREATE TABLE IF NOT EXISTS "cart" (
    "id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity" BIGINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "user"("userId") ON DELETE CASCADE,
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE,
    CONSTRAINT "unique_user_product" UNIQUE ("user_id", "product_id")
);

-- Quotation table
CREATE TABLE IF NOT EXISTS "quotation" (
    "quotation_id" BIGSERIAL PRIMARY KEY,
    "customer_id" BIGINT NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "request_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "qname" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "qnumber" VARCHAR(20) NOT NULL,
    "qstatus" VARCHAR(20) DEFAULT 'PENDING' CHECK ("qstatus" IN ('PENDING', 'APPROVED', 'REJECTED')),
    FOREIGN KEY ("customer_id") REFERENCES "user"("userId") ON DELETE CASCADE
);

-- Quotation items table
CREATE TABLE IF NOT EXISTS "quotation_items" (
    "id" BIGSERIAL PRIMARY KEY,
    "quotation_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    FOREIGN KEY ("quotation_id") REFERENCES "quotation"("quotation_id") ON DELETE CASCADE,
    FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
);

-- Orders table
CREATE TABLE IF NOT EXISTS "orders" (
    "order_id" BIGSERIAL PRIMARY KEY,
    "quotation_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "created_date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "payment_slip" VARCHAR(255) NOT NULL,
    "payment_status" VARCHAR(20) DEFAULT 'PENDING' CHECK ("payment_status" IN ('PENDING', 'APPROVED', 'REJECTED')),
    "deliver_status" VARCHAR(20) DEFAULT 'PENDING' CHECK ("deliver_status" IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED')),
    "delivered_date" TIMESTAMP DEFAULT NULL,
    FOREIGN KEY ("quotation_id") REFERENCES "quotation"("quotation_id") ON DELETE CASCADE,
    FOREIGN KEY ("customer_id") REFERENCES "user"("userId") ON DELETE CASCADE
);

-- Support table
CREATE TABLE IF NOT EXISTS "support" (
    "ticket_id" BIGSERIAL PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "support_type" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "remark" VARCHAR(500),
    "status" VARCHAR(100)
);

-- =====================================================
-- PART 2: CREATE TRIGGER FUNCTIONS FOR AUTO-UPDATE
-- PostgreSQL doesn't have ON UPDATE CURRENT_TIMESTAMP
-- We need to create triggers for this functionality
-- =====================================================

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updated_at
CREATE TRIGGER update_categories_timestamp
    BEFORE UPDATE ON "categories"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp
    BEFORE UPDATE ON "products"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cart_timestamp
    BEFORE UPDATE ON "cart"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- PART 3: SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample users (passwords should be BCrypt encrypted in production)
INSERT INTO "user" ("userName", "userPassword", "telephone", "authority", "email") VALUES
    ('admin2', 'adminpass', '0998766542', 'ADMIN', 'admin2@example.com'),
    ('user', 'userpass', '0987654321', 'USER', 'user@example.com'),
    ('customer1', 'pass123', '0712345678', 'USER', 'customer1@gmail.com'),
    ('customer2', 'pass234', '0723456789', 'USER', 'customer2@gmail.com')
ON CONFLICT DO NOTHING;

-- Insert admin and customer records
INSERT INTO "admin" ("userId", "adminLevel") VALUES (1, 2) ON CONFLICT DO NOTHING;
INSERT INTO "customer" ("userId") VALUES (2), (3), (4) ON CONFLICT DO NOTHING;

-- Insert categories
INSERT INTO "categories" ("name", "description") VALUES
    ('Water Closets', 'Toilets, commodes, and WC systems'),
    ('Basins', 'Wash basins, sinks, and basin accessories'),
    ('Bathroom Sets', 'Complete bathroom sets and packages'),
    ('Other Products', 'Bathroom accessories, tiles, and miscellaneous items')
ON CONFLICT DO NOTHING;

-- Insert sample products - Water Closets (category_id = 1)
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('CC Delux Water Closet', 'Premium CC Delux water closet with modern design and soft close seat', 1, 45000.00, 52000.00, 13, '/images/CC Delux Water Closet.png', 4.6, 67, 45),
    ('SD Delux Water Closet', 'Luxury SD Delux water closet with premium finish and dual flush', 1, 48000.00, 55000.00, 13, '/images/SD Delux Water Closet.png', 4.7, 89, 38),
    ('BT Delux Water Closet', 'Classic BT Delux water closet with traditional rounded design', 1, 42000.00, 48000.00, 13, '/images/BT Delux Water Closet.png', 4.5, 78, 52),
    ('Italica Water Closet', 'Premium Italica water closet with elegant European styling', 1, 55000.00, 62000.00, 11, '/images/Italica Water Closet.png', 4.8, 112, 28),
    ('Euro 1 Delux Water Closet', 'Modern Euro 1 Delux water closet with advanced flushing system', 1, 46000.00, 53000.00, 13, '/images/Euro 1 Delux Water Closet.png', 4.6, 95, 41),
    ('Dina Water Closet', 'Luxury Dina water closet with minimalist design and premium features', 1, 52000.00, 59000.00, 12, '/images/Dina Water Closet.png', 4.9, 134, 33),
    ('SQ Delux Water Closet', 'Contemporary SQ Delux water closet with square bowl design', 1, 44000.00, 51000.00, 14, '/images/SQ Delux Water Closet.png', 4.7, 103, 47),
    ('Smart Toilet Commode', 'Advanced smart toilet with bidet functionality', 1, 45000.00, 52000.00, 13, '/images/smart-toilet.jpg', 4.6, 67, 25),
    ('Wall Mounted Toilet', 'Space-saving wall mounted toilet system', 1, 35000.00, 40000.00, 13, '/images/wall-toilet.jpg', 4.7, 78, 30),
    ('Bidet Toilet Seat', 'Advanced bidet toilet seat with multiple features', 1, 22000.00, 26000.00, 15, '/images/bidet-seat.jpg', 4.7, 98, 55),
    ('Close Coupled Toilet', 'Standard close coupled toilet with soft close seat', 1, 28000.00, 33000.00, 15, '/images/close-toilet.jpg', 4.9, 143, 50)
ON CONFLICT DO NOTHING;

-- Insert Basins (category_id = 2)
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('CC Delux Basin', 'Elegant CC Delux basin with modern design and premium ceramic finish', 2, 18750.00, 22000.00, 15, '/images/CC Delux Basin.png', 4.9, 93, 65),
    ('SD Delux Basin', 'Luxury SD Delux basin with premium finish and elegant curves', 2, 28000.00, 32000.00, 13, '/images/SD Delux Basin.png', 4.8, 112, 48),
    ('BT Delux Basin', 'Classic BT Delux basin with traditional design and quality build', 2, 16500.00, 19000.00, 13, '/images/BT Delux Basin.png', 4.8, 167, 72),
    ('SQ Delux Basin', 'Space-efficient SQ Delux basin perfect for compact bathrooms', 2, 14000.00, 16500.00, 15, '/images/SQ Delux Basin.png', 4.5, 92, 58),
    ('Corner Basin', 'Modern corner basin with sleek contemporary design for space saving', 2, 22000.00, 25000.00, 12, '/images/Corner Basin.png', 4.7, 78, 43),
    ('Baby Basin', 'Stylish baby basin with counter-top design for modern appeal', 2, 25000.00, 29000.00, 14, '/images/Baby Basin.png', 4.9, 145, 36),
    ('Riyo Basin', 'Premium Riyo basin with exceptional quality and modern aesthetics', 2, 19500.00, 22500.00, 13, '/images/Riyo Basin.png', 4.6, 89, 54),
    ('Ceramic Wash Basin', 'Elegant ceramic wash basin with modern design', 2, 18750.00, 22000.00, 15, '/images/ceramic-basin.jpg', 4.9, 93, 60),
    ('Granite Counter Basin', 'Luxury granite counter basin with premium finish', 2, 28000.00, 32000.00, 13, '/images/granite-basin.jpg', 4.8, 112, 35),
    ('Pedestal Wash Basin', 'Classic pedestal wash basin design', 2, 16500.00, 19000.00, 13, '/images/pedestal-basin.jpg', 4.8, 167, 70)
ON CONFLICT DO NOTHING;

-- Insert Bathroom Sets (category_id = 3)
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('CC Delux Bathroom Set', 'Complete CC Delux bathroom set with modern fixtures and fittings', 3, 15750.00, 18500.00, 15, '/images/CC Delux Bathroom Set.png', 4.8, 124, 32),
    ('SD Delux Bathroom Set', 'Luxury SD Delux bathroom set with premium finishes and accessories', 3, 25000.00, 30000.00, 17, '/images/SD Delux Bathroom Set.png', 4.9, 89, 27),
    ('BT Delux Bathroom Set', 'Smart BT Delux bathroom set with contemporary design elements', 3, 38000.00, 45000.00, 16, '/images/BT Delux Bathroom Set.png', 4.8, 54, 19),
    ('SQ Delux Bathroom Set', 'Complete SQ Delux bathroom set with modern square design', 3, 75000.00, 89000.00, 16, '/images/SQ Delux Bathroom Set.png', 4.9, 67, 15),
    ('Italica Bathroom Set', 'Premium Italica bathroom set with elegant European styling', 3, 45000.00, 52000.00, 13, '/images/Italica Bathroom Set.png', 4.7, 98, 23),
    ('Euro 1 Delux Bathroom Set', 'Advanced Euro 1 Delux bathroom set with premium features', 3, 65000.00, 75000.00, 13, '/images/Euro 1 Delux Bathroom Set.png', 4.8, 45, 18),
    ('Premium Shower Head Set', 'High-quality shower head with multiple spray patterns', 3, 15750.00, 18500.00, 15, '/images/shower-head.jpg', 4.8, 124, 50),
    ('Rain Shower System', 'Luxury rain shower system with multiple functions', 3, 25000.00, 30000.00, 17, '/images/rain-shower.jpg', 4.9, 89, 45),
    ('Digital Shower Panel', 'Smart digital shower panel with temperature control', 3, 38000.00, 45000.00, 16, '/images/digital-shower.jpg', 4.8, 54, 20)
ON CONFLICT DO NOTHING;

-- Insert Other Products (category_id = 4)
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('Squat Pan', 'High-quality squat pan with modern design and durable construction', 4, 12000.00, 14000.00, 14, '/images/Squat Pan.png', 4.7, 89, 62),
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
    ('Luxury Bathtub Faucet', 'Premium bathtub faucet with elegant design', 4, 32000.00, 38000.00, 16, '/images/bathtub-faucet.jpg', 4.9, 45, 15)
ON CONFLICT DO NOTHING;

-- Insert sample cart items
INSERT INTO "cart" ("user_id", "product_id", "quantity") VALUES
    (2, 1, 1),
    (2, 12, 2),
    (3, 3, 1),
    (3, 15, 1),
    (4, 22, 3)
ON CONFLICT DO NOTHING;

-- Insert sample quotations
INSERT INTO "quotation" ("customer_id", "total_price", "qname", "address", "qnumber", "qstatus") VALUES
    (2, 72000.00, 'Bathroom Upgrade', '123 Main Street, Colombo', 'Q-1001', 'APPROVED'),
    (3, 45000.00, 'Full Renovation', '45 Beach Road, Negombo', 'Q-1002', 'PENDING'),
    (4, 28000.00, 'New Apartment Install', '12 Lake View Ave, Kandy', 'Q-1003', 'REJECTED')
ON CONFLICT DO NOTHING;

-- Insert quotation items
INSERT INTO "quotation_items" ("quotation_id", "product_id", "quantity", "price") VALUES
    (1, 1, 1, 45000.00),
    (1, 12, 2, 18750.00),
    (2, 22, 1, 25000.00),
    (2, 4, 1, 28000.00),
    (3, 13, 1, 28000.00)
ON CONFLICT DO NOTHING;

-- Insert sample orders
INSERT INTO "orders" ("quotation_id", "customer_id", "total_amount", "payment_slip", "payment_status", "deliver_status") VALUES
    (1, 2, 72000.00, '/uploads/slips/slip_1001.jpg', 'APPROVED', 'DELIVERED'),
    (2, 3, 53000.00, '/uploads/slips/slip_1002.jpg', 'PENDING', 'PROCESSING'),
    (3, 4, 28000.00, '/uploads/slips/slip_1003.jpg', 'REJECTED', 'CANCELLED')
ON CONFLICT DO NOTHING;

-- Insert support tickets
INSERT INTO "support" ("user_id", "support_type", "description", "remark", "status") VALUES
    (2, 'Warranty', 'Leaking faucet in bathroom', 'Customer contacted, awaiting parts', 'Pending'),
    (3, 'Product Inquiry', 'Question about installation of basin', '', 'Pending'),
    (4, 'Complaint', 'Missing parts in order #1023', 'Investigating with warehouse', 'Pending'),
    (2, 'Warranty', 'Broken flush handle on water closet', '', 'Pending'),
    (2, 'General', 'Request for product catalog', 'Sent catalog via email', 'Solved'),
    (3, 'Warranty', 'Cracked ceramic on bathroom set', '', 'Pending')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 4: VERIFICATION QUERIES
-- =====================================================
-- You can run these to verify the data was inserted correctly

-- Show all tables
-- \dt

-- Show table structures
-- \d "user"
-- \d "products"
-- \d "cart"
-- \d "quotation"

-- View data
-- SELECT * FROM "user";
-- SELECT * FROM "categories";
-- SELECT * FROM "products" LIMIT 10;
-- SELECT * FROM "cart";
-- SELECT * FROM "quotation";
-- SELECT * FROM "support";

-- =====================================================
-- DEPLOYMENT COMPLETE!
-- =====================================================
-- Your Bathware System database is now ready for production use.
-- 
-- IMPORTANT NOTES:
-- 1. Passwords in this file are plain text for testing
--    In production, Spring Security will encrypt them with BCrypt
-- 2. Make sure your Spring Boot application is configured to use PostgreSQL
-- 3. Set spring.jpa.hibernate.ddl-auto=update in production
--    This will auto-create missing tables if needed
-- 4. Keep your database credentials secure!
-- =====================================================

