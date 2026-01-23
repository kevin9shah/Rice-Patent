# Backend Deployment Guide

## Quick Deploy to Railway (Recommended - Easiest)

### Step 1: Prepare Your Repository

Make sure these files are in your repository:
- `rf_base_model.pkl` (in root directory)
- `climate_thresholds.json` (in root directory)
- `district_encoding.json` (in root directory)
- `backend/main.py`
- `backend/requirements.txt` (or `requirements.txt` in root)
- `backend/railway.json`

### Step 2: Deploy to Railway

**Option A: Via Railway Dashboard (Easiest)**

1. **Go to [railway.app](https://railway.app)** and sign in with GitHub

2. **Click "New Project" → "Deploy from GitHub repo"**

3. **Select your repository**

4. **Configure the service:**
   - Railway will auto-detect Python
   - **Root Directory:** Leave empty (or set to project root)
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Or Railway will use the `railway.json` config automatically

5. **Add Environment Variables (if needed):**
   - `CORS_ORIGINS` = `https://your-frontend.vercel.app` (optional, for security)

6. **Deploy** - Railway will automatically:
   - Install dependencies from `requirements.txt`
   - Start the server

7. **Get your Railway URL:**
   - Go to Settings → Networking
   - Copy the generated domain (e.g., `https://your-app.railway.app`)

### Step 3: Update Frontend

1. Go to your Vercel project
2. Settings → Environment Variables
3. Update `REACT_APP_API_URL` to your Railway URL
4. Redeploy

---

## Alternative: Deploy to Render

### Step 1: Prepare

1. Make sure `backend/Procfile` exists (already created)
2. Ensure all model files are in the repository

### Step 2: Deploy

1. **Go to [render.com](https://render.com)** and sign in

2. **New → Web Service**

3. **Connect GitHub repository**

4. **Configure:**
   - **Name:** rice-climate-risk-api
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory:** (leave empty)

5. **Add Environment Variables:**
   - `CORS_ORIGINS` = `https://your-frontend.vercel.app` (optional)

6. **Deploy**

7. **Get your Render URL** (e.g., `https://your-app.onrender.com`)

---

## Alternative: Deploy to Fly.io

### Step 1: Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login

```bash
fly auth login
```

### Step 3: Initialize

```bash
cd backend
fly launch
```

Follow prompts:
- App name: (choose one)
- Region: (choose closest)
- PostgreSQL: No
- Redis: No

### Step 4: Create fly.toml

Create `backend/fly.toml`:

```toml
app = "your-app-name"
primary_region = "iad"

[build]

[http_service]
  internal_port = 8000
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0
  processes = ["app"]

[[services]]
  http_checks = []
  internal_port = 8000
  processes = ["app"]
  protocol = "tcp"
  script_checks = []
```

### Step 5: Deploy

```bash
fly deploy
```

---

## File Structure for Deployment

Your repository should look like this:

```
patent-f/
├── rf_base_model.pkl          ← Model file (must be in repo)
├── climate_thresholds.json     ← Config file (must be in repo)
├── district_encoding.json      ← Config file (must be in repo)
├── requirements.txt            ← Python dependencies
├── backend/
│   ├── main.py                 ← Backend code
│   ├── railway.json            ← Railway config
│   ├── Procfile                ← Render/Heroku config
│   └── runtime.txt             ← Python version
└── frontend/
    └── ...
```

**Important:** The backend code looks for model files in the parent directory (`Path(__file__).parent.parent`), so they must be in the repository root.

---

## Troubleshooting

### Model file not found
- Ensure `rf_base_model.pkl`, `climate_thresholds.json`, and `district_encoding.json` are committed to Git
- Check that they're in the repository root (not in backend/)

### Port binding error
- Make sure start command uses `$PORT` environment variable
- Railway/Render provide this automatically

### CORS errors
- Add your Vercel domain to `CORS_ORIGINS` environment variable
- Or update `backend/main.py` to allow your domain

### Dependencies not installing
- Check `requirements.txt` is in the correct location
- Railway looks in root, Render uses the build command path

---

## Quick Railway CLI Deployment

If you prefer CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize (in project root)
railway init

# Link to existing project or create new
railway link

# Deploy
railway up
```

---

## Testing Your Deployment

1. **Check backend is running:**
   ```bash
   curl https://your-backend-url.com/
   ```
   Should return: `{"message":"Rice Climate Risk Intelligence API"}`

2. **Test analyze endpoint:**
   ```bash
   curl -X POST https://your-backend-url.com/analyze \
     -H "Content-Type: application/json" \
     -d '{
       "avg_temperature": 24.0,
       "avg_humidity": 77.0,
       "rainfall": 30.0,
       "sunshine_duration": 5.0,
       "harvested_area_ha": 2000.0,
       "year": 2024,
       "district": "Ampelgading"
     }'
   ```

3. **Update frontend** with the new backend URL

---

## Recommended: Railway

Railway is recommended because:
- ✅ Free tier available
- ✅ Auto-detects Python
- ✅ Easy GitHub integration
- ✅ Automatic HTTPS
- ✅ Good for ML models (no size limits like Vercel)
- ✅ Simple configuration
