#!/bin/bash
# Start the FastAPI backend server

cd "$(dirname "$0")/backend"
uvicorn main:app --reload --port 8000

