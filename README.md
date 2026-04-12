# Vision Board App

A full-stack vision board with weekly goal tracking and data insights.

**Stack:** React + TypeScript · Python FastAPI · PostgreSQL

## Running locally

### Backend
cd backend
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm run dev