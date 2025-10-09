# 🚀 Deploy Backend to Render

## Step-by-Step Render Deployment Guide

### Prerequisites
- GitHub account with the Finance Manager repository
- Render account (sign up at https://render.com - free)

---

## 📋 Deployment Steps

### Step 1: Create Render Account
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended for easy deployment)
4. Authorize Render to access your GitHub repositories

### Step 2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure database:
   - **Name:** `finance-manager-db`
   - **Database:** `finance_manager`
   - **User:** `finance_manager_user`
   - **Region:** Choose closest to your users (e.g., Oregon, Frankfurt)
   - **Plan:** **Free** (sufficient for development/testing)
3. Click **"Create Database"**
4. Wait for database to provision (1-2 minutes)
5. **Important:** Copy the **Internal Database URL** - you'll need this!

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Select **"Finance-Manager-AiBased"** repository
   - Click **"Connect"**

3. Configure the service:

   **Basic Settings:**
   - **Name:** `finance-manager-api`
   - **Region:** Same as database (e.g., Oregon)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** 
     ```bash
     npm install && npm run build
     ```
   - **Start Command:** 
     ```bash
     npm run start:prod
     ```

4. **Plan:** Select **"Free"** (sufficient for testing)

### Step 4: Configure Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<paste_your_internal_database_url_here>
JWT_SECRET=<generate_a_random_secure_string>
JWT_EXPIRATION=7d
FRONTEND_URL=https://frontend-lvqnp79qz-leandre000s-projects.vercel.app
```

**To generate JWT_SECRET:**
```bash
# Run in terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use a random string like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Build the application
   - Run database migrations (automatically)
   - Start the server

3. Monitor deployment in the **"Logs"** tab
4. Wait for: **"Your service is live 🎉"** (3-5 minutes)

### Step 6: Verify Deployment

1. Find your service URL (e.g., `https://finance-manager-api.onrender.com`)
2. Test the API:
   ```bash
   curl https://your-service-url.onrender.com/api/health
   ```

3. Check logs for any errors:
   - Go to **"Logs"** tab in Render dashboard
   - Look for "FIMA backend running on..."

---

## 🔗 Connect Frontend to Backend

### Step 1: Update Frontend Environment Variable

```bash
cd frontend
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://your-render-service-url.onrender.com
```

### Step 2: Redeploy Frontend

```bash
vercel --prod
```

### Step 3: Update Backend CORS (if needed)

If you get CORS errors, verify in `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
});
```

And ensure `FRONTEND_URL` is set correctly in Render environment variables.

---

## 🧪 Testing the Deployment

### 1. Health Check
```bash
curl https://your-service-url.onrender.com/api/health
```

### 2. Register a User
```bash
curl -X POST https://your-service-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","name":"Test User"}'
```

### 3. Login
```bash
curl -X POST https://your-service-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

### 4. Test via Frontend
1. Visit your frontend URL
2. Click "Register"
3. Create an account
4. Login
5. Create a transaction
6. Check dashboard

---

## 📊 Database Migrations

Migrations run automatically on deployment! But if needed manually:

### View Migration Status
```bash
# SSH into Render shell (from dashboard)
npm run typeorm migration:show
```

### Run Migrations Manually
```bash
npm run migration:run
```

### Revert Migration
```bash
npm run migration:revert
```

---

## 🔍 Monitoring & Debugging

### View Logs
1. Go to Render Dashboard
2. Select your web service
3. Click **"Logs"** tab
4. View real-time logs

### Common Issues

#### Issue: Database Connection Failed
**Solution:**
- Verify DATABASE_URL is correct
- Check database is running (Render dashboard)
- Ensure database and web service in same region

#### Issue: Build Failed
**Solution:**
- Check build logs in Render
- Verify `package.json` scripts are correct
- Ensure all dependencies are listed

#### Issue: CORS Error
**Solution:**
- Update `FRONTEND_URL` environment variable
- Redeploy service
- Clear browser cache

#### Issue: 502 Bad Gateway
**Solution:**
- Check if service is running (Render dashboard)
- View logs for errors
- Verify PORT environment variable is 3000
- Check start command is correct

---

## 💰 Cost Breakdown

### Free Tier Includes:
- ✅ PostgreSQL Database (90 days, then $7/month)
- ✅ Web Service (750 hours/month)
- ✅ Auto-scaling
- ✅ SSL/HTTPS
- ✅ Continuous deployment
- ✅ Custom domains

### Note on Free Tier:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Perfect for development/testing
- Upgrade to paid plan for production use

---

## 🔄 Continuous Deployment

Render automatically deploys on every push to main:

```bash
# Make changes
git add .
git commit -m "feat: new feature"
git push origin main

# Render automatically:
# 1. Detects push
# 2. Builds new version
# 3. Runs tests (if configured)
# 4. Deploys
# 5. Notifies you
```

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Database connected and migrations run
- [ ] Environment variables configured
- [ ] API accessible (curl test)
- [ ] Frontend connected to backend
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads
- [ ] Transactions can be created
- [ ] CORS configured correctly
- [ ] Logs showing no errors

---

## 📈 Next Steps

1. **Custom Domain** (Optional)
   - Go to Render Dashboard → Your Service → Settings
   - Click "Custom Domain"
   - Add: `api.yourdomain.com`
   - Update DNS records as instructed

2. **Enable Monitoring**
   - Render provides basic metrics
   - Consider adding: Sentry, LogRocket, or DataDog

3. **Database Backups**
   - Render automatically backs up database
   - Download manual backups from dashboard

4. **Upgrade Plan** (When ready for production)
   - Starter: $7/month (no sleep, better performance)
   - Standard: $25/month (more resources)

---

## 🆘 Support

- **Render Docs:** https://render.com/docs
- **Community Forum:** https://community.render.com
- **GitHub Issues:** Create issue in your repo
- **Status Page:** https://status.render.com

---

## ✅ Success Indicators

Your deployment is successful when:

1. ✅ Render dashboard shows "Live" status (green)
2. ✅ Logs show: "FIMA backend running on..."
3. ✅ curl requests return proper responses
4. ✅ Frontend can register/login users
5. ✅ Dashboard loads with data
6. ✅ No CORS errors in browser console

---

## 🎉 Congratulations!

Your backend is now deployed and running on Render!

**Your API URL:** `https://finance-manager-api.onrender.com`

Next: Run the integration tests to verify everything works!

---

*Deployment Guide - Last Updated: October 9, 2025*

