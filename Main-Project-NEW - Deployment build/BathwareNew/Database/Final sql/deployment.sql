-- =====================================================
-- PostgreSQL Database Schema for Bathware System
-- Deployment Version for Render.com
-- =====================================================
-- NOTE: In Render, the database is already created
-- You only need to run the table creation and data insertion
-- 
-- IMPORTANT: This file uses "USER" (uppercase) to match
-- Spring Boot's globally_quoted_identifiers=true setting
-- =====================================================

-- =====================================================
-- PART 0: CLEAN UP EXISTING TABLES (Optional - Fresh Start)
-- =====================================================
-- CAUTION: This will DELETE ALL DATA in existing tables!
-- Uncomment the lines below only if you want a complete fresh start

-- Drop all tables in correct order (respecting foreign keys)
-- DROP TABLE IF EXISTS "support" CASCADE;
-- DROP TABLE IF EXISTS "orders" CASCADE;
-- DROP TABLE IF EXISTS "quotation_items" CASCADE;
-- DROP TABLE IF EXISTS "quotation" CASCADE;
-- DROP TABLE IF EXISTS "cart" CASCADE;
-- DROP TABLE IF EXISTS "products" CASCADE;
-- DROP TABLE IF EXISTS "categories" CASCADE;
-- DROP TABLE IF EXISTS "customer" CASCADE;
-- DROP TABLE IF EXISTS "admin" CASCADE;
-- DROP TABLE IF EXISTS "USER" CASCADE;
-- DROP TABLE IF EXISTS "user" CASCADE;  -- Drop old lowercase table if exists

-- Drop old sequences if they exist
-- DROP SEQUENCE IF EXISTS "USER_userId_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "user_userId_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "admin_adminId_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "customer_customerId_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "categories_id_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "products_id_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "cart_id_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "quotation_quotation_id_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "quotation_items_id_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "orders_order_id_seq" CASCADE;
-- DROP SEQUENCE IF EXISTS "support_ticket_id_seq" CASCADE;

-- =====================================================
-- PART 1: TABLE CREATION
-- =====================================================

-- Main user table (UPPERCASE to match Hibernate with globally_quoted_identifiers)
CREATE TABLE IF NOT EXISTS "USER" (
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
    FOREIGN KEY ("userId") REFERENCES "USER"("userId") ON DELETE CASCADE
);

-- Customer table
CREATE TABLE IF NOT EXISTS "customer" (
    "customerId" BIGSERIAL PRIMARY KEY,
    "userId" BIGINT UNIQUE,
    FOREIGN KEY ("userId") REFERENCES "USER"("userId") ON DELETE CASCADE
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
    FOREIGN KEY ("user_id") REFERENCES "USER"("userId") ON DELETE CASCADE,
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
    FOREIGN KEY ("customer_id") REFERENCES "USER"("userId") ON DELETE CASCADE
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
    FOREIGN KEY ("customer_id") REFERENCES "USER"("userId") ON DELETE CASCADE
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

-- Drop existing triggers if they exist before creating new ones
DROP TRIGGER IF EXISTS update_categories_timestamp ON "categories";
DROP TRIGGER IF EXISTS update_products_timestamp ON "products";
DROP TRIGGER IF EXISTS update_cart_timestamp ON "cart";

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
-- Note: Using uppercase "USER" table to match Hibernate's globally_quoted_identifiers
INSERT INTO "USER" ("userName", "userPassword", "telephone", "authority", "email") VALUES
    ('admin', 'adminpass', '1234567890', 'ADMIN', 'admin@example.com'),
    ('admin2', 'adminpass', '0998766542', 'ADMIN', 'admin2@example.com'),
    ('customer', 'custpass', '0776543423', 'USER', 'bmaga@example.com'),
    ('customer2', 'custpass', '0114563456', 'USER', 'customer2@gmail.com'),
    ('customer3', 'custpass', '0763453245', 'USER', 'customer3@gmail.com'),
    ('customer4', 'custpass', '0987654123', 'USER', 'customer4@gmail.com'),
    ('customer5', 'custpasss', '0987654532', 'USER', 'customer5@gmail.com'),
    ('customer6', 'test', '0111111111', 'USER', 'customer6@gmail.com'),
    ('customer8', 'custpass', '0111111113', 'USER', 'customer8@gmail.com')
ON CONFLICT DO NOTHING;

-- Insert admin and customer records
-- userId 1 and 2 are admins
INSERT INTO "admin" ("userId", "adminLevel") VALUES (1, 2), (2, 2) ON CONFLICT DO NOTHING;
-- userId 3-9 are customers
INSERT INTO "customer" ("userId") VALUES (3), (4), (5), (6), (7), (8), (9) ON CONFLICT DO NOTHING;

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
    (3, 1, 1),
    (3, 12, 2),
    (4, 3, 1),
    (5, 15, 1),
    (6, 22, 3)
ON CONFLICT DO NOTHING;

-- Insert sample quotations
INSERT INTO "quotation" ("customer_id", "total_price", "qname", "address", "qnumber", "qstatus") VALUES
    (3, 72000.00, 'Bathroom Upgrade', '123 Main Street, Colombo', 'Q-1001', 'APPROVED'),
    (4, 45000.00, 'Full Renovation', '45 Beach Road, Negombo', 'Q-1002', 'PENDING'),
    (5, 28000.00, 'New Apartment Install', '12 Lake View Ave, Kandy', 'Q-1003', 'REJECTED')
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
    (1, 3, 72000.00, '/uploads/slips/slip_1001.jpg', 'APPROVED', 'DELIVERED'),
    (2, 4, 53000.00, '/uploads/slips/slip_1002.jpg', 'PENDING', 'PROCESSING'),
    (3, 5, 28000.00, '/uploads/slips/slip_1003.jpg', 'REJECTED', 'CANCELLED')
ON CONFLICT DO NOTHING;

-- Insert support tickets
INSERT INTO "support" ("user_id", "support_type", "description", "remark", "status") VALUES
    (3, 'Warranty', 'Leaking faucet in bathroom', 'Customer contacted, awaiting parts', 'Pending'),
    (4, 'Product Inquiry', 'Question about installation of basin', '', 'Pending'),
    (5, 'Complaint', 'Missing parts in order #1023', 'Investigating with warehouse', 'Pending'),
    (3, 'Warranty', 'Broken flush handle on water closet', '', 'Pending'),
    (3, 'General', 'Request for product catalog', 'Sent catalog via email', 'Solved'),
    (4, 'Warranty', 'Cracked ceramic on bathroom set', '', 'Pending')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PART 4: VERIFICATION QUERIES
-- =====================================================
-- You can run these to verify the data was inserted correctly

-- Show all tables
-- \dt

-- Show table structures
-- \d "USER"
-- \d "products"
-- \d "cart"
-- \d "quotation"

-- View data
-- SELECT * FROM "USER";
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
-- 4. Set spring.jpa.properties.hibernate.globally_quoted_identifiers=true
--    This ensures all table names are quoted (USER becomes "USER")
-- 5. Keep your database credentials secure!
-- =====================================================
