# Quick Setup Guide

## Issue: "Failed to analyze climate risk"

This error typically means the backend server is not running or dependencies are not installed.

## Step 1: Install Python Dependencies

```bash
cd /Users/kevinshah/Desktop/patent-f
pip3 install -r requirements.txt
```

If you encounter permission errors, use:
```bash
pip3 install --user -r requirements.txt
```

## Step 2: Start the Backend Server

Open a terminal and run:

```bash
cd /Users/kevinshah/Desktop/patent-f/backend
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Keep this terminal window open** - the backend must be running for the frontend to work.

## Step 3: Start the Frontend (in a new terminal)

Open a **new terminal window** and run:

```bash
cd /Users/kevinshah/Desktop/patent-f/frontend
npm install
npm start
```

The frontend will open automatically in your browser at `http://localhost:3000`

## Troubleshooting

### Backend won't start
- Check that Python 3.8+ is installed: `python3 --version`
- Verify all files exist: `rf_base_model.pkl`, `climate_thresholds.json`, `district_encoding.json`
- Check for error messages in the terminal

### Frontend can't connect
- Ensure backend is running on port 8000
- Check browser console (F12) for detailed error messages
- Verify `http://localhost:8000` is accessible

### Port already in use
If port 8000 is busy, change it:
```bash
uvicorn main:app --reload --port 8001
```
Then update `frontend/src/App.js` line 10 to use port 8001.

