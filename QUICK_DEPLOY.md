# Quick Vercel Deployment Guide

## Step 1: Deploy Frontend to Vercel

### Via Vercel Dashboard (Easiest)

1. **Push your code to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

3. **Click "Add New Project"**

4. **Import your repository**

5. **Configure Project:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `build` (auto-filled)

6. **Add Environment Variable:**
   - Key: `REACT_APP_API_URL`
   - Value: `http://localhost:8000` (for now, update after backend deployment)

7. **Click Deploy**

8. **Wait for deployment** (takes 2-3 minutes)

### Via Vercel CLI

```bash
cd frontend
npm i -g vercel
vercel
# Follow prompts
# Set environment variable: REACT_APP_API_URL
```

## Step 2: Deploy Backend to Railway (Recommended)

Railway is perfect for Python backends with ML models.

### Quick Setup:

1. **Go to [railway.app](https://railway.app)** and sign in with GitHub

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**

4. **Configure:**
   - Railway will auto-detect Python
   - Make sure model files (`rf_base_model.pkl`, `climate_thresholds.json`, `district_encoding.json`) are in the repo root
   - The `railway.json` file will configure the deployment

5. **Get your Railway URL** (e.g., `https://your-app.railway.app`)

6. **Update Vercel Environment Variable:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your Railway URL: `https://your-app.railway.app`
   - Redeploy (or it will auto-redeploy)

## Alternative: Deploy Backend to Render

1. **Go to [render.com](https://render.com)** and sign in

2. **New → Web Service**

3. **Connect GitHub repository**

4. **Settings:**
   - **Name:** rice-climate-risk-api
   - **Environment:** Python 3
   - **Build Command:** `cd backend && pip install -r ../requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** (leave empty, or set to `backend`)

5. **Deploy**

6. **Get your Render URL** and update Vercel environment variable

## Step 3: Update CORS (Optional but Recommended)

For production security, update backend CORS to only allow your Vercel domain:

1. **In Railway/Render**, add environment variable:
   - Key: `CORS_ORIGINS`
   - Value: `https://your-app.vercel.app`

2. **Or manually edit** `backend/main.py` line 16:
   ```python
   allow_origins=["https://your-app.vercel.app"]
   ```

## Testing

1. **Frontend:** Visit `https://your-app.vercel.app`
2. **Backend:** Test `https://your-backend-url.com/` (should show API message)
3. **Full Test:** Use the dashboard - it should connect to your backend

## Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` in Vercel environment variables
- Ensure backend is running and accessible
- Check browser console for CORS errors

### Backend deployment fails
- Ensure all model files are in the repository
- Check Railway/Render logs for errors
- Verify Python version compatibility

### Model loading errors
- Ensure `joblib` is in requirements.txt
- Check that model file path is correct (relative to backend/)

## File Structure for Deployment

```
patent-f/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── railway.json (or Procfile for Render)
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── ...
├── rf_base_model.pkl (must be accessible to backend)
├── climate_thresholds.json
└── district_encoding.json
```

**Important:** Model files must be in the repository root or accessible to the backend at runtime.

