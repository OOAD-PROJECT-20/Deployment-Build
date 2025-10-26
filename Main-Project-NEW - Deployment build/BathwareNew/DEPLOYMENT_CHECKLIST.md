# ✅ Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deployment.

---

## 📋 Code Changes Completed

### Backend Configuration
- [x] PostgreSQL driver added to `pom.xml`
- [x] `application-prod.properties` configured for PostgreSQL
- [x] Dockerfile created for Docker deployment
- [x] render.yaml created for Render configuration
- [x] Environment variables use `${VAR:default}` format
- [x] CORS configuration added
- [x] Email configuration uses environment variables

### Frontend Configuration  
- [x] API configuration centralized in `src/config/api.js`
- [x] All 15+ page components updated to use `API_BASE_URL`
- [x] netlify.toml created for Netlify deployment
- [x] Environment variable support added (`REACT_APP_API_URL`)

### Database
- [x] PostgreSQL deployment script created (`deployment.sql`)
- [x] MySQL to PostgreSQL conversion completed
- [x] Triggers for auto-update timestamps added
- [x] Sample data included
- [x] Database deployment guide created

### Documentation
- [x] Main deployment guide created (`DEPLOYMENT_GUIDE.md`)
- [x] Quick start checklist created (`QUICK_START.md`)
- [x] Environment variables reference created (`ENVIRONMENT_VARIABLES.md`)
- [x] Database deployment guide created
- [x] Project README updated
- [x] .gitignore configured properly

---

## 🔍 Files to Review Before Deployment

### Check These Files:

1. **`BathwareNew/pom.xml`**
   - [ ] PostgreSQL dependency present
   - [ ] Java version set to 21
   - [ ] All other dependencies correct

2. **`BathwareNew/src/main/resources/application-prod.properties`**
   - [ ] PostgreSQL dialect configured
   - [ ] PostgreSQL driver class specified
   - [ ] Port set to 5432
   - [ ] All variables use environment variable format
   - [ ] ddl-auto set to "update"

3. **`BathwareNew/Dockerfile`**
   - [ ] Java 17 or 21 specified
   - [ ] Maven build steps included
   - [ ] Port 8080 exposed
   - [ ] Uploads directory created

4. **`BathwareNew/render.yaml`**
   - [ ] Service type is "web"
   - [ ] Environment is "docker"
   - [ ] All required environment variables listed
   - [ ] Database connection variables configured

5. **`BathwareNew/frontend/netlify.toml`**
   - [ ] Build command is "npm run build"
   - [ ] Publish directory is "build"
   - [ ] Base directory is "BathwareNew/frontend"
   - [ ] Redirects configured for React Router

6. **`BathwareNew/frontend/src/config/api.js`**
   - [ ] Uses `process.env.REACT_APP_API_URL`
   - [ ] Has localhost fallback
   - [ ] Exported as default

---

## 🚫 Things NOT to Commit to GitHub

Make sure these are in `.gitignore`:

- [ ] `node_modules/`
- [ ] `target/`
- [ ] `.env` files
- [ ] `logs/`
- [ ] `uploads/` (with actual files)
- [ ] `*.log` files
- [ ] IDE files (`.idea/`, `.vscode/`, etc.)

---

## 🔐 Sensitive Information to Keep Secret

**NEVER commit these to Git:**

- [ ] Database passwords
- [ ] Email passwords (Gmail app password)
- [ ] JWT secrets
- [ ] API keys
- [ ] Any `.env` files with real credentials

---

## 📤 Ready to Push to GitHub?

Before pushing:

1. **Review all changes:**
```bash
git status
git diff
```

2. **Check .gitignore is working:**
```bash
git status --ignored
```

3. **Ensure no sensitive data:**
```bash
# Search for potential secrets
grep -r "password" --exclude-dir={node_modules,target,.git}
```

4. **Test locally first:**
```bash
# Backend
cd BathwareNew
mvn clean package
java -jar target/*.jar

# Frontend
cd frontend
npm install
npm start
```

5. **Commit and push:**
```bash
git add .
git commit -m "Prepare for deployment with PostgreSQL support"
git push origin main
```

---

## 🚀 Deployment Day Checklist

### Before Deploying:

- [ ] All code changes committed and pushed to GitHub
- [ ] GitHub repository is accessible
- [ ] Render account created and verified
- [ ] Netlify account created and verified
- [ ] Gmail app password generated (if using email features)

### During Backend Deployment (Render):

- [ ] Database service created
- [ ] Database credentials saved securely
- [ ] Web service created and connected to GitHub
- [ ] All environment variables added:
  - [ ] `SPRING_PROFILES_ACTIVE=prod`
  - [ ] `DB_HOST` (from database)
  - [ ] `DB_PORT=5432`
  - [ ] `DB_NAME=bathware`
  - [ ] `DB_USERNAME` (from database)
  - [ ] `DB_PASSWORD` (from database)
  - [ ] `EMAIL_USERNAME`
  - [ ] `EMAIL_PASSWORD` (app password)
  - [ ] `UPLOAD_DIR=/app/uploads`
- [ ] Build completed successfully
- [ ] Service is running
- [ ] Backend URL saved

### During Frontend Deployment (Netlify):

- [ ] Site created and connected to GitHub
- [ ] Build settings configured:
  - [ ] Base directory: `BathwareNew/frontend`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `BathwareNew/frontend/build`
- [ ] Environment variable added:
  - [ ] `REACT_APP_API_URL` (your backend URL)
- [ ] Build completed successfully
- [ ] Site is live
- [ ] Frontend URL saved

### After Deployment:

- [ ] CORS configured in backend (add frontend URL)
- [ ] Backend redeployed with CORS settings
- [ ] Database populated (either auto or manual)
- [ ] Test user login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test support tickets
- [ ] Test admin functions
- [ ] All features working correctly

---

## 🧪 Testing Checklist

### Frontend Tests:

- [ ] Site loads without errors
- [ ] Navigation works (all links)
- [ ] Login page accessible
- [ ] Signup page accessible
- [ ] Images load correctly
- [ ] No console errors (check F12)

### Backend Tests:

- [ ] Backend URL responds (check in browser)
- [ ] API endpoints return data
- [ ] Database connection working
- [ ] CORS allows frontend requests
- [ ] File upload works (if tested)

### Integration Tests:

- [ ] Can sign up new user
- [ ] Can log in with test credentials
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Can create quotation
- [ ] Can create support ticket
- [ ] Admin can manage products
- [ ] Admin can manage users
- [ ] Admin can manage quotations

### Performance Tests:

- [ ] First load time acceptable (may be slow on free tier)
- [ ] Subsequent requests faster
- [ ] Images load efficiently
- [ ] No memory leaks (check over time)

---

## 📞 Emergency Contacts & Resources

### If Something Goes Wrong:

1. **Check Render Logs:**
   - Dashboard → Your Service → Logs
   - Look for error messages in red

2. **Check Netlify Logs:**
   - Dashboard → Deploys → Click deploy → View logs
   - Look for build errors

3. **Check Browser Console:**
   - Press F12 in browser
   - Look for errors in Console tab
   - Check Network tab for failed requests

4. **Common Fixes:**
   - Clear browser cache
   - Restart Render service
   - Trigger Netlify redeploy
   - Check environment variables
   - Verify CORS settings

### Documentation Links:

- Main Guide: `DEPLOYMENT_GUIDE.md`
- Quick Start: `QUICK_START.md`
- Environment Variables: `ENVIRONMENT_VARIABLES.md`
- Database Setup: `BathwareNew/Database/Final sql/README_DEPLOYMENT.md`

---

## ✅ Deployment Complete!

When everything is checked off:

- [ ] Frontend is live and accessible
- [ ] Backend is live and responding
- [ ] Database is populated and working
- [ ] All features tested and working
- [ ] URLs documented and saved
- [ ] Access credentials secured

**🎉 Congratulations! Your Bathware System is deployed! 🎉**

---

## 📊 Post-Deployment

### Things to Monitor:

- [ ] Service uptime (Render dashboard)
- [ ] Build minutes usage (free tier limits)
- [ ] Database size (free tier: 1GB)
- [ ] Bandwidth usage (Netlify: 100GB/month)
- [ ] Error rates (check logs regularly)

### Maintenance Schedule:

- **Daily:** Check if services are running
- **Weekly:** Review logs for errors
- **Monthly:** Check usage limits, update dependencies
- **As needed:** Apply security updates, add features

### Upgrade Considerations:

If you outgrow free tier:
- Render backend: $7/month (no sleep)
- Render database: $7/month (more storage)
- Netlify stays free (excellent free tier)

---

**Keep this checklist for future deployments and updates!**

*Created: October 2025*

