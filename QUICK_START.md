# Quick Start (Updated)

## Run Latest Changes

Use two terminals and restart both apps so new code is loaded.

```bash
# Terminal 1 - Backend
cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness-backend"
npm install
npm run build
npm start
```

```bash
# Terminal 2 - Frontend
cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness"
npm install
npm start
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/assessment`
- `http://localhost:3000/contact`
- `http://localhost:3000/forgot-password`

## If Changes Are Not Showing

1. Stop old running servers (`Ctrl + C` in backend/frontend terminals).
2. Start backend again from `heart-disease-awareness-backend`.
3. Start frontend again from `heart-disease-awareness`.
4. Hard refresh browser (`Ctrl + F5`).

## Required Environment Variables

### Backend (`heart-disease-awareness-backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/heart-disease-awareness
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:3000
ADMIN_EMAIL=admin@heartdisease.com
ADMIN_PASSWORD=Admin@2024!Secure
ADMIN_NAME=System Administrator
# Optional for real email delivery (forgot password):
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Heart Awareness <your_email@gmail.com>
```

### Frontend (`heart-disease-awareness/.env`)

```env
REACT_APP_API_URL=http://localhost:5000/api
# Optional: if omitted, app now uses OpenStreetMap fallback in map tab
REACT_APP_GOOGLE_MAPS_API_KEY=
```

## Assessment Notes

- Assessment now supports the new multi-option model.
- It is backward-compatible with old yes/no question format.
- If assessment still fails, backend is likely still running an old process. Restart backend.

## Map Notes (No API Key Mode)

- If `REACT_APP_GOOGLE_MAPS_API_KEY` is missing or invalid, the app now shows an OpenStreetMap fallback in Map View.
- You can still click Directions to open external maps.

## Quick Health Checks

Backend checks:

```bash
cd "d:\MY PROJECTS\ai-agents\prinsten"
node test-all-routes.js
node test-assessment.js
```

Forgot/reset checks:

```bash
node test-forgot.js
node test-reset.js
```

Frontend checks:

1. Visit `/assessment` and complete all questions.
2. Visit `/contact` -> `Map View` should render Google Maps (if key works) or OpenStreetMap fallback.
3. Visit `/forgot-password` and test reset flow.
