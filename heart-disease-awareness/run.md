# 🚀 Heart Disease Awareness - Run Commands

## 📋 Quick Start Commands

### **Start Both Servers**
```bash
# Start Backend (Terminal 1)
cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness-backend"
npm run dev

# Start Frontend (Terminal 2)  
cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness"
npm start
```

### **Kill All Node Processes**
```bash
# Kill all Node.js processes
taskkill /F /IM node.exe
```

### **Check Server Status**
```bash
# Check if backend is running (port 5000)
netstat -ano | findstr :5000

# Check if frontend is running (port 3000)
netstat -ano | findstr :3000
```

## 🔧 Common Issues & Solutions

### **❌ Backend Errors**
```
# Module not found error
npm install

# Port already in use
taskkill /F /IM node.exe
npm start

# TypeScript compilation errors
npx tsc
```

### **❌ Frontend Errors**
```
# Material-UI component errors
# Check ContactPage.tsx for Typography/Grid/TextField props
# Fix: Use slotProps instead of InputProps
# Fix: Use correct Grid item props

# Port conflicts
taskkill /F /IM node.exe
npm start
```

### **🎯 Access URLs**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000
- **Admin Portal:** http://localhost:3000/admin (use secret key: "5125")
- **Hospital Finder:** http://localhost:3000/contact (Find hospitals near you!)

### **🔑 Admin Secret Key**
- **Secret:** `5125`
- **Where to use:** Login/Register form - "Admin Secret Key" field
- **What it does:** Grants admin access to doctor verification system

### **📱 Material-UI Status**
- **Theme:** Red theme configured
- **Components:** All optimized for MUI v5.18
- **Hospital Finder:** Full geolocation support with 20+ Indian cardiology hospitals

---

## 🗺️ **NEW: Google Maps Hospital Finder**

### **What's New:**
- 🗺️ **Google Maps Integration** - Interactive map view with hospital locations
- 📍 **Enhanced Search** - City search with fallback geocoding
- 🚀 **Professional UI** - Dual list and map views
- 📊 **Better UX** - Embedded Google Maps embed API

### **Quick Setup:**
```bash
# 1. Install dependencies (if not already done)
cd heart-disease-awareness
npm install

# 2. Add Google Maps API Key to .env
# - Use demo key already in .env (limited)
# - Or get your own from: https://console.cloud.google.com

# 3. Start the app
npm start

# 4. Go to http://localhost:3000/contact
```

### **Features:**
✅ GPS search with distance calculation (accurate to km)
✅ 19 major Indian cities database
✅ Interactive Google Maps visualization
✅ Hospital markers and directions
✅ List and Map toggle views
✅ Real hospital database (20+ cardiology centers)
✅ Call, Email, Directions links
✅ Hospital details dialog
✅ Responsive mobile/tablet/desktop
✅ Emergency contact integration

### **API Key Setup (30 seconds):**
1. Go to https://console.cloud.google.com
2. Create project → Enable Maps JavaScript API
3. Create API Key in Credentials
4. Copy key to .env: `REACT_APP_GOOGLE_MAPS_API_KEY=your_key`
5. Restart npm start

### **Component Details:**
- **File:** `src/pages/ContactPageGMaps.tsx`
- **Database:** `src/data/hospitals-india.json`
- **Configuration:** `.env` (API key)
- **Documentation:** `GOOGLE_MAPS_HOSPITAL_FINDER.md`

---

## 🏥 Hospital Finder

### **Features:**
- ✅ Search hospitals by city name
- ✅ Use GPS to find nearest hospitals
- ✅ Distance calculation from your location
- ✅ Detailed hospital info (beds, doctors, facilities)
- ✅ Filter by specialties (Cardiology, Cardiac Surgery, etc.)
- ✅ Direct call, email, and directions
- ✅ 20+ top Indian cardiology hospitals in database
- ✅ Real-time distance sorting
- ✅ **NEW: Google Maps map view**
- ✅ **NEW: Embedded map visualization**

### **Supported Cities:**
Delhi, Mumbai, Bangalore, Hyderabad, Pune, Chennai, Kolkata, Gurgaon, Noida, Vellore, Indore, Jaipur, Lucknow, Dehradun, Coimbatore, Chandigarh, Kochi, Ahmedabad, Surat

---

## 🚀 One-Command Start (Recommended)
```bash
# Start both servers in parallel
cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness-backend" && npm run dev & cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness" && npm start
```

## 🔍 Troubleshooting Steps

1. **Check ports:** `netstat -ano | findstr :3000` and `netstat -ano | findstr :5000`
2. **Kill processes:** `taskkill /F /IM node.exe` 
3. **Clear cache:** `npm cache clean --force`
4. **Reinstall dependencies:** `npm install`
5. **Check logs:** Look for specific error messages in terminal

## 📞 Need Help?
- Check the error messages in your terminal
- Look for specific file names and line numbers in error output
- Run `npm run build` to check for TypeScript errors
- Make sure you're in the correct directory for each project

---

**💡 Tip:** The ContactPageSimple.tsx uses Material-UI correctly. If you have compilation errors, the original ContactPage.tsx has complex prop issues.
