# ⚡ Quick Setup Guide - Google Maps Hospital Finder

## 5-Minute Setup

### 1. Install Dependencies
```bash
cd heart-disease-awareness
npm install
```

### 2. Get Google Maps API Key
**Option A: Fast (Demo Key - Limited)**
- Use the demo key already in `.env`
- Good for local testing only

**Option B: Production (30 seconds)**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → Enable billing
3. Search for "Maps JavaScript API" → Enable it
4. Go to Credentials → Create API Key
5. Copy the key and update `.env`:
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
   ```

### 3. Run Development Server
```bash
npm start
```
Opens at `http://localhost:3000`

### 4. Test the Feature
1. Navigate to **Contact** page
2. Click **GPS** button or enter a city (Delhi, Mumbai, Bangalore, etc.)
3. View hospitals in list or map view

---

## Directory Structure
```
heart-disease-awareness/
├── src/
│   ├── pages/
│   │   └── ContactPageGMaps.tsx    ← NEW COMPONENT
│   ├── data/
│   │   └── hospitals-india.json    ← Hospital database
│   └── App.tsx                     ← Routes config
├── .env                           ← API key config
├── .env.example                   ← Setup template
└── package.json                   ← Dependencies
```

---

## Features
✅ **GPS Search** - Find hospitals near you
✅ **City Search** - Search by location name (19 cities)
✅ **Distance Calculation** - Shows distance from user
✅ **Google Maps** - View on interactive map
✅ **Hospital Details** - Full information dialog
✅ **Call/Email** - Direct contact links
✅ **Directions** - Google Maps directions link
✅ **Responsive** - Works on mobile, tablet, desktop

---

## City Support
Delhi, Mumbai, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Gurgaon, Noida, Vellore, Indore, Jaipur, Lucknow, Dehradun, Coimbatore, Chandigarh, Kochi, Ahmedabad, Surat

---

## Troubleshooting

### "Google Maps API error"
→ Check `.env` file has valid `REACT_APP_GOOGLE_MAPS_API_KEY`

### "Geolocation not supported"
→ Use city search instead (GPS fallback)

### "Hospital not showing"
→ Verify coordinates in `hospitals-india.json`

### "Build warnings"
→ Run `npm run build` to verify (warnings are safe)

---

## Build & Deploy

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
# Output: build/ folder (ready for deployment)
```

### Deployment
```bash
# With Netlify CLI
netlify deploy --prod --dir=build

# Or with serve (local testing)
npm install -g serve
serve -s build
```

---

## Files Modified
- ✅ `.env` - Added API key
- ✅ `.env.example` - Added setup template
- ✅ `src/App.tsx` - Updated import
- ✅ `package.json` - Added @react-google-maps/api

## Files Created
- ✅ `src/pages/ContactPageGMaps.tsx` - Main component
- ✅ `GOOGLE_MAPS_HOSPITAL_FINDER.md` - Full documentation

---

## Support
See full documentation in `GOOGLE_MAPS_HOSPITAL_FINDER.md`
