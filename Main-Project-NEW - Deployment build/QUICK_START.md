# ⚡ Quick Start Deployment Checklist

Use this as a quick reference while deploying. For detailed instructions, see `DEPLOYMENT_GUIDE.md`.

---

## ☑️ Pre-Deployment Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub repository
- [ ] PostgreSQL dependency added to `pom.xml`
- [ ] `application-prod.properties` configured for PostgreSQL

---

## ☑️ Render Setup (Backend + Database)

### Database:
- [ ] Signed up on Render.com
- [ ] Created PostgreSQL database named `bathware-db`
- [ ] Saved database credentials (host, port, username, password)

### Backend Service:
- [ ] Created Web Service on Render
- [ ] Connected to GitHub repository
- [ ] Set Root Directory to `BathwareNew`
- [ ] Selected Docker environment
- [ ] Added all environment variables:
  - `SPRING_PROFILES_ACTIVE=prod`
  - `DB_HOST`
  - `DB_PORT=5432`
  - `DB_NAME=bathware`
  - `DB_USERNAME`
  - `DB_PASSWORD`
  - `EMAIL_USERNAME`
  - `EMAIL_PASSWORD`
  - `UPLOADS_DIR=/app/uploads/bills`
  - `PRODUCT_IMAGES_DIR=/app/uploads/images`
- [ ] Backend deployed successfully
- [ ] Backend URL saved: `https://bathware-backend.onrender.com`

---

## ☑️ Netlify Setup (Frontend)

- [ ] Signed up on Netlify.com
- [ ] Created new site from GitHub
- [ ] Set Base directory to `BathwareNew/frontend`
- [ ] Set Build command to `npm run build`
- [ ] Set Publish directory to `BathwareNew/frontend/build`
- [ ] Added environment variable:
  - `REACT_APP_API_URL=https://bathware-backend.onrender.com`
- [ ] Frontend deployed successfully
- [ ] Frontend URL saved: `https://your-site.netlify.app`

---

## ☑️ Final Configuration

- [ ] Updated CORS settings in Render backend:
  - Added `CORS_ORIGINS` environment variable with Netlify URL
- [ ] Backend service redeployed after CORS update

---

## ☑️ Testing

- [ ] Frontend loads successfully
- [ ] Can sign up for new account
- [ ] Can log in
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Backend API calls working

---

## 📝 Important URLs

- **Frontend:** _________________________
- **Backend:** __________________________
- **Database:** (internal use only)

---

## 🚨 Common Issues

| Issue | Quick Fix |
|-------|----------|
| Backend slow on first request | Normal - free tier wakes up (30-50s) |
| Cannot connect to backend | Check CORS settings & backend URL |
| Build failed | Check logs in dashboard |
| Database error | Verify credentials in environment variables |

---

## 🔄 Updating Your App

```bash
git add .
git commit -m "Your changes"
git push
```

Both Render and Netlify will auto-deploy! ✨

---

**Need detailed help?** See `DEPLOYMENT_GUIDE.md`

