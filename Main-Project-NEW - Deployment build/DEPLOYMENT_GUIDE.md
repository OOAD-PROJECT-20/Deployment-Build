# 🚀 Easy Deployment Guide - Bathware System

This guide will help you deploy your Bathware System using the **EASIEST** method:
- **Render.com** for Backend + Database (Free Tier)
- **Netlify** for Frontend (Free Tier)

**No AWS knowledge required! Just follow these steps. ⏱️ Total time: ~30 minutes**

---

## 📋 Prerequisites

Before you start, make sure you have:
- [ ] A GitHub account (create one at https://github.com if you don't have one)
- [ ] Git installed on your computer
- [ ] This project code ready

---

## 🎯 PART 1: Prepare Your Code (5 minutes)

### Step 1: Create a GitHub Repository

1. Go to https://github.com and sign in
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Repository name: `bathware-system` (or any name you want)
5. Choose **"Private"** or **"Public"** (your choice)
6. **DO NOT** initialize with README (we already have code)
7. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

Open your terminal/PowerShell in your project directory and run:

```bash
# Navigate to your project directory (if not already there)
cd "C:\Users\ASUS\Documents\Main-Project-NEW - Deployment build"

# Initialize git if not already done
git init

# Create a .gitignore file (if not exists)
echo "node_modules/
target/
.env
.env.local
logs/
uploads/
*.log" > .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit for deployment"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bathware-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## 🗄️ PART 2: Deploy Database & Backend on Render (10 minutes)

### Step 3: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up using your **GitHub account** (click "Sign up with GitHub")
4. Authorize Render to access your GitHub repositories

### Step 4: Create a MySQL Database

1. In Render dashboard, click **"New +"** button
2. Select **"PostgreSQL"** (Render's free tier uses PostgreSQL, not MySQL)
   - *Don't worry! We'll adjust the configuration for PostgreSQL*
3. Fill in the details:
   - **Name:** `bathware-db`
   - **Database:** `bathware`
   - **User:** `bathware_user` (will be auto-generated)
   - **Region:** Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
   - **Plan:** Select **"Free"**
4. Click **"Create Database"**
5. Wait 1-2 minutes for the database to be created

### Step 5: Update Backend Code for PostgreSQL

Since Render's free tier uses PostgreSQL instead of MySQL, we need to make a small change:

1. Open `BathwareNew/pom.xml` in your editor
2. Find the MySQL dependency section and add PostgreSQL:

```xml
<!-- Add this PostgreSQL dependency -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

3. Update `BathwareNew/src/main/resources/application-prod.properties`:

Change this line:
```properties
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

To:
```properties
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

4. Commit and push the changes:
```bash
git add .
git commit -m "Add PostgreSQL support for Render deployment"
git push
```

### Step 6: Import Your Database Schema

1. In Render dashboard, click on your **"bathware-db"** database
2. Click on **"Connect"** tab
3. Copy the **"External Database URL"** (it looks like: `postgres://user:password@host/database`)
4. Download a PostgreSQL client like **DBeaver** (https://dbeaver.io/download/) or use the web shell in Render
5. Connect to your database using the URL
6. Convert your SQL file to PostgreSQL format and run it:
   - Open `BathwareNew/Database/Final sql/FINAL_SQL.sql`
   - Make these changes:
     - Replace `AUTO_INCREMENT` with `SERIAL`
     - Replace backticks `` `table_name` `` with double quotes `"table_name"`
     - Replace `INT` with `INTEGER` where needed
   - Or you can create tables manually after deployment using the application's auto-create feature

### Step 7: Deploy Backend Service

1. In Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect to your GitHub repository:
   - Click **"Connect repository"**
   - Find and select **"bathware-system"**
4. Fill in the details:
   - **Name:** `bathware-backend`
   - **Region:** Same as your database
   - **Root Directory:** `BathwareNew`
   - **Environment:** `Docker`
   - **Branch:** `main`
   - **Plan:** Select **"Free"**
5. Click **"Advanced"** to add environment variables
6. Add these environment variables (click "Add Environment Variable" for each):

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DB_HOST` | Copy from your database "Internal Database URL" (just the host part) |
| `DB_PORT` | `5432` |
| `DB_NAME` | `bathware` |
| `DB_USERNAME` | Copy from your database details |
| `DB_PASSWORD` | Copy from your database details |
| `EMAIL_USERNAME` | `anudaranasinghe2@gmail.com` |
| `EMAIL_PASSWORD` | `tjhu wgfc sbvq mndm` |
| `UPLOADS_DIR` | `/app/uploads/bills` |
| `PRODUCT_IMAGES_DIR` | `/app/uploads/images` |

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for the build and deployment to complete
9. Once deployed, you'll see a URL like: `https://bathware-backend.onrender.com`

✅ **Your backend is now live!**

⚠️ **Important Note:** Render's free tier services go to sleep after 15 minutes of inactivity. The first request after sleep will take 30-50 seconds to wake up.

---

## 🌐 PART 3: Deploy Frontend on Netlify (10 minutes)

### Step 8: Create Environment File for Frontend

1. In your project, you need to tell the frontend where your backend is
2. You'll set this in Netlify's dashboard (we'll do this in Step 11)

### Step 9: Sign Up for Netlify

1. Go to https://netlify.com
2. Click **"Sign up"**
3. Sign up using your **GitHub account**
4. Authorize Netlify to access your repositories

### Step 10: Deploy Frontend

1. In Netlify dashboard, click **"Add new site"**
2. Select **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Find and select your **"bathware-system"** repository
5. Configure the build settings:
   - **Base directory:** `BathwareNew/frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `BathwareNew/frontend/build`
6. Click **"Show advanced"** and then **"New variable"**
7. Add environment variable:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://bathware-backend.onrender.com` (use YOUR actual backend URL from Step 7)
8. Click **"Deploy site"**
9. Wait 3-5 minutes for the build to complete

### Step 11: Update Environment Variables (if needed)

1. After deployment, go to **"Site settings"** > **"Environment variables"**
2. Verify that `REACT_APP_API_URL` is set correctly
3. If you need to change it:
   - Click **"Edit variables"**
   - Update the value
   - Click **"Save"**
   - Go to **"Deploys"** and click **"Trigger deploy"** > **"Clear cache and deploy site"**

### Step 12: Configure Custom Domain (Optional)

1. In Netlify, go to **"Domain settings"**
2. You'll see a default URL like: `https://random-name-12345.netlify.app`
3. You can:
   - **Option A:** Click "Change site name" to customize the subdomain (e.g., `bathware-system.netlify.app`)
   - **Option B:** Add your own custom domain if you have one

✅ **Your frontend is now live!**

---

## 🔄 PART 4: Update Backend CORS Settings (5 minutes)

Your backend needs to allow requests from your frontend domain.

### Step 13: Update CORS Configuration

1. Go back to Render dashboard
2. Click on your **"bathware-backend"** service
3. Go to **"Environment"** tab
4. Add a new environment variable:
   - **Key:** `CORS_ORIGINS`
   - **Value:** `https://your-site-name.netlify.app` (use YOUR actual Netlify URL)
5. Click **"Save Changes"**
6. The service will automatically redeploy (wait 2-3 minutes)

---

## ✅ PART 5: Test Your Deployment

### Step 14: Test the Application

1. Open your Netlify URL in a browser
2. Try to:
   - [ ] Sign up for a new account
   - [ ] Log in
   - [ ] Browse products
   - [ ] Add items to cart
   - [ ] Create a support ticket

⚠️ **Remember:** The first request might be slow (30-50 seconds) because Render's free tier needs to wake up the service.

---

## 🎉 You're Done!

Your Bathware System is now deployed and accessible from anywhere!

### 📝 Important URLs to Save:

- **Frontend:** `https://your-site-name.netlify.app`
- **Backend:** `https://bathware-backend.onrender.com`
- **Database:** (Accessible only via backend)

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to backend"

**Solution:**
1. Check if backend URL in Netlify environment variables is correct
2. Check CORS settings in backend environment variables
3. Check if backend service is running in Render dashboard
4. Wait 30-50 seconds for the free tier to wake up

### Problem: "Database connection error"

**Solution:**
1. Check database credentials in Render backend environment variables
2. Make sure database service is running
3. Check if PostgreSQL dependency is added to `pom.xml`

### Problem: "Build failed" on Netlify

**Solution:**
1. Check build logs in Netlify dashboard
2. Make sure `package.json` has all dependencies
3. Try clearing cache and redeploying

### Problem: "Build failed" on Render

**Solution:**
1. Check build logs in Render dashboard
2. Make sure `Dockerfile` is in the `BathwareNew` directory
3. Make sure PostgreSQL dependency is in `pom.xml`

---

## 🔄 Making Updates After Deployment

Whenever you make changes to your code:

1. **Commit and push to GitHub:**
```bash
git add .
git commit -m "Description of changes"
git push
```

2. **Automatic redeployment:**
   - Netlify will automatically detect the push and redeploy your frontend
   - Render will automatically detect the push and redeploy your backend
   - No manual steps needed!

---

## 💰 Cost Breakdown

- **Render PostgreSQL Database (Free Tier):** $0/month
  - 256 MB RAM
  - 1 GB Storage
  - Expires after 90 days (you'll need to create a new one)

- **Render Web Service (Free Tier):** $0/month
  - 512 MB RAM
  - Sleeps after 15 minutes of inactivity
  - 750 hours/month (plenty for testing)

- **Netlify (Free Tier):** $0/month
  - 100 GB bandwidth/month
  - Unlimited sites
  - Automatic SSL

**Total Cost: $0/month** ✨

---

## 🚀 Next Steps (Optional)

If you need better performance:

1. **Upgrade Render Backend to $7/month:**
   - No sleep
   - Better performance
   - 512 MB RAM

2. **Upgrade Database to $7/month:**
   - No expiration
   - 1 GB RAM
   - 10 GB Storage

3. **Keep Netlify Free:**
   - Frontend is already fast on free tier!

---

## 📞 Need Help?

If you run into issues:

1. Check the **Troubleshooting** section above
2. Check Render build logs: Dashboard > Service > Logs
3. Check Netlify build logs: Dashboard > Deploys > Click on deploy > Build logs
4. Check browser console for frontend errors (F12 in browser)

---

## 📚 Additional Resources

- **Render Documentation:** https://render.com/docs
- **Netlify Documentation:** https://docs.netlify.com
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **Spring Boot Deployment Guide:** https://spring.io/guides/gs/spring-boot/

---

**Happy Deploying! 🎉**

*Created: October 2025*
*Last Updated: October 2025*

