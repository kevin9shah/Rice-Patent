# Vercel Frontend Setup with Railway Backend

## ✅ Your Backend is Deployed!

**Backend URL:** `https://rice-patent-production.up.railway.app`

The backend is working correctly and responding to requests.

## Frontend Configuration

### Option 1: Set Environment Variable in Vercel (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to **Settings** → **Environment Variables**

2. **Add/Update Environment Variable:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://rice-patent-production.up.railway.app`
   - **Environment:** Production, Preview, Development (select all)

3. **Redeploy:**
   - Go to **Deployments** tab
   - Click the three dots on latest deployment
   - Select **Redeploy**

### Option 2: Use Code Default (Already Updated)

The code has been updated to automatically use the Railway backend in production:
- **Production:** Uses `https://rice-patent-production.up.railway.app`
- **Local Development:** Uses `http://localhost:8000`

Just rebuild and redeploy your frontend.

## Testing

### Test Backend:
```bash
curl https://rice-patent-production.up.railway.app/
# Should return: {"message":"Rice Climate Risk Intelligence API"}
```

### Test Frontend:
1. Visit your Vercel URL
2. Open browser DevTools (F12)
3. Check Console for any errors
4. Try using the dashboard - it should connect to Railway backend

## CORS Configuration (Optional)

If you want to restrict CORS to only your Vercel domain:

1. **In Railway Dashboard:**
   - Go to your project
   - Settings → Variables
   - Add: `CORS_ORIGINS` = `https://your-app.vercel.app`

2. **Or leave as is** - Currently allows all origins (`*`)

## Current Status

✅ Backend: `https://rice-patent-production.up.railway.app` (Working)  
⏳ Frontend: Update environment variable in Vercel

## Quick Checklist

- [ ] Backend deployed and working ✅
- [ ] Set `REACT_APP_API_URL` in Vercel
- [ ] Redeploy frontend
- [ ] Test the dashboard
- [ ] Verify API calls work

## Troubleshooting

### Still getting 405 error?
- Check that `REACT_APP_API_URL` is set correctly in Vercel
- Ensure it's `https://rice-patent-production.up.railway.app` (with https, no trailing slash)
- Redeploy after setting the variable

### CORS errors?
- Backend already allows all origins
- If you want to restrict, set `CORS_ORIGINS` in Railway

### Connection refused?
- Make sure you're using the Railway URL, not localhost
- Check that backend is running (Railway shows status)
