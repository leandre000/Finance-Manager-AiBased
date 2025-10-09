# 🚀 VERCEL SETUP - 2 MINUTE GUIDE

## ⚡ Quick Setup (Option A - Takes 2 Minutes)

### Step 1: Go to Vercel Dashboard
**URL:** https://vercel.com/dashboard

### Step 2: Find Your Project
- Look for: `frontend-lvqnp79qz-leandre000s-projects`
- Click on it

### Step 3: Go to Settings
- Click **"Settings"** tab (top navigation)

### Step 4: Environment Variables
- Click **"Environment Variables"** (left sidebar)

### Step 5: Add VITE_API_URL
1. Click **"Add New"** button
2. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://finance-manager-aibased.onrender.com`
   - **Environment:** Select all (Production, Preview, Development)
3. Click **"Save"**

### Step 6: Redeploy
- Go to **"Deployments"** tab
- Click on the latest deployment
- Click **"Redeploy"** button
- OR: Vercel will auto-redeploy on next push

---

## ✅ Verification

After redeployment (2-3 minutes):

1. Open: https://frontend-lvqnp79qz-leandre000s-projects.vercel.app
2. Try to login or register
3. Check browser console - API calls should go to Render backend
4. Success! ✅

---

## 🔍 What This Does

**Before:**
```javascript
API calls → http://localhost:3000/api (fails in production)
```

**After:**
```javascript
API calls → https://finance-manager-aibased.onrender.com/api (works!)
```

---

## 📝 Alternative: Already Works!

The code is already configured to use the environment variable:

```typescript
// frontend/src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

So once you set `VITE_API_URL` in Vercel, everything will work automatically!

---

**Total Time: 2 minutes** ⏱️

