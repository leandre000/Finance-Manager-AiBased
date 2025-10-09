# 🔧 RENDER DATABASE SETUP - FIX "ENOTFOUND base" ERROR

## ❌ THE PROBLEM
```
Error: getaddrinfo ENOTFOUND base
```
**Cause:** `DATABASE_URL` environment variable is NOT set in Render.

---

## ✅ SOLUTION: Set Up PostgreSQL Database

You have **TWO OPTIONS**:

### **OPTION 1: Use Render's Managed PostgreSQL (RECOMMENDED)**

#### Step 1: Create PostgreSQL Database in Render

1. Go to **Render Dashboard**: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `finance-manager-db`
   - **Database:** `finance_manager`
   - **User:** `finance_user` (auto-generated)
   - **Region:** `Oregon (US West)` (same as your web service)
   - **Plan:** **Free**
4. Click **"Create Database"**

#### Step 2: Wait for Database to be Created
- Status will show **"Creating..."** then **"Available"**
- Takes about 1-2 minutes

#### Step 3: Copy the Internal Database URL

1. Click on your new database: `finance-manager-db`
2. Scroll down to **"Connections"** section
3. **IMPORTANT:** Copy the **"Internal Database URL"** (NOT External)
   - It looks like: `postgresql://finance_user:xxxxx@dpg-xxxxx/finance_manager`
   - Internal URL is faster and free (no bandwidth charges)

#### Step 4: Add DATABASE_URL to Your Web Service

1. Go back to **Dashboard** → Click **"finance-manager-api"** (your web service)
2. Click **"Environment"** in the left sidebar
3. Find the `DATABASE_URL` variable
4. Click **"Edit"** 
5. **Paste** the Internal Database URL you just copied
6. Click **"Save Changes"**

#### Step 5: Trigger Manual Deploy

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Or just wait - Render auto-deploys when you change environment variables

---

### **OPTION 2: Use Your Own PostgreSQL Server**

If you want to use your own PostgreSQL (username: postgres, password: leandre, port: 5434):

#### Requirements:
- Your PostgreSQL server MUST be publicly accessible (has a public IP/domain)
- Port 5434 MUST be open to the internet
- SSL should be enabled (or set `?sslmode=disable`)

#### Set DATABASE_URL:

1. Go to **Render Dashboard** → **"finance-manager-api"**
2. Click **"Environment"**
3. Edit `DATABASE_URL` and set it to:

```
postgresql://postgres:leandre@YOUR_PUBLIC_IP_OR_DOMAIN:5434/finance_manager?sslmode=disable
```

**Replace `YOUR_PUBLIC_IP_OR_DOMAIN` with:**
- Your public IP address (e.g., `123.45.67.89`)
- OR your domain name (e.g., `myserver.example.com`)

⚠️ **WARNING:** Exposing your local PostgreSQL to the internet is a **SECURITY RISK**. Use Render's managed database instead.

---

## 🚀 RECOMMENDED SETUP (STEP-BY-STEP)

### **Use Render PostgreSQL - Complete Process:**

1. **Create Database:**
   - Dashboard → New + → PostgreSQL
   - Name: `finance-manager-db`
   - Plan: Free
   - Region: Oregon
   - Click Create

2. **Wait for "Available" status** (1-2 min)

3. **Copy Internal Database URL:**
   - Click on `finance-manager-db`
   - Scroll to "Connections"
   - Copy "Internal Database URL"
   - Example: `postgresql://finance_user:abc123xyz@dpg-xxxxxxxxxxxxx-a/finance_manager`

4. **Set in Web Service:**
   - Dashboard → `finance-manager-api`
   - Environment tab
   - Edit `DATABASE_URL`
   - Paste the URL
   - Save Changes

5. **Deploy:**
   - Click "Manual Deploy" → "Deploy latest commit"
   - OR wait for auto-deploy (happens when env vars change)

6. **Watch Logs:**
   - Click "Logs" tab
   - Look for:
     - ✓ `npm install`
     - ✓ `tsc -p tsconfig.build.json`
     - ✓ `Running migrations...`
     - ✓ `Migration SeedDefaultCategories has been executed successfully`
     - ✓ `Migration SeedInitialUser has been executed successfully`
     - ✓ `Finance Manager API running on port 3000`

---

## 🎯 VERIFICATION

After setting DATABASE_URL, the build should succeed with:

```
✓ Build successful!
✓ Running migrations...
✓ query: SELECT * FROM current_schema()
✓ query: CREATE TABLE "migrations" (...)
✓ query: SELECT * FROM "migrations"
✓ Migration SeedDefaultCategories has been executed successfully
✓ Migration SeedInitialUser has been executed successfully
✓ All migrations executed successfully
✓ Finance Manager API running on port 3000
✓ Environment: production
```

---

## 📝 QUICK COPY-PASTE

### Environment Variables for Render (Already Set):
```
NODE_ENV=production
PORT=3000
JWT_SECRET=finance-manager-secret-key-2025-change-in-production
JWT_EXPIRATION=7d
FRONTEND_URL=https://frontend-lvqnp79qz-leandre000s-projects.vercel.app
```

### Environment Variables TO SET:
```
DATABASE_URL=<PASTE_YOUR_INTERNAL_DATABASE_URL_HERE>
```

---

## 🆘 TROUBLESHOOTING

### "ENOTFOUND base"
- **Cause:** DATABASE_URL not set
- **Fix:** Follow Option 1 above

### "Connection refused"
- **Cause:** Wrong database URL
- **Fix:** Use Internal Database URL (not External)

### "Password authentication failed"
- **Cause:** Copied wrong credentials
- **Fix:** Re-copy Internal Database URL from Render database page

### "SSL required"
- **Cause:** Using External URL or own server without SSL
- **Fix:** Use Internal URL OR add `?sslmode=disable` to URL

---

## ✅ NEXT STEPS AFTER DATABASE IS SET

Once the build succeeds:

1. **Test the API:**
   ```bash
   curl https://your-render-url.onrender.com/api
   ```

2. **Login as admin:**
   - Email: `Iamshemaleandre@gmail.com`
   - Password: `shema@1050!`

3. **Update Frontend:**
   - Set `VITE_API_URL` in Vercel to your Render URL

---

**🔗 HELPFUL LINKS:**

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs/databases
- PostgreSQL Connection: https://render.com/docs/postgresql

---

**⏱️ ESTIMATED TIME:** 5 minutes to set up database + 5 minutes for deploy = **10 minutes total**

