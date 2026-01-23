# Deploy Backend Now - Step by Step

## 🚀 Quick Railway Deployment (5 minutes)

### Step 1: Push to GitHub (if not already)

```bash
cd /Users/kevinshah/Desktop/patent-f
git init  # if not already a git repo
git add .
git commit -m "Ready for deployment"
git remote add origin <your-github-repo-url>  # if not already added
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to [railway.app](https://railway.app)**
   - Sign in with GitHub

2. **Click "New Project"**

3. **Select "Deploy from GitHub repo"**

4. **Choose your repository** (`patent-f`)

5. **Railway will auto-detect:**
   - ✅ Python project
   - ✅ Dependencies from `requirements.txt`
   - ✅ Configuration from `railway.json`

6. **Configure (if needed):**
   - **Root Directory:** Leave empty (project root)
   - Railway will use the start command from `railway.json`: 
     `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

7. **Add Environment Variable (Optional but Recommended):**
   - Click on your service → Variables
   - Add: `CORS_ORIGINS` = `https://your-frontend.vercel.app`
   - (You can add this later after getting your Vercel URL)

8. **Deploy!**
   - Railway will automatically:
     - Install Python dependencies
     - Start the server
     - Generate a public URL

9. **Get Your Backend URL:**
   - Click on your service
   - Go to "Settings" → "Networking"
   - Copy the generated domain (e.g., `https://your-app.up.railway.app`)

### Step 3: Test Your Backend

Open in browser or use curl:
```bash
curl https://your-app.up.railway.app/
```

Should return: `{"message":"Rice Climate Risk Intelligence API"}`

### Step 4: Update Frontend

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Update `REACT_APP_API_URL` to your Railway URL
4. Redeploy (or it auto-redeploys)

---

## 📋 What Railway Needs

✅ **Already in your repo:**
- `requirements.txt` (Python dependencies)
- `railway.json` (Railway configuration)
- `backend/main.py` (Backend code)
- `rf_base_model.pkl` (Model file - 1.7MB)
- `climate_thresholds.json` (Config)
- `district_encoding.json` (Config)

✅ **Railway will:**
- Auto-detect Python
- Install dependencies
- Run the start command
- Provide HTTPS URL

---

## 🔧 Alternative: Render.com

If Railway doesn't work, try Render:

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Name:** rice-climate-risk-api
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend URL is accessible
- [ ] `/` endpoint returns API message
- [ ] `/analyze` endpoint works (test with curl or Postman)
- [ ] Frontend environment variable updated
- [ ] Frontend can connect to backend
- [ ] CORS is working (no CORS errors in browser console)

---

## 🆘 Troubleshooting

**"Model file not found"**
- Ensure `rf_base_model.pkl` is committed to Git
- Check it's in the repository root (not in backend/)

**"Port binding error"**
- Railway provides `$PORT` automatically
- Start command should use `--port $PORT`

**"Dependencies not installing"**
- Check `requirements.txt` is in root directory
- Railway installs from root by default

**"CORS errors"**
- Add your Vercel domain to Railway environment variables: `CORS_ORIGINS`
- Or update `backend/main.py` line 16 to allow your domain

---

## 🎉 You're Done!

Once deployed:
1. Backend: `https://your-app.up.railway.app`
2. Frontend: `https://your-app.vercel.app`
3. Both connected and working!
