# Troubleshooting 405 Error

## Error: "Request failed with status code 405"

A 405 error means "Method Not Allowed" - the server received the request but the HTTP method (GET/POST) is not allowed for that endpoint.

## Common Causes & Solutions

### 1. Wrong API URL

**Problem:** Frontend is pointing to wrong backend URL (e.g., deployed frontend trying to reach localhost)

**Solution:**
- Check `REACT_APP_API_URL` environment variable in Vercel
- If frontend is deployed, it should point to your deployed backend (Railway/Render URL)
- If testing locally, ensure it's `http://localhost:8000`

**Check:**
```javascript
// In browser console, check:
console.log(process.env.REACT_APP_API_URL);
```

### 2. Trailing Slash Issue

**Problem:** URL has double slashes or trailing slash

**Solution:** The code now normalizes URLs, but check:
- Should be: `http://localhost:8000/analyze`
- NOT: `http://localhost:8000/analyze/` (trailing slash)
- NOT: `http://localhost:8000//analyze` (double slash)

### 3. Backend Not Running

**Problem:** Backend server is not running or crashed

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000/

# Should return: {"message":"Rice Climate Risk Intelligence API"}

# If not, start backend:
cd backend
uvicorn main:app --reload --port 8000
```

### 4. CORS Preflight Issue

**Problem:** Browser sends OPTIONS request that fails

**Solution:** Backend already has CORS configured, but verify:
- Check browser Network tab for OPTIONS request
- Ensure CORS middleware is working

### 5. Deployed Frontend → Local Backend

**Problem:** Deployed Vercel app trying to reach `localhost:8000` (won't work)

**Solution:**
- Deploy backend to Railway/Render first
- Update Vercel environment variable `REACT_APP_API_URL` to deployed backend URL
- Redeploy frontend

## Debugging Steps

### Step 1: Check Browser Console

Open browser DevTools (F12) → Console tab:
- Look for the exact error message
- Check the request URL
- Check response status

### Step 2: Check Network Tab

Open DevTools → Network tab:
- Find the failed request
- Check:
  - Request URL
  - Request Method (should be POST)
  - Status Code (405)
  - Response body

### Step 3: Test Backend Directly

```bash
# Test root endpoint
curl http://localhost:8000/

# Test analyze endpoint
curl -X POST http://localhost:8000/analyze \
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

### Step 4: Check Environment Variables

**Local Development:**
- No `.env` file needed (defaults to `http://localhost:8000`)

**Vercel Deployment:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Ensure `REACT_APP_API_URL` is set to your deployed backend URL
- Format: `https://your-backend.railway.app` (no trailing slash)

### Step 5: Verify Backend Endpoint

The backend endpoint should be:
- **Path:** `/analyze`
- **Method:** POST
- **Content-Type:** `application/json`

Verify in browser:
- Visit: `http://localhost:8000/docs`
- You should see FastAPI Swagger UI
- Find `/analyze` endpoint
- Test it from there

## Quick Fixes

### Fix 1: Update API URL

If using deployed frontend:
1. Get your backend URL (Railway/Render)
2. Vercel Dashboard → Settings → Environment Variables
3. Update `REACT_APP_API_URL`
4. Redeploy

### Fix 2: Restart Backend

```bash
# Kill existing process
lsof -ti:8000 | xargs kill -9

# Restart
cd backend
uvicorn main:app --reload --port 8000
```

### Fix 3: Clear Browser Cache

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Or clear browser cache

## Still Not Working?

1. **Check backend logs:**
   ```bash
   # Look at terminal where backend is running
   # Check for any error messages
   ```

2. **Check frontend console:**
   - Open browser DevTools
   - Look for detailed error messages
   - The improved error handling should show the exact URL being called

3. **Verify file structure:**
   - Ensure `backend/main.py` has `@app.post("/analyze")`
   - Ensure model files are accessible

4. **Test with Postman/curl:**
   - If curl works but frontend doesn't, it's likely a CORS or URL issue
