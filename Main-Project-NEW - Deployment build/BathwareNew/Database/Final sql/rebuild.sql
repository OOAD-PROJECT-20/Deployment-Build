-- =====================================================
-- COMPLETE DATABASE REBUILD - CLEAN DATA ONLY
-- Keep only products 1-23 + Squat Pan (24)
-- Remove all junk data and invalid references
-- =====================================================

-- =====================================================
-- STEP 1: Clear ALL data (in correct order for foreign keys)
-- =====================================================
DELETE FROM "orders";
DELETE FROM "quotation_items";
DELETE FROM "quotation";
DELETE FROM "support";
DELETE FROM "cart";
DELETE FROM "products";
DELETE FROM "categories";
DELETE FROM "customer";
DELETE FROM "admin";
DELETE FROM "USER";

-- =====================================================
-- STEP 2: Reset all sequences to start from 1
-- =====================================================
ALTER SEQUENCE "USER_userId_seq" RESTART WITH 1;
ALTER SEQUENCE "admin_adminId_seq" RESTART WITH 1;
ALTER SEQUENCE "customer_customerId_seq" RESTART WITH 1;
ALTER SEQUENCE "categories_id_seq" RESTART WITH 1;
ALTER SEQUENCE "products_id_seq" RESTART WITH 1;
ALTER SEQUENCE "cart_id_seq" RESTART WITH 1;
ALTER SEQUENCE "quotation_quotation_id_seq" RESTART WITH 1;
ALTER SEQUENCE "quotation_items_id_seq" RESTART WITH 1;
ALTER SEQUENCE "orders_order_id_seq" RESTART WITH 1;
ALTER SEQUENCE "support_ticket_id_seq" RESTART WITH 1;

-- =====================================================
-- STEP 3: INSERT USERS (9 users - 2 admins, 7 customers)
-- =====================================================
INSERT INTO "USER" ("userName", "userPassword", "telephone", "authority", "email") VALUES
    ('admin', 'adminpass', '1234567890', 'ADMIN', 'admin@example.com'),
    ('admin2', 'adminpass', '0998766542', 'ADMIN', 'admin2@example.com'),
    ('customer', 'custpass', '0776543423', 'USER', 'bmaga@example.com'),
    ('customer2', 'custpass', '0114563456', 'USER', 'customer2@gmail.com'),
    ('customer3', 'custpass', '0763453245', 'USER', 'customer3@gmail.com'),
    ('customer4', 'custpass', '0987654123', 'USER', 'customer4@gmail.com'),
    ('customer5', 'custpasss', '0987654532', 'USER', 'customer5@gmail.com'),
    ('customer6', 'test', '0111111111', 'USER', 'customer6@gmail.com'),
    ('customer8', 'custpass', '0111111113', 'USER', 'customer8@gmail.com');

-- Insert admins (userId 1, 2)
INSERT INTO "admin" ("userId", "adminLevel") VALUES (1, 2), (2, 2);

-- Insert customers (userId 3-9)
INSERT INTO "customer" ("userId") VALUES (3), (4), (5), (6), (7), (8), (9);

-- =====================================================
-- STEP 4: INSERT CATEGORIES (4 categories)
-- =====================================================
INSERT INTO "categories" ("name", "description") VALUES
    ('Water Closets', 'Toilets, commodes, and WC systems'),
    ('Basins', 'Wash basins, sinks, and basin accessories'),
    ('Bathroom Sets', 'Complete bathroom sets and packages'),
    ('Other Products', 'Bathroom accessories, tiles, and miscellaneous items');

-- =====================================================
-- STEP 5: INSERT ONLY 24 CLEAN PRODUCTS (IDs 1-24)
-- =====================================================

-- Water Closets (category_id = 1) - Products 1-7
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('CC Delux Water Closet', 'Premium CC Delux water closet with modern design and soft close seat', 1, 45000.00, 52000.00, 13, '/images/CC Delux Water Closet.png', 4.6, 67, 53),
    ('SD Delux Water Closet', 'Luxury SD Delux water closet with premium finish and dual flush', 1, 48000.00, 55000.00, 13, '/images/SD Delux Water Closet.png', 4.7, 89, 32),
    ('BT Delux Water Closet', 'Classic BT Delux water closet with traditional rounded design', 1, 42000.00, 48000.00, 13, '/images/BT Delux Water Closet.png', 4.5, 78, 39),
    ('Italica Water Closet', 'Premium Italica water closet with elegant European styling', 1, 55000.00, 62000.00, 11, '/images/Italica Water Closet.png', 4.8, 112, 28),
    ('Euro 1 Delux Water Closet', 'Modern Euro 1 Delux water closet with advanced flushing system', 1, 46000.00, 53000.00, 13, '/images/Euro 1 Delux Water Closet.png', 4.6, 95, 41),
    ('Dina Water Closet', 'Luxury Dina water closet with minimalist design and premium features', 1, 52000.00, 59000.00, 12, '/images/Dina Water Closet.png', 4.9, 134, 27),
    ('SQ Delux Water Closet', 'Contemporary SQ Delux water closet with square bowl design', 1, 44000.00, 51000.00, 14, '/images/SQ Delux Water Closet.png', 4.7, 103, 45);

-- Basins (category_id = 2) - Products 8-14
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('CC Delux Basin', 'Elegant CC Delux basin with modern design and premium ceramic finish', 2, 18750.00, 22000.00, 15, '/images/CC Delux Basin.png', 4.9, 93, 52),
    ('SD Delux Basin', 'Luxury SD Delux basin with premium finish and elegant curves', 2, 28000.00, 32000.00, 13, '/images/SD Delux Basin.png', 4.8, 112, 48),
    ('BT Delux Basin', 'Classic BT Delux basin with traditional design and quality build', 2, 16500.00, 19000.00, 13, '/images/BT Delux Basin.png', 4.8, 167, 62),
    ('SQ Delux Basin', 'Space-efficient SQ Delux basin perfect for compact bathrooms', 2, 14000.00, 16500.00, 15, '/images/SQ Delux Basin.png', 4.5, 92, 51),
    ('Corner Basin', 'Modern corner basin with sleek contemporary design for space saving', 2, 22000.00, 25000.00, 12, '/images/Corner Basin.png', 4.7, 78, 43),
    ('Baby Basin', 'Stylish baby basin with counter-top design for modern appeal', 2, 25000.00, 29000.00, 14, '/images/Baby Basin.png', 4.9, 145, 36),
    ('Riyo Basin', 'Premium Riyo basin with exceptional quality and modern aesthetics', 2, 19500.00, 22500.00, 13, '/images/Riyo Basin.png', 4.6, 89, 54);

-- Bathroom Sets (category_id = 3) - Products 15-20
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('CC Delux Bathroom Set', 'Complete CC Delux bathroom set with modern fixtures and fittings', 3, 15750.00, 18500.00, 15, '/images/CC Delux Bathroom Set.png', 4.8, 124, 18),
    ('SD Delux Bathroom Set', 'Luxury SD Delux bathroom set with premium finishes and accessories', 3, 25000.00, 30000.00, 17, '/images/SD Delux Bathroom Set.png', 4.9, 89, 20),
    ('BT Delux Bathroom Set', 'Smart BT Delux bathroom set with contemporary design elements', 3, 38000.00, 45000.00, 16, '/images/BT Delux Bathroom Set.png', 4.8, 54, 18),
    ('SQ Delux Bathroom Set', 'Complete SQ Delux bathroom set with modern square design', 3, 75000.00, 89000.00, 16, '/images/SQ Delux Bathroom Set.png', 4.9, 67, 12),
    ('Italica Bathroom Set', 'Premium Italica bathroom set with elegant European styling', 3, 45000.00, 52000.00, 13, '/images/Italica Bathroom Set.png', 4.7, 98, 23),
    ('Euro 1 Delux Bathroom Set', 'Advanced Euro 1 Delux bathroom set with premium features', 3, 65000.00, 75000.00, 13, '/images/Euro 1 Delux Bathroom Set.png', 4.8, 45, 18);

-- Other Products (category_id = 4) - Products 21-23 + Squat Pan (24)
INSERT INTO "products" ("name", "description", "category_id", "price", "original_price", "discount_percentage", "image_url", "rating", "review_count", "stock_quantity") VALUES
    ('Modern Basin Mixer Tap', 'Contemporary design mixer tap for wash basins', 4, 8500.00, 9800.00, 13, '/images/mixer-tap.jpg', 4.7, 89, 75),
    ('Bathroom Mirror Cabinet', 'Spacious mirror cabinet with LED lighting', 4, 12300.00, 14500.00, 15, '/images/mirror-cabinet.jpg', 4.8, 156, 40),
    ('Double Handle Basin Tap', 'Classic double handle tap for traditional bathrooms', 4, 6500.00, 7800.00, 17, '/images/double-tap.jpg', 4.5, 145, 80),
    ('Squat Pan', 'High-quality squat pan with modern design and durable construction', 4, 12000.00, 14000.00, 14, '/images/Squat Pan.png', 4.7, 89, 62);

-- =====================================================
-- STEP 6: INSERT SUPPORT TICKETS (9 tickets - all valid)
-- =====================================================
INSERT INTO "support" ("user_id", "support_type", "description", "remark", "status") VALUES
    (3, 'Warranty', 'Need to check warranty on deluxe closet', 'Okay we will check and get back to you', 'In Progress'),
    (3, 'Product Inquiry', 'Are the water closets compatible with bipin...', 'Yes', 'Solved'),
    (3, 'Technical Support', 'How to open the faucet lid', 'Check the handbook', 'Solved'),
    (4, 'Other', 'How to return', 'We will call you', 'Solved'),
    (4, 'Warranty', 'Need to check warranty for deluxe basin', 'We will get back to you', 'In Progress'),
    (5, 'Product Inquiry', 'Need help with product', 'Okay', 'In Progress'),
    (6, 'Technical Support', 'Need help with product', 'Okay checking', 'Solved'),
    (8, 'Technical Support', 'Need help with a specific product', 'I will see', 'Solved'),
    (9, 'Product Inquiry', 'Need to know something about a product', 'What do you want to know ? please specify', 'Solved');

-- =====================================================
-- STEP 7: INSERT QUOTATIONS (12 quotations - all valid)
-- =====================================================
INSERT INTO "quotation" ("customer_id", "total_price", "qname", "address", "qnumber", "qstatus") VALUES
    (3, 238000.00, 'Nimal Perera', 'No 62 bauddhaloka mawatha', '0986754321', 'APPROVED'),
    (3, 210250.00, 'Nimal Perera', 'No 62 bauddhaloka mawatha', '0986754321', 'APPROVED'),
    (3, 128500.00, 'Nimal Perera', 'No 62 bauddhaloka mawatha', '0986754321', 'APPROVED'),
    (3, 164000.00, 'Nimal Perera', 'No 62 bauddhaloka mawatha', '0986754321', 'APPROVED'),
    (4, 242000.00, 'Priyantha wijesinghe', 'No 7 kurunegala road', '0976542345', 'APPROVED'),
    (4, 120000.00, 'Priyantha wijesinghe', 'No 7 kurunegala road', '0976542345', 'APPROVED'),
    (5, 464500.00, 'Bimal', 'No 22 Main road', '0976544212', 'APPROVED'),
    (6, 530000.00, 'Bimal', 'No 22 Main road', '0976544212', 'APPROVED'),
    (7, 600000.00, 'Namal', 'No 62 bauddhaloka mawatha', '0998765452', 'APPROVED'),
    (8, 517250.00, 'Namal 2', 'No 62 bauddhaloka mawatha', '0987654321', 'APPROVED'),
    (9, 369250.00, 'Nimal Perera', 'No 62 bauddhaloka mawatha', '0976542345', 'APPROVED'),
    (9, 49500.00, 'Nimal Perera', 'No 7 kurunegala road', '0986754321', 'APPROVED');

-- =====================================================
-- STEP 8: INSERT QUOTATION ITEMS (only valid product IDs 1-24)
-- =====================================================
INSERT INTO "quotation_items" ("quotation_id", "product_id", "quantity", "price") VALUES
    -- Quotation 7: products 9, 17, 18, 21 (all valid)
    (7, 9, 5, 28000.00),
    (7, 17, 1, 38000.00),
    (7, 18, 3, 75000.00),
    (7, 21, 2, 12000.00),
    -- Quotation 8: products 1, 2, 4, 9, 11, 16, 21 (all valid)
    (8, 1, 4, 45000.00),
    (8, 2, 1, 48000.00),
    (8, 4, 1, 55000.00),
    (8, 9, 2, 28000.00),
    (8, 11, 3, 14000.00),
    (8, 16, 5, 25000.00),
    (8, 21, 2, 12000.00),
    -- Quotation 9: products 1, 2, 4, 6, 8, 9 (all valid)
    (9, 1, 4, 45000.00),
    (9, 2, 1, 48000.00),
    (9, 4, 2, 55000.00),
    (9, 6, 2, 52000.00),
    (9, 8, 3, 28000.00),
    (9, 9, 2, 28000.00),
    -- Quotation 10: products 3, 4, 6, 8, 9 (all valid)
    (10, 3, 5, 42000.00),
    (10, 4, 1, 55000.00),
    (10, 6, 2, 52000.00),
    (10, 8, 3, 18750.00),
    (10, 9, 2, 28000.00),
    -- Quotation 11: products 8, 9, 10, 11, 15, 16, 21 (all valid)
    (11, 8, 4, 18750.00),
    (11, 9, 2, 28000.00),
    (11, 10, 4, 16500.00),
    (11, 11, 1, 14000.00),
    (11, 15, 4, 15750.00),
    (11, 16, 7, 25000.00),
    (11, 21, 2, 12000.00),
    -- Quotation 12: product 10 (valid)
    (12, 10, 3, 16500.00);

-- =====================================================
-- STEP 9: INSERT ORDERS (12 orders - all valid)
-- =====================================================
INSERT INTO "orders" ("quotation_id", "customer_id", "total_amount", "payment_slip", "payment_status", "deliver_status", "delivered_date") VALUES
    (1, 3, 238000.00, 'uploads/1761523260035_bill2.png', 'APPROVED', 'PROCESSING', NULL),
    (2, 3, 210250.00, 'uploads/1761523282007_bill4.png', 'APPROVED', 'SHIPPED', NULL),
    (3, 3, 128500.00, 'uploads/1761523299536_bill5.png', 'APPROVED', 'DELIVERED', '2025-10-26 07:51:03'),
    (4, 3, 164000.00, 'uploads/1761523447663_bill6.png', 'APPROVED', 'CANCELLED', NULL),
    (5, 4, 242000.00, 'uploads/1761525656294_bill3.png', 'APPROVED', 'RETURNED', NULL),
    (6, 4, 120000.00, 'uploads/1761525677413_bill4.png', 'APPROVED', 'PENDING', NULL),
    (7, 5, 464500.00, 'uploads/1761526752008_bill7.png', 'APPROVED', 'DELIVERED', '2025-10-26 08:26:31'),
    (8, 6, 530000.00, 'uploads/1761527991196_bill1.png', 'APPROVED', 'DELIVERED', '2025-10-26 08:33:57'),
    (9, 7, 600000.00, 'uploads/1761528220074_bill8.png', 'APPROVED', 'DELIVERED', '2025-10-26 08:37:41'),
    (10, 8, 517250.00, 'uploads/1761530477236_bill5.png', 'APPROVED', 'DELIVERED', '2025-10-26 08:42:12'),
    (11, 9, 369250.00, 'uploads/1761533321869_bill7.png', 'APPROVED', 'DELIVERED', '2025-10-26 08:48:54'),
    (12, 9, 49500.00, 'uploads/1761534844059_bill2.png', 'APPROVED', 'RETURNED', NULL);

-- =====================================================
-- STEP 10: CART - Empty (ready for new data)
-- =====================================================
-- Cart is empty and ready to use with auto-increment starting at 1

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
SELECT 'Database Rebuild Summary:' as info;

SELECT 
    'Categories' as table_name, COUNT(*) as count FROM "categories"
UNION ALL
SELECT 'Products', COUNT(*) FROM "products"
UNION ALL
SELECT 'Users', COUNT(*) FROM "USER"
UNION ALL
SELECT 'Admins', COUNT(*) FROM "admin"
UNION ALL
SELECT 'Customers', COUNT(*) FROM "customer"
UNION ALL
SELECT 'Support Tickets', COUNT(*) FROM "support"
UNION ALL
SELECT 'Quotations', COUNT(*) FROM "quotation"
UNION ALL
SELECT 'Quotation Items', COUNT(*) FROM "quotation_items"
UNION ALL
SELECT 'Orders', COUNT(*) FROM "orders"
UNION ALL
SELECT 'Cart Items', COUNT(*) FROM "cart";

-- Check products per category
SELECT 
    c."id" as cat_id,
    c."name" as category,
    COUNT(p."id") as products
FROM "categories" c
LEFT JOIN "products" p ON c."id" = p."category_id"
GROUP BY c."id", c."name"
ORDER BY c."id";

-- =====================================================
-- REBUILD COMPLETE!
-- =====================================================
-- Database now contains:
-- - 9 Users (2 admins, 7 customers)
-- - 4 Categories
-- - 24 Products (CLEAN DATA ONLY - IDs 1-24)
-- - 9 Support Tickets
-- - 12 Quotations
-- - 31 Quotation Items (only referencing valid products 1-24)
-- - 12 Orders
-- - 0 Cart Items (empty, ready to use)
-- =====================================================
