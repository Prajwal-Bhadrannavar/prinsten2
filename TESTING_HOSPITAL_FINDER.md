# 🧪 Hospital Finder - Quick Test Guide

## 🚀 Quick Start

1. **Start Backend:**
```bash
cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness-backend"
npm run dev
```

2. **Start Frontend (in new terminal):**
```bash
cd "d:\MY PROJECTS\ai-agents\prinsten\heart-disease-awareness"
npm start
```

3. **Open Browser:**
```
http://localhost:3000/contact
```

---

## 🧪 Test Scenarios

### **Test 1: City Search (No Location Permission)**
1. Go to /contact
2. Type "Delhi" in search box
3. Click "Search"
4. **Expected:** 5-6 hospitals near Delhi appear, sorted by distance

**Test Cities:**
- Delhi ✅
- Mumbai ✅
- Bangalore ✅
- Hyderabad ✅
- Pune ✅
- Chennai ✅

---

### **Test 2: GPS Location**
1. Go to /contact
2. Click "Use GPS" button
3. **Browser prompt:** "Allow location?" → Click "Allow"
4. **Expected:** Hospitals sorted by actual distance from your location

**Note:** Geolocation works best on:
- Real devices with GPS
- Chrome DevTools (Sensors: Coordinates)
- HTTPS websites (not localhost)

---

### **Test 3: View Hospital Details**
1. Search for any city
2. Hospitals appear
3. Click "Details" on any card
4. **Expected:** Modal opens showing:
   - Full address
   - Phone & email
   - Bed count & doctor count
   - Hour of operation
   - Facilities available

---

### **Test 4: Call Hospital**
1. Search for any city
2. Click hospital phone number (starts with +91)
3. **Expected:** Phone dial dialog opens (or call initiates on mobile)

---

### **Test 5: Email Hospital**
1. Search for any city
2. Click email icon (✉️)
3. **Expected:** Email client opens with hospital email

---

### **Test 6: Get Directions**
1. Search for any city
2. Click "Directions" button
3. **Expected:** Google Maps opens with:
   - Your location (if allowed)
   - Hospital location
   - Route between them

---

### **Test 7: Responsive Design**
1. Open /contact on desktop (1920px)
2. **Expected:** 3 hospitals per row
3. Resize to tablet (768px)
4. **Expected:** 2 hospitals per row
5. Resize to mobile (375px)
6. **Expected:** 1 hospital per row

---

### **Test 8: Emergency Contact Banner**
1. Scroll to bottom of /contact page
2. **Expected:** Red banner with:
   - "Call 112 (General Emergency) or 108 (Medical Emergency)"

---

## 📊 Test Data

### **Sample Hospitals Included**

| Hospital | City | Distance (from Delhi) |
|----------|------|----------------------|
| AIIMS Delhi | Delhi | ~2.5 km |
| Fortis Escorts | Delhi | ~3.2 km |
| Max Healthcare | Delhi | ~4.1 km |
| Apollo Hospitals | Delhi | ~5.8 km |
| Sir Ganga Ram | Delhi | ~2.8 km |
| Cleveland Clinic | Pune | ~1,372 km |
| Kokilaben Hospital | Mumbai | ~1,392 km |
| Christian Medical College | Vellore | ~1,626 km |
| Manipal Hospitals | Bangalore | ~2,074 km |

---

## ✅ Features to Verify

- [ ] City search returns correct hospitals
- [ ] Distances calculated correctly
- [ ] Hospitals sorted by nearest first
- [ ] Dialog opens/closes smoothly
- [ ] All action buttons work
- [ ] Responsive layout working
- [ ] No console errors
- [ ] No loading state issues
- [ ] Emergency banner displayed
- [ ] All links functional

---

## 🐛 Common Issues & Solutions

### **Issue 1: GPS Permission Denied**
**Solution:**
- Click "Use GPS"
- Browser asks permission
- Click "Allow"
- Page refreshes with location data

### **Issue 2: "City not found" error**
**Solution:**
- Only major Indian cities supported
- Try: "Delhi", "Mumbai", "Bangalore"
- Not available: "Goa", "Chandigarh", "Shimla" (yet)

### **Issue 3: DevTools geolocation not working**
**Solution:**
1. Open DevTools (F12)
2. Click ⋮ menu → More tools → Sensors
3. Sensors tab → Location
4. Choose preset city or enter coordinates
5. Reload page
6. Click "Use GPS"

### **Issue 4: Empty hospitals list**
**Solution:**
- Make sure you've typed a city name correctly
- Check browser console for errors (F12 → Console)
- Verify hospitals-india.json is loaded

---

## 📱 Desktop Testing Tips

### **Using Chrome DevTools for Mobile Testing:**

1. Open Chrome DevTools (F12)
2. Click Device Toolbar icon (top-left)
3. Choose device:
   - iPhone 12 (375px)
   - iPad (768px)
   - Desktop (1920px)

### **Testing GPS in DevTools:**
1. Open DevTools
2. Click ⋮ menu → More tools → Sensors
3. Set location to specific coordinates
4. Reload page
5. Click "Use GPS"

---

## 🔍 Debugging Tips

### **Check if data loads:**
```
Open DevTools Console (F12)
hospitals-india.json should load
No 404 errors should appear
```

### **Verify distance calculation:**
```
Search "Delhi"
Check console: distances should be calculated
All numbers should be positive
Should be sorted ascending (nearest first)
```

### **Check API calls:**
```
DevTools → Network tab
Search for hospital
Should see hospitals-india.json request
Status: 200 OK
```

---

## 📈 Performance Metrics

**Expected Performance:**
- Page load: < 2 seconds
- Search response: < 1 second
- Dialog open: < 300ms
- Location calculation: < 200ms

---

## 🎯 Test Completion Checklist

- [ ] All 19+ supported cities work
- [ ] GPS detection works correctly
- [ ] Distance calculations are accurate
- [ ] Hospital cards display all info
- [ ] Action buttons functional
- [ ] Dialog shows detailed info
- [ ] Emergency banner visible
- [ ] No console errors
- [ ] Mobile responsive (375px, 768px, 1920px)
- [ ] Links open in correct app/browser

---

## 📞 Need Help?

If you encounter issues:

1. **Check run.md** - Common errors & solutions
2. **Check console** - DevTools (F12 → Console)
3. **Check network** - DevTools (F12 → Network)
4. **Restart servers** - Kill and restart npm start
5. **Clear cache** - Ctrl+Shift+Delete in browser

---

**Happy Testing! 🚀**
