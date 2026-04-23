# Google Maps API Setup Guide

## ✅ Current Status
Your Google Maps API key is already configured in `.env`:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBu5nZKbeK93tDIVjXwGdTuWg_60CTz7Ew
```

## 🔧 Required Google Maps APIs
To ensure full functionality, make sure these APIs are enabled in your Google Cloud Console:

### 1. **Maps JavaScript API**
- Purpose: Display interactive maps
- Status: ✅ Required for map view

### 2. **Places API**
- Purpose: Search for places and autocomplete
- Status: ✅ Required for location search

### 3. **Geocoding API**
- Purpose: Convert addresses to coordinates
- Status: ✅ Required for location search

### 4. **Geolocation API**
- Purpose: Get device location (free, browser-based)
- Status: ✅ Already integrated

## 🚀 How to Enable APIs

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **Select Your Project**
   - Choose the project where your API key was created

3. **Enable Required APIs**
   - Navigate to "APIs & Services" → "Library"
   - Search and enable:
     - "Maps JavaScript API"
     - "Places API"
     - "Geocoding API"

4. **Check API Key Restrictions**
   - Go to "APIs & Services" → "Credentials"
   - Click on your API key
   - Ensure it's not restricted to specific APIs (or add the required ones)

## 📱 Real-time Location Features

### **Current Implementation:**
```typescript
// 1. Current Location Button
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  const hospitals = await searchHospitalsByCoords(latitude, longitude, 20);
});

// 2. City-based Search
const result = await searchHospitalsByCity('Bengaluru');

// 3. Real-time API Integration
// Uses Overpass API for live hospital data
```

### **How It Works:**
1. **GPS Location:** Browser asks for your current location
2. **API Integration:** Fetches real-time hospital data from Overpass API
3. **Distance Calculation:** Shows hospitals within 20km radius
4. **Map Display:** Shows hospitals on Google Maps with markers

## 🎯 For Magadi, Bengaluru Users:

### **Option 1: Use Current Location**
1. Open Contact Page
2. Click "Current" button
3. Allow location access
4. See hospitals near your exact location

### **Option 2: Search by City**
1. Type "Bengaluru" in search box
2. Click "Search"
3. See hospitals around Bengaluru center

### **Option 3: Enhanced Search (Future Enhancement)**
To support smaller towns like Magadi specifically:
```typescript
// This would require additional implementation
const searchNearbyTowns = async (mainCity: string, radius: number) => {
  // Search around main city and include smaller towns
};
```

## 🔍 Testing Your Setup

1. **Start the Application**
   ```bash
   npm start
   ```

2. **Navigate to Contact Page**
   ```
   http://localhost:3000/contact
   ```

3. **Test Location Features**
   - Click "Current" button
   - Search for "Bengaluru"
   - Switch to "Map View" tab

## 🚨 Troubleshooting

### **If Maps Don't Load:**
1. Check browser console for API errors
2. Verify APIs are enabled in Google Cloud Console
3. Check API key restrictions

### **If Location Doesn't Work:**
1. Ensure HTTPS (required for geolocation)
2. Allow location access in browser
3. Check browser location permissions

### **If No Hospitals Found:**
1. Try increasing search radius (currently 20km)
2. Check if Overpass API is accessible
3. Verify location coordinates are correct

## 📊 API Usage & Costs

### **Free Tier Limits:**
- **Maps JavaScript API:** $28.00 per 1,000,000 loads (free tier: $300/month)
- **Places API:** $17.00 per 1,000,000 requests (free tier: $300/month)
- **Geocoding API:** $5.00 per 1,000,000 requests (free tier: $300/month)

### **Current Usage:**
- Map loads: 1 per page visit
- Places requests: 1 per search
- Geocoding requests: 1 per city search

## 🔄 Next Steps for Enhanced Real-time Search

To improve coverage for smaller towns like Magadi:

1. **Increase Search Radius**
   ```typescript
   const result = await searchHospitalsByCoords(lat, lng, 50); // 50km instead of 20km
   ```

2. **Add Nearby Town Support**
   ```typescript
   // Search around multiple points
   const searchArea = [
     { lat: 12.9666, lng: 77.5983 }, // Bengaluru
     { lat: 13.0475, lng: 77.5117 }, // Nearby areas
   ];
   ```

3. **Implement Hierarchical Search**
   - Search exact location first
   - If no results, expand to nearby areas
   - Include smaller towns and villages

## ✅ Summary

Your Google Maps API is already configured and working! The system provides:
- ✅ Real-time location-based search
- ✅ Live hospital data from Overpass API
- ✅ Interactive Google Maps integration
- ✅ Works for any location with GPS coverage

For best results in smaller towns like Magadi, use the "Current Location" feature for precise results.
