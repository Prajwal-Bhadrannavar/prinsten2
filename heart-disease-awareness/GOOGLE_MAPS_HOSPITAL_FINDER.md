# 🏥 Google Maps Hospital Finder - Complete Feature Guide

## Overview
The Hospital Finder with Google Maps API is a professional location-based search system that helps users find cardiology hospitals across India using:
- **GPS-based search** (current location detection)
- **City-based search** (19 major cities)
- **Interactive Google Maps** visualization
- **Distance calculation** (Haversine formula)
- **Real hospital database** (20+ cardiology hospitals)

---

## Features Implemented

### 1. **Dual Search Methods**
| Feature | Details |
|---------|---------|
| **GPS Search** | Uses browser Geolocation API to find hospitals near user's current location |
| **City Search** | Fallback geocoding with 19 pre-configured city coordinates |
| **Google Maps Embed** | Interactive map visualization for selected hospitals |

### 2. **Hospital Information Display**
- Hospital name, location, contact details
- Distance from user/search location
- Rating system (1-5 stars)
- Operating hours
- Bed count
- Doctor count
- Available specialties (Cardiology, Cardiothoracic Surgery, etc.)
- Facilities (Cath Lab, Echo Lab, Emergency)

### 3. **Action Buttons**
- 📍 **Directions**: Google Maps directions with optional start point
- 📋 **Details**: Full hospital information dialog
- 📞 **Call**: Direct phone call link
- 📧 **Email**: Direct email link
- 🗺️ **View on Maps**: Open hospital on Google Maps

### 4. **Responsive Design**
- Mobile (375px): Optimized card layout
- Tablet (768px): 2-column grid
- Desktop (1920px): 3-column grid
- Touch-friendly buttons and icons

### 5. **Two View Modes**
- **List View**: Detailed hospital cards with all information
- **Map View**: Google Maps embedded with hospital location preview

---

## Technical Implementation

### Files Created/Modified

1. **[src/pages/ContactPageGMaps.tsx](src/pages/ContactPageGMaps.tsx)** (NEW)
   - Main component (850+ lines)
   - Material-UI components for professional UI
   - Haversine distance formula
   - Fallback city geocoding
   - Google Maps embed integration

2. **[src/App.tsx](src/App.tsx)** (MODIFIED)
   - Updated import: `ContactPageFixed-New` → `ContactPageGMaps`
   - Route `/contact` now uses new component

3. **[.env](.env)** (NEW)
   - Google Maps API key configuration
   - API endpoint URL

4. **[.env.example](.env.example)** (NEW)
   - Setup instructions
   - API key acquisition guide

5. **[src/data/hospitals-india.json](src/data/hospitals-india.json)** (EXISTING)
   - 20+ hospitals with coordinates
   - Used by both components

### Dependencies
```json
{
  "@react-google-maps/api": "^2.20.0",
  "@mui/material": "^5.18.0",
  "@mui/icons-material": "^5.x.x",
  "react": "^19.0.0",
  "typescript": "^5.x.x"
}
```

---

## API Integration Points

### 1. **Google Maps JavaScript API**
```javascript
// Loaded in component initialization
https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places,geometry
```

### 2. **Google Maps Embed API**
```javascript
// Used for map visualization
https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=lat,lng
```

### 3. **Distance Calculation Algorithm**
```typescript
const calculateDistance = (lat1, lng1, lat2, lng2): number => {
  const R = 6371; // Earth radius in km
  // Haversine formula implementation
}
```

---

## City Coverage

### Supported Cities (19)
| City | State | Latitude | Longitude |
|------|-------|----------|-----------|
| Delhi | Delhi | 28.7041 | 77.1025 |
| New Delhi | Delhi | 28.6139 | 77.209 |
| Mumbai | Maharashtra | 19.076 | 72.8777 |
| Bangalore | Karnataka | 12.9716 | 77.5946 |
| Hyderabad | Telangana | 17.385 | 78.4867 |
| Pune | Maharashtra | 18.5204 | 73.8567 |
| Chennai | Tamil Nadu | 13.0827 | 80.2707 |
| Kolkata | West Bengal | 22.5726 | 88.3639 |
| Gurgaon | Haryana | 28.4595 | 77.0589 |
| Noida | Uttar Pradesh | 28.5355 | 77.3911 |
| Vellore | Tamil Nadu | 12.9352 | 79.1304 |
| Indore | Madhya Pradesh | 22.7196 | 75.8577 |
| Jaipur | Rajasthan | 26.9124 | 75.7873 |
| Lucknow | Uttar Pradesh | 26.8467 | 80.9462 |
| Dehradun | Uttarakhand | 30.1988 | 78.1018 |
| Coimbatore | Tamil Nadu | 11.0066 | 76.9655 |
| Chandigarh | Chandigarh | 30.7333 | 76.7794 |
| Kochi | Kerala | 9.9312 | 76.2673 |
| Ahmedabad | Gujarat | 23.0225 | 72.5714 |
| Surat | Gujarat | 21.1702 | 72.5314 |

---

## Hospital Database

### Sample Hospital Record
```json
{
  "id": 1,
  "name": "All India Institute of Medical Sciences",
  "city": "Delhi",
  "state": "Delhi",
  "address": "Ansari Nagar, New Delhi 110029",
  "lat": 28.5921,
  "lng": 77.2037,
  "phone": "+91-11-2658-8500",
  "email": "contact@aiims.edu",
  "website": "www.aiims.edu",
  "specialties": ["Cardiology", "Cardiothoracic Surgery", "Cardiac Imaging"],
  "emergency": true,
  "rating": 4.8,
  "hours": "24/7",
  "beds": 2000,
  "doctors": 80,
  "hasEcho": true,
  "hasCathLab": true
}
```

### Total Hospitals: 20+
- **Delhi**: 7 hospitals
- **Mumbai**: 5 hospitals
- **Bangalore**: 3 hospitals
- **Other Cities**: 5+ hospitals

---

## Google Maps API Setup Guide

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable billing for the project

### Step 2: Enable Required APIs
1. In Console, go to **APIs & Services** → **Library**
2. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API

### Step 3: Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **API Key**
3. Copy the generated API key

### Step 4: Restrict Your Key (Recommended)
1. In Credentials, click on your API key
2. Under **Application restrictions**:
   - Select "HTTP referrers"
   - Add: `localhost:3000`, `localhost:3000/*`
   - For production: add your domain

3. Under **API restrictions**:
   - Select "Restrict key"
   - Add: Maps JavaScript API, Geocoding API, Places API

### Step 5: Add to .env File
```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

### Step 6: Restart Development Server
```bash
npm start
```

---

## Component Architecture

### Main Component: `ContactPageGMaps`
```
ContactPageGMaps
├── Search Section
│   ├── City input field
│   ├── GPS button
│   └── Search button
├── Tab Views
│   ├── List View
│   │   ├── Hospital Cards Grid
│   │   ├── Distance display
│   │   ├── Action buttons
│   │   └── Hospital dialog
│   └── Map View
│       ├── Google Maps embed
│       └── Location info
└── Emergency Alert
    └── Emergency numbers
```

### State Management
```typescript
- searchInput: string (city/location search)
- hospitals: HospitalWithDistance[] (search results with distances)
- loading: boolean (search in progress)
- error: string (error messages)
- userLocation: { lat, lng } (user's coordinates)
- selectedHospital: HospitalWithDistance | null (for details dialog)
- tabValue: number (list/map view selector)
```

### Key Functions
1. `calculateDistance()` - Haversine formula
2. `geocodeCity()` - Map city names to coordinates
3. `handleSearchByLocation()` - Process city search
4. `handleUseCurrentLocation()` - Get GPS coordinates
5. `getDirections()` - Generate Google Maps directions URL
6. `openHospitalOnMaps()` - Open hospital on Google Maps
7. `initializeMap()` - Load Google Maps API

---

## Performance Metrics

### Build Size
```
Before: 237.56 kB
After:  243.09 kB
Delta:  +5.53 kB (+2.3%)
```

### Component Statistics
- Lines of Code: 850+
- Functional Components: 1
- Material-UI Components: 25+
- Features: 8+
- Supported Cities: 19
- Hospital Database: 20+

---

## Testing Checklist

### GPS/Location Features
- [ ] GPS search returns hospitals within 100km
- [ ] Hospitals sorted by distance correctly
- [ ] Permission denied error handled gracefully
- [ ] Browser without geolocation shows error message

### City Search
- [ ] All 19 cities return results
- [ ] Distance calculation accurate
- [ ] City not found error displayed
- [ ] Case-insensitive search works

### User Interface
- [ ] Hospital cards render with all info
- [ ] Action buttons functional (call, email, directions)
- [ ] Dialog opens with full details
- [ ] Map view loads and displays location
- [ ] Responsive on mobile, tablet, desktop

### Google Maps Integration
- [ ] Maps embed loads correctly
- [ ] Hospital location shown on map
- [ ] Directions link opens in new tab
- [ ] API key validation

---

## Deployment Checklist

### Before Production
1. ✅ Get production Google Maps API key
2. ✅ Update API key restrictions for production domain
3. ✅ Test all features on production URL
4. ✅ Set `.env` with production API key
5. ✅ Run security audit (`npm audit`)
6. ✅ Test on different browsers (Chrome, Firefox, Safari)

### Environment Variables
```env
# Production
REACT_APP_GOOGLE_MAPS_API_KEY=prod_key_here
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Maps not loading | Check API key in .env and ensure APIs are enabled |
| "Geolocation not supported" | Use city search as fallback |
| Slow distance calculations | Pre-calculate for static cities |
| Hospital not showing on map | Verify coordinates in JSON data |
| API over quota | Check billing and usage limits |

### Debug Mode
```typescript
// Add to component to enable console logging
console.log('User Location:', userLocation);
console.log('Hospitals:', hospitals);
console.log('Distance:', calculateDistance(...));
```

---

## Future Enhancements

### Proposed Features
1. **Advanced Filtering**
   - By specialties
   - By facilities (Cath Lab, Echo)
   - By rating/reviews
   - By bed count

2. **Enhanced Map**
   - Custom markers for hospitals
   - Info windows on hover
   - Directions polyline
   - Traffic layer

3. **Integration**
   - Hospital appointment booking
   - Doctor consultation integration
   - Insurance verification
   - Real-time availability

4. **Analytics**
   - Track popular searches
   - User engagement metrics
   - Hospital view statistics

---

## Support & Maintenance

### File Locations
- **Frontend**: `src/pages/ContactPageGMaps.tsx`
- **Data**: `src/data/hospitals-india.json`
- **Config**: `.env`, `.env.example`
- **Routes**: `src/App.tsx`

### Modification Guidelines
- Keep hospital data in JSON format
- Maintain Material-UI theme consistency
- Test responsive design on all breakpoints
- Update documentation when changing features

### Version History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025 | Initial Google Maps integration with GPS and city search |

---

## Related Documentation
- [Hospital Finder Feature Overview](./HOSPITAL_FINDER_FEATURE.md)
- [Testing Guide](./TESTING_HOSPITAL_FINDER.md)
- [Implementation Details](./IMPLEMENTATION_COMPLETE.md)
- [API Setup Guide](./GOOGLE_MAPS_API_SETUP.md)

---

## Contact & Emergency
- **App Support**: contact@heart-disease-awareness.com
- **Medical Emergency**: Call 112 (India)
- **Ambulance**: Call 108 (India)
