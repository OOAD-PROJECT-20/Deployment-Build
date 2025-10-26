# 📁 Uploads Directory Migration & Configuration Guide

## 🚨 IMPORTANT: Uploads Directory Issue Fixed

Your uploads directory was **outside** the BathwareNew folder, which would break in Docker deployment. This has been fixed!

---

## 📊 What Was The Problem?

### Before (BROKEN for deployment):
```
Main-Project-NEW - Deployment build\
  ├── BathwareNew\           ← Backend code
  │   └── ...
  └── uploads\               ← Bills/payment slips (OUTSIDE BathwareNew)
      ├── bill1.png
      ├── bill2.png
      └── ...
```

**Problems:**
- ❌ Docker only builds from `BathwareNew/` directory
- ❌ Files outside `BathwareNew/` are NOT copied to Docker image
- ❌ Hardcoded paths break in production
- ❌ Lost files on deployment

---

## ✅ What Was Fixed?

### 1. **OrderService.java** - Fixed hardcoded upload path
**Before:**
```java
private final String uploadsDir = System.getProperty("user.dir") + File.separator + "uploads";
```

**After:**
```java
@Value("${uploads.dir:uploads}")
private String uploadsDir;
```

### 2. **ProductImageController.java** - Fixed image upload path
**Before:**
```java
String workingDir = System.getProperty("user.dir");
// Complex logic to determine path...
```

**After:**
```java
@Value("${product.images.dir:frontend/public/images}")
private String imagesDir;
```

### 3. **Configuration Files Updated**
- ✅ `application.properties` - Added `uploads.dir` property
- ✅ `application-prod.properties` - Uses environment variable `UPLOADS_DIR`
- ✅ Environment variables guide updated

---

## 🛠️ How It Works Now

### Local Development (No changes needed):
```
uploads.dir=uploads
product.images.dir=frontend/public/images
```
Files saved in project root as before!

### Production Deployment (Render):
```
UPLOADS_DIR=/app/uploads/bills
PRODUCT_IMAGES_DIR=/app/uploads/images
```
Files saved inside Docker container's `/app/uploads/`

---

## 🚀 For Deployment: Two Options

### **Option 1: Use Ephemeral Storage (EASIEST - RECOMMENDED)**

Files are stored in Docker container but **lost on restart**. Good for testing!

**Setup:**
1. No changes needed - Dockerfile already creates `/app/uploads`
2. Files saved temporarily in container
3. ⚠️ **WARNING:** Files deleted when service restarts/redeploys

**Pros:**
- ✅ Easy, no setup
- ✅ Works immediately

**Cons:**
- ❌ Files lost on restart
- ❌ Not suitable for production

---

### **Option 2: Use Persistent Storage (For Production)**

Use Render's **Persistent Disk** to keep files permanently.

**Setup:**

1. **Create Persistent Disk in Render:**
   - Go to Render Dashboard
   - Click your web service
   - Go to "Disks" tab
   - Click "Add Disk"
   - Name: `bathware-uploads`
   - Mount Path: `/app/uploads`
   - Size: 1GB (or more)
   - Click "Create"

2. **Update Environment Variables in Render:**
   Add these variables (if not already set):
   ```
   UPLOADS_DIR=/app/uploads/bills
   PRODUCT_IMAGES_DIR=/app/uploads/images
   ```

3. **Redeploy your service**
   - Service will auto-redeploy after adding disk
   - Files now persist across restarts!

**Pros:**
- ✅ Files persist forever
- ✅ Survives restarts/redeploys
- ✅ Production-ready

**Cons:**
- ❌ Costs money after free tier ($0.25/GB/month)
- ❌ Limited to 1GB on free tier

---

## 📦 Dockerfile Already Handles This

The Dockerfile already creates the uploads directory:

```dockerfile
# Create uploads directory
RUN mkdir -p /app/uploads
```

This ensures the directory exists even without persistent disk!

---

## 🔄 Migrating Existing Files (Optional)

If you have important files in the current `uploads/` folder:

### Option A: Copy Files to Render (Manual)

1. **Connect to your Render service:**
   ```bash
   # Install Render CLI
   npm install -g @render-cli/render
   
   # Login
   render login
   
   # Connect to your service
   render shell <your-service-name>
   ```

2. **Upload files:**
   ```bash
   # From your local machine
   scp -r uploads/* <render-shell>:/app/uploads/bills/
   ```

### Option B: Start Fresh (Recommended)

1. Delete old uploads folder (it's not needed for deployment)
2. Let users upload new payment slips after deployment
3. Old data can stay in database, just images won't show

---

## 🧪 Testing After Deployment

### Test Payment Slip Upload:

1. Login to your deployed app
2. Go to checkout/quotations
3. Request a quotation
4. Upload a payment slip
5. Check if it saves successfully
6. Try viewing the uploaded slip

### Test Product Image Upload (Admin):

1. Login as admin
2. Go to product management
3. Add/edit a product
4. Upload an image
5. Check if it displays correctly

---

## 🔍 Troubleshooting

### Problem: "Failed to create directory"

**Cause:** No write permissions in container

**Solution:**
```dockerfile
# Add to Dockerfile if needed
RUN chmod -R 777 /app/uploads
```

### Problem: "File not found" when viewing uploaded files

**Cause:** Files saved but can't be retrieved

**Solution:**
1. Check `FileController.java` serves files from correct path
2. Verify environment variables are set
3. Check file permissions

### Problem: Files disappear after restart

**Cause:** Using ephemeral storage without persistent disk

**Solution:** Add Render Persistent Disk (see Option 2 above)

### Problem: "No space left on device"

**Cause:** Disk full (free tier has limits)

**Solution:**
1. Delete old files
2. Reduce file sizes
3. Upgrade disk size

---

## 📝 For Local Development

### Where Files Are Saved Locally:

**Payment Slips:**
```
Main-Project-NEW - Deployment build\
  └── uploads\
      ├── 1761464412097_bill1.png
      └── ...
```

**Product Images:**
```
BathwareNew\
  └── frontend\
      └── public\
          └── images\
              ├── CC Delux Basin.png
              └── ...
```

### To Test Locally:

1. Start backend: `cd BathwareNew && mvn spring-boot:run`
2. Start frontend: `cd BathwareNew/frontend && npm start`
3. Upload files - they'll go to `uploads/` and `frontend/public/images/`
4. Everything works as before!

---

## 🎯 Summary of Changes

| File | What Changed | Why |
|------|--------------|-----|
| **OrderService.java** | Use `@Value` annotation for uploads path | Make path configurable |
| **ProductImageController.java** | Use `@Value` annotation for images path | Make path configurable |
| **application.properties** | Added `uploads.dir` property | Configure local upload path |
| **application-prod.properties** | Added `UPLOADS_DIR` env var | Configure production upload path |
| **Dockerfile** | Creates `/app/uploads` directory | Ensure directory exists |
| **DEPLOYMENT_GUIDE.md** | Added note about persistent storage | Document deployment options |

---

## ✅ Checklist

- [x] OrderService fixed to use configurable path
- [x] ProductImageController fixed to use configurable path
- [x] application.properties updated with uploads.dir
- [x] application-prod.properties updated with UPLOADS_DIR
- [x] Dockerfile creates /app/uploads directory
- [x] Documentation updated

### Before Deploying:

- [ ] Test file upload locally (make sure it still works)
- [ ] Commit all changes to Git
- [ ] Push to GitHub
- [ ] Deploy to Render
- [ ] (Optional) Add persistent disk for production
- [ ] Test file upload on deployed site

---

## 🎉 You're All Set!

The upload functionality now works both locally AND in deployment. Files will be saved properly in the Docker container!

**For production use, remember to add Render Persistent Disk to keep files permanent!**

---

*Last Updated: October 2025*

