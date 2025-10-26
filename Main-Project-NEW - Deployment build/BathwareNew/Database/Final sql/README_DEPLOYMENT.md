# 🗄️ Database Deployment Guide for PostgreSQL (Render)

This guide explains how to set up the database for your Bathware System on Render using PostgreSQL.

---

## 📋 Files in This Directory

- **`FINAL_SQL.sql`** - Original MySQL database schema (for local development)
- **`deployment.sql`** - PostgreSQL-compatible database schema (for Render deployment)
- **`README_DEPLOYMENT.md`** - This file

---

## 🚀 Option 1: Let Spring Boot Auto-Create Tables (EASIEST - RECOMMENDED)

The easiest way is to let Spring Boot automatically create the tables for you!

### Steps:

1. **Deploy your backend to Render** (follow the main DEPLOYMENT_GUIDE.md)
2. **Set environment variables** in Render:
   - `spring.jpa.hibernate.ddl-auto=update`
3. **Deploy and wait** - Spring Boot will automatically create all tables
4. **Access your backend URL** once to trigger table creation
5. **Done!** Tables are created automatically

### ✅ Advantages:
- No manual SQL execution needed
- Tables match your Java entities exactly
- Automatic schema updates when you modify entities
- Less room for errors

### ⚠️ Note:
- You'll need to manually insert initial data (users, categories, products)
- Or use the application's admin interface to add products

---

## 🚀 Option 2: Run SQL Script Manually

If you want to pre-populate the database with sample data, follow these steps:

### Prerequisites:
- Render database created and running
- Database connection details from Render dashboard

### Steps:

#### Step 1: Connect to Your Render Database

**Option A: Using Render Web Shell**
1. Go to Render Dashboard
2. Click on your database service
3. Click on "Connect" tab
4. Click on "Web Shell" button
5. You'll be connected to PostgreSQL command line

**Option B: Using Local PostgreSQL Client (psql)**
1. Get the "External Database URL" from Render dashboard
2. It looks like: `postgres://username:password@host:port/database`
3. Open terminal and run:
```bash
psql <paste-the-external-database-url-here>
```

**Option C: Using DBeaver or Another GUI Client**
1. Download DBeaver: https://dbeaver.io/download/
2. Create new PostgreSQL connection
3. Fill in details from Render dashboard:
   - Host: (from External Database URL)
   - Port: 5432
   - Database: (from External Database URL)
   - Username: (from External Database URL)
   - Password: (from External Database URL)
4. Test connection and click "Finish"

#### Step 2: Run the Deployment SQL

1. **Copy the contents** of `deployment.sql`
2. **Paste into your SQL client** (web shell, psql, or DBeaver)
3. **Execute the SQL**
4. **Wait for completion** (should take 10-30 seconds)
5. **Verify** by running: `SELECT * FROM "user";`

---

## 🔍 Key Differences: MySQL vs PostgreSQL

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Auto-increment | `AUTO_INCREMENT` | `SERIAL` or `BIGSERIAL` |
| Quotes | Backticks `` `table` `` | Double quotes `"table"` |
| ENUM type | Native `ENUM` | Use `VARCHAR` with `CHECK` or `CREATE TYPE` |
| Auto-update timestamp | `ON UPDATE CURRENT_TIMESTAMP` | Requires trigger function |
| Case sensitivity | Case-insensitive by default | Case-sensitive |
| String concatenation | `CONCAT()` | `||` operator or `CONCAT()` |

All these differences have been handled in `deployment.sql`!

---

## 📊 Database Schema Overview

### Tables Created:

1. **user** - User accounts (customers and admins)
2. **admin** - Admin-specific data
3. **customer** - Customer-specific data
4. **categories** - Product categories
5. **products** - All products in the system
6. **cart** - Shopping cart items
7. **quotation** - Customer quotation requests
8. **quotation_items** - Items in each quotation
9. **orders** - Confirmed orders with payment
10. **support** - Customer support tickets

### Sample Data Included:

- ✅ 4 sample users (1 admin, 3 customers)
- ✅ 4 product categories
- ✅ 40+ products across all categories
- ✅ Sample cart items
- ✅ Sample quotations and orders
- ✅ Sample support tickets

---

## 🔐 Default Users for Testing

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin2 | adminpass | ADMIN | admin2@example.com |
| user | userpass | USER | user@example.com |
| customer1 | pass123 | USER | customer1@gmail.com |
| customer2 | pass234 | USER | customer2@gmail.com |

⚠️ **IMPORTANT:** These are test passwords. In production:
1. Change all passwords immediately after deployment
2. Spring Security will encrypt them with BCrypt
3. Never use simple passwords in production

---

## ✅ Verify Database Setup

After running the SQL or letting Spring Boot create tables, verify:

### Using SQL:

```sql
-- Check if all tables exist
\dt

-- Count records in each table
SELECT COUNT(*) as users FROM "user";
SELECT COUNT(*) as categories FROM "categories";
SELECT COUNT(*) as products FROM "products";
SELECT COUNT(*) as cart_items FROM "cart";

-- View sample data
SELECT * FROM "user" LIMIT 5;
SELECT * FROM "categories";
SELECT * FROM "products" LIMIT 10;
```

### Using Your Application:

1. Open your deployed frontend URL
2. Try logging in with a test user
3. Browse products
4. Add items to cart
5. Create a support ticket

If everything works, your database is set up correctly! ✅

---

## 🔧 Troubleshooting

### Problem: "relation does not exist"

**Solution:** Tables haven't been created yet. Either:
- Run the `deployment.sql` script, OR
- Let Spring Boot auto-create them (set `ddl-auto=update`)

### Problem: "syntax error near"

**Solution:** Make sure you're running the PostgreSQL version (`deployment.sql`), not the MySQL version (`FINAL_SQL.sql`)

### Problem: "password authentication failed"

**Solution:** Check your database credentials in Render dashboard and environment variables

### Problem: "could not connect to server"

**Solution:** 
- Check if database service is running in Render
- Verify you're using the correct host and port
- Check if your IP is whitelisted (Render doesn't require this, but check firewall)

### Problem: "duplicate key value violates unique constraint"

**Solution:** Data already exists. This is fine! The script uses `ON CONFLICT DO NOTHING` to prevent errors.

---

## 🔄 Reset Database (If Needed)

If you need to start fresh:

```sql
-- WARNING: This will delete ALL data!

DROP TABLE IF EXISTS "support" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "quotation_items" CASCADE;
DROP TABLE IF EXISTS "quotation" CASCADE;
DROP TABLE IF EXISTS "cart" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "customer" CASCADE;
DROP TABLE IF EXISTS "admin" CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- Now run deployment.sql again
```

---

## 📚 Additional Resources

- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Render PostgreSQL Guide:** https://render.com/docs/databases
- **Spring Boot + PostgreSQL:** https://spring.io/guides/gs/accessing-data-postgresql/

---

## 🎯 Best Practices

1. ✅ **Always backup** before making changes
2. ✅ **Test queries** in development first
3. ✅ **Use transactions** for multiple operations
4. ✅ **Monitor database size** (free tier has limits)
5. ✅ **Keep connection string secure** (never commit to git)
6. ✅ **Use environment variables** for credentials
7. ✅ **Enable SSL** for production databases

---

**Database setup complete! Your Bathware System is ready for deployment! 🎉**

*Last Updated: October 2025*

