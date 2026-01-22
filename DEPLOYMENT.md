# Deployment Guide

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy:
```bash
vercel
```

4. Set environment variable:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com`

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory to `frontend`
5. Add environment variable: `REACT_APP_API_URL` = `https://your-backend-url.com`
6. Deploy

## Backend Deployment Options

Vercel serverless functions have size limitations (50MB), so the ML model won't fit. Deploy the backend separately:

### Option A: Railway (Recommended - Easy & Free Tier)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables (if needed)
6. Railway will auto-detect Python and install dependencies

**Note:** Upload model files to Railway or use a cloud storage service.

### Option B: Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Environment: Python 3

### Option C: Fly.io

1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. In `backend/` directory, run: `fly launch`
3. Follow prompts
4. Deploy: `fly deploy`

### Option D: PythonAnywhere / Heroku

Traditional hosting platforms also work.

## Quick Setup for Railway (Recommended)

1. **Install Railway CLI:**
```bash
npm i -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Initialize project:**
```bash
cd backend
railway init
```

4. **Deploy:**
```bash
railway up
```

5. **Get your backend URL** (e.g., `https://your-app.railway.app`)

6. **Update frontend environment variable** in Vercel:
   - `REACT_APP_API_URL` = `https://your-app.railway.app`

## Environment Variables

### Frontend (Vercel)
- `REACT_APP_API_URL` - Backend API URL

### Backend (Railway/Render/etc.)
- No special env vars needed (model files should be in the repo or uploaded)

## Important Notes

1. **Model Files**: Ensure `rf_base_model.pkl`, `climate_thresholds.json`, and `district_encoding.json` are in your repository or uploaded to your backend hosting service.

2. **CORS**: The backend already has CORS enabled for all origins. For production, you may want to restrict it to your Vercel domain:
   ```python
   allow_origins=["https://your-app.vercel.app"]
   ```

3. **File Paths**: The backend uses relative paths, so it should work on most platforms.

4. **Build Settings**: 
   - Frontend build command: `npm run build`
   - Backend: No build needed, just install dependencies and run

## Testing Deployment

After deployment:
1. Frontend: `https://your-app.vercel.app`
2. Backend: `https://your-backend-url.com`
3. Test the `/analyze` endpoint from the frontend

