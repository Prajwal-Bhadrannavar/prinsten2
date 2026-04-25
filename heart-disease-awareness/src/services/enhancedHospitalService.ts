import axios from 'axios';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  rating?: number;
  distance?: number;
  specialties?: string[];
  emergency?: boolean;
  hours?: string;
  source?: string; // Track data source
}

export interface SearchResult {
  hospitals: Hospital[];
  total: number;
  city: string;
  source: string;
}

// Multiple API options for real-time hospital data
const API_OPTIONS = {
  // 1. OpenStreetMap Overpass API (Free, Global)
  OVERPASS: {
    url: 'https://overpass-api.de/api/interpreter',
    timeout: 10000,
    radius: 50, // km
  },
  
  // 2. Mapbox Geocoding API (Free tier, 50k requests/month)
  MAPBOX: {
    url: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    token: 'pk.eyJ1IjoidHl...', // You'll need to add your token
    timeout: 10000,
  },
  
  // 3. Here Places API (Free tier, 100k requests/month)
  HERE: {
    url: 'https://discover.search.hereapi.com/v1/discover',
    apiKey: 'YOUR_HERE_API_KEY', // You'll need to add your key
    timeout: 10000,
  },
  
  // 4. OpenStreetMap Nominatim (Free, no API key required)
  NOMINATIM: {
    url: 'https://nominatim.openstreetmap.org/search',
    timeout: 10000,
  },
  
  // 5. Photon API (OpenStreetMap based, Free)
  PHOTON: {
    url: 'https://photon.komoot.io/api',
    timeout: 10000,
  }
};

// Enhanced city coordinates with more cities and towns
export const getCityCoordinates = (city: string): { lat: number; lng: number } | null => {
  const cities: Record<string, { lat: number; lng: number }> = {
    // Major cities
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'new delhi': { lat: 28.6139, lng: 77.209 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'bangalore': { lat: 12.9666, lng: 77.5983 },
    'bengaluru': { lat: 12.9666, lng: 77.5983 },
    'chennai': { lat: 13.0674, lng: 80.2560 },
    'kolkata': { lat: 22.5667, lng: 88.3639 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'pune': { lat: 18.5150, lng: 73.8568 },
    'ahmedabad': { lat: 23.0225, lng: 72.5804 },
    'jaipur': { lat: 26.9237, lng: 75.8238 },
    'lucknow': { lat: 26.7451, lng: 80.9312 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'patna': { lat: 25.5941, lng: 85.1376 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'agra': { lat: 27.1767, lng: 78.0081 },
    'meerut': { lat: 28.9845, lng: 77.7064 },
    'nashik': { lat: 19.9975, lng: 73.7898 },
    'faridabad': { lat: 28.4089, lng: 77.3178 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'varanasi': { lat: 25.3176, lng: 82.9739 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'kochi': { lat: 9.9312, lng: 76.2673 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'aurangabad': { lat: 19.8762, lng: 75.3433 },
    'jodhpur': { lat: 26.2389, lng: 73.0243 },
    'guwahati': { lat: 26.1445, lng: 91.7362 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'raipur': { lat: 21.2514, lng: 81.6296 },
    'trivandrum': { lat: 8.5241, lng: 76.9366 },
    'ranchi': { lat: 23.3441, lng: 85.3096 },
    'hubli': { lat: 15.3647, lng: 75.1240 },
    'jammu': { lat: 32.7266, lng: 74.8570 },
    'mangalore': { lat: 12.9141, lng: 74.8560 },
    'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'dehradun': { lat: 30.3165, lng: 78.0322 },
    'cuttack': { lat: 20.4625, lng: 85.8830 },
    'firozabad': { lat: 27.1526, lng: 78.3928 },
    'gwalior': { lat: 26.2124, lng: 78.1772 },
    'kozhikode': { lat: 11.2588, lng: 75.7804 },
    'nanded': { lat: 19.1383, lng: 77.3210 },
    'salem': { lat: 11.6644, lng: 78.1460 },
    'solapur': { lat: 17.6599, lng: 75.9064 },
    'tiruppur': { lat: 11.1085, lng: 77.3411 },
    'moradabad': { lat: 28.8386, lng: 78.7733 },
    'aligarh': { lat: 27.8974, lng: 78.0884 },
    'bhiwandi': { lat: 19.2961, lng: 73.0468 },
    'saharanpur': { lat: 30.0173, lng: 77.3178 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'amravati': { lat: 20.9372, lng: 77.7796 },
    'bikaner': { lat: 28.0229, lng: 73.3118 },
    'kakinada': { lat: 16.9893, lng: 82.2475 },
    'nizamabad': { lat: 18.6725, lng: 78.0945 },
    'sagar': { lat: 23.8435, lng: 78.8020 },
    'tumkur': { lat: 13.3419, lng: 77.1030 },
    'kollam': { lat: 8.8921, lng: 76.5955 },
    'ichalkaranji': { lat: 16.6929, lng: 74.5161 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },
    'ajmer': { lat: 26.4499, lng: 74.6399 },
    'ulhasnagar': { lat: 19.0748, lng: 73.1519 },
    'jalandhar': { lat: 31.3260, lng: 75.5762 },
    'rajkot': { lat: 22.3039, lng: 70.8022 },
    'kota': { lat: 25.2138, lng: 75.8648 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'vadodara': { lat: 22.3072, lng: 73.1812 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'mysore': { lat: 12.2958, lng: 76.6394 },
    'jabalpur': { lat: 23.1815, lng: 79.9864 },
    'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
    'warangal': { lat: 18.0000, lng: 79.5800 },
    
    // Karnataka towns (for better Magadi, Bengaluru coverage)
    'magadi': { lat: 13.0475, lng: 77.5117 },
    'tumakuru': { lat: 13.3406, lng: 77.1158 },
    'hoskote': { lat: 12.7667, lng: 77.5667 },
    'mandya': { lat: 12.5406, lng: 76.8956 },
    'chitradurga': { lat: 13.6989, lng: 77.6097 },
    'davanagere': { lat: 14.4694, lng: 77.5278 },
    'bellary': { lat: 15.1394, lng: 76.9128 },
    'raichur': { lat: 16.5122, lng: 77.0142 },
    'bidar': { lat: 17.9130, lng: 77.5172 },
    'gulbarga': { lat: 17.3333, lng: 76.8233 },
    
    // Maharashtra towns (for better Mumbai coverage)
    'thane': { lat: 19.2183, lng: 72.9781 },
    'kalyan': { lat: 19.2403, lng: 73.1355 },
    'nasik': { lat: 19.9975, lng: 73.7898 },
    'aurangabad_mh': { lat: 19.8762, lng: 75.3433 },
    'kolhapur': { lat: 16.6950, lng: 74.2236 },
    'sangli': { lat: 16.8524, lng: 74.5833 },
    'satara': { lat: 17.6828, lng: 74.0183 },
    'jalgaon': { lat: 19.0833, lng: 75.8833 },
    'ahmednagar': { lat: 18.9667, lng: 75.5758 },
    'latur': { lat: 18.3950, lng: 76.5603 },
    'dhule': { lat: 20.1183, lng: 74.8469 },
    'parbhani': { lat: 19.2639, lng: 76.7753 },
    'beed': { lat: 18.9250, lng: 75.7597 },
    'osmanabad': { lat: 18.1756, lng: 75.8069 },
    
    // Tamil Nadu towns (for better Chennai coverage)
    'tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
    'erode': { lat: 11.3410, lng: 77.7283 },
    'vellore': { lat: 12.9165, lng: 79.1326 },
    'cuddalore': { lat: 11.7512, lng: 78.9772 },
    'kanchipuram': { lat: 12.8352, lng: 79.7036 },
    'karur': { lat: 10.9604, lng: 78.0833 },
    'namakkal': { lat: 10.7905, lng: 78.6989 },
    'thanjavur': { lat: 10.7905, lng: 78.6894 },
    'dindigul': { lat: 10.7905, lng: 78.7067 },
    'pudukkottai': { lat: 10.7905, lng: 78.6569 },
    
    // Uttar Pradesh towns (for better Lucknow coverage)
    'allahabad': { lat: 25.4479, lng: 81.8469 },
    'bareilly': { lat: 28.3667, lng: 79.4300 },
    'gorakhpur': { lat: 26.7606, lng: 83.3692 },
    'farrukhabad': { lat: 27.8807, lng: 79.6069 },
    'jhansi': { lat: 25.4476, lng: 78.5697 },
    'shahjahanpur': { lat: 25.2788, lng: 78.7142 },
    'unnao': { lat: 25.4596, lng: 80.5989 },
    'rae bareli': { lat: 26.4999, lng: 80.8319 },
    'sitapur': { lat: 28.2847, lng: 77.2133 },
    'hardoi': { lat: 27.4176, lng: 80.3356 },
    'lakhimpur kheri': { lat: 27.9426, lng: 80.7772 },
    
    // West Bengal towns (for better Kolkata coverage)
    'howrah': { lat: 22.5958, lng: 88.2636 },
    'durgapur': { lat: 22.5667, lng: 88.3639 },
    'asansol': { lat: 23.6833, lng: 86.9956 },
    'siliguri': { lat: 26.7271, lng: 88.3958 },
    'bardhaman': { lat: 23.2457, lng: 88.0243 },
    'baharampur': { lat: 23.2457, lng: 88.0243 },
    'kharagpur': { lat: 22.8967, lng: 87.7358 },
    'shantiniketan': { lat: 22.5908, lng: 88.4356 },
    'malda': { lat: 25.3176, lng: 88.1398 },
    'purulia': { lat: 23.3176, lng: 86.3639 },
    'bankura': { lat: 23.2457, lng: 87.0717 },
    'bishnupur': { lat: 23.7107, lng: 87.6856 },
    'darjeeling': { lat: 27.0360, lng: 88.2627 },
    'jalpaiguri': { lat: 26.5449, lng: 88.7358 },
  };

  return cities[city.toLowerCase()] || null;
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 1. OpenStreetMap Overpass API (Free, Global coverage)
const searchOverpassAPI = async (lat: number, lng: number, radius: number): Promise<Hospital[]> => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"]["healthcare"="hospital"](${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5});
      way["amenity"="hospital"]["healthcare"="hospital"](${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5});
      relation["amenity"="hospital"]["healthcare"="hospital"](${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5});
    );
    out geom;
  `;

  try {
    const response = await axios.post(API_OPTIONS.OVERPASS.url, query, {
      headers: { 'Content-Type': 'text/plain' },
      timeout: API_OPTIONS.OVERPASS.timeout,
    });

    const data = response.data;
    const hospitals: Hospital[] = [];

    if (data.elements) {
      data.elements.forEach((element: any) => {
        if (element.tags && element.tags.name) {
          const hospital: Hospital = {
            id: `osm-${element.id}`,
            name: element.tags.name || 'Unknown Hospital',
            address: element.tags['addr:street'] || element.tags['addr:full'] || 'Address not available',
            lat: element.lat || element.center?.lat || lat,
            lng: element.lon || element.center?.lon || lng,
            phone: element.tags.phone || element.tags['contact:phone'],
            website: element.tags.website || element.tags['contact:website'],
            rating: parseFloat(element.tags.rating) || undefined,
            specialties: element.tags['healthcare:speciality'] ? [element.tags['healthcare:speciality']] : ['General'],
            emergency: element.tags.emergency === 'yes' || element.tags['emergency'] === 'yes',
            hours: element.tags.opening_hours || 'Not specified',
            source: 'OpenStreetMap Overpass API'
          };

          // Calculate distance from user location
          hospital.distance = calculateDistance(lat, lng, hospital.lat, hospital.lng);
          hospitals.push(hospital);
        }
      });
    }

    // Sort by distance and limit results
    hospitals.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    return hospitals.slice(0, 50); // Return up to 50 hospitals

  } catch (error) {
    console.error('Overpass API error:', error);
    return [];
  }
};

// 2. Mapbox Geocoding API (Free tier: 50k requests/month)
const searchMapboxAPI = async (city: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await axios.get(`${API_OPTIONS.MAPBOX.url}/${encodeURIComponent(city)}.json`, {
      params: {
        access_token: API_OPTIONS.MAPBOX.token,
        limit: 1,
        types: 'place,locality,postcode'
      },
      timeout: API_OPTIONS.MAPBOX.timeout,
    });

    const features = response.data.features;
    if (features && features.length > 0) {
      const [lng, lat] = features[0].center;
      return { lat, lng };
    }

    return null;
  } catch (error) {
    console.error('Mapbox API error:', error);
    return null;
  }
};

// 3. HERE Places API (Free tier: 100k requests/month)
const searchHereAPI = async (city: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await axios.get(API_OPTIONS.HERE.url, {
      params: {
        apiKey: API_OPTIONS.HERE.apiKey,
        q: city,
        at: '0,0', // Search globally
        limit: 1,
        resultTypes: 'places'
      },
      timeout: API_OPTIONS.HERE.timeout,
    });

    const items = response.data.items;
    if (items && items.length > 0) {
      const position = items[0].position;
      return { lat: position.lat, lng: position.lng };
    }

    return null;
  } catch (error) {
    console.error('HERE API error:', error);
    return null;
  }
};

// 4. OpenStreetMap Nominatim (Free, no API key required)
const searchNominatimAPI = async (city: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await axios.get(API_OPTIONS.NOMINATIM.url, {
      params: {
        q: city,
        format: 'json',
        addressdetails: 1,
        limit: 1,
        countrycodes: 'IN', // Limit to India
      },
      timeout: API_OPTIONS.NOMINATIM.timeout,
    });

    const data = response.data;
    if (data && data.length > 0) {
      const result = data[0];
      return { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    }

    return null;
  } catch (error) {
    console.error('Nominatim API error:', error);
    return null;
  }
};

// 5. Photon API (OpenStreetMap based, Free)
const searchPhotonAPI = async (city: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await axios.get(API_OPTIONS.PHOTON.url, {
      params: {
        q: city,
        limit: 1,
        lang: 'en'
      },
      timeout: API_OPTIONS.PHOTON.timeout,
    });

    const features = response.data.features;
    if (features && features.length > 0) {
      const coordinates = features[0].geometry.coordinates;
      return { lat: coordinates[1], lng: coordinates[0] };
    }

    return null;
  } catch (error) {
    console.error('Photon API error:', error);
    return null;
  }
};

// Enhanced search with multiple APIs and larger radius
export const searchHospitalsByCoords = async (lat: number, lng: number, radius: number = 100): Promise<SearchResult> => {
  try {
    // Primary: Overpass API for hospital data
    const hospitals = await searchOverpassAPI(lat, lng, radius);
    
    return {
      hospitals,
      total: hospitals.length,
      city: 'Current Location',
      source: 'OpenStreetMap Overpass API'
    };
  } catch (error) {
    console.error('Enhanced search error:', error);
    return {
      hospitals: [],
      total: 0,
      city: 'Current Location',
      source: 'Error'
    };
  }
};

// Enhanced city search with multiple geocoding APIs
export const searchHospitalsByCity = async (city: string, radius: number = 100): Promise<SearchResult> => {
  try {
    let cityCoords = getCityCoordinates(city);
    
    // Try multiple geocoding APIs if city not found in our database
    if (!cityCoords) {
      // Try Mapbox first
      cityCoords = await searchMapboxAPI(city);
      
      // Fallback to Nominatim
      if (!cityCoords) {
        cityCoords = await searchNominatimAPI(city);
      }
      
      // Fallback to Photon
      if (!cityCoords) {
        cityCoords = await searchPhotonAPI(city);
      }
      
      // Fallback to HERE
      if (!cityCoords) {
        cityCoords = await searchHereAPI(city);
      }
    }

    if (!cityCoords) {
      return {
        hospitals: [],
        total: 0,
        city,
        source: 'City not found'
      };
    }

    // Search hospitals around the city coordinates with larger radius
    const hospitals = await searchOverpassAPI(cityCoords.lat, cityCoords.lng, radius);
    
    return {
      hospitals,
      total: hospitals.length,
      city,
      source: 'Multi-API Search (Overpass + Geocoding)'
    };
  } catch (error) {
    console.error('City search error:', error);
    return {
      hospitals: [],
      total: 0,
      city,
      source: 'Error'
    };
  }
};

// Get supported cities with enhanced coverage
export const getSupportedCities = (): string[] => {
  const cities: Record<string, { lat: number; lng: number }> = {
    'delhi': { lat: 28.6139, lng: 77.2090 },
    'new delhi': { lat: 28.6139, lng: 77.209 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'bangalore': { lat: 12.9666, lng: 77.5983 },
    'bengaluru': { lat: 12.9666, lng: 77.5983 },
    'chennai': { lat: 13.0674, lng: 80.2560 },
    'kolkata': { lat: 22.5667, lng: 88.3639 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'pune': { lat: 18.5150, lng: 73.8568 },
    'ahmedabad': { lat: 23.0225, lng: 72.5804 },
    'jaipur': { lat: 26.9237, lng: 75.8238 },
    'lucknow': { lat: 26.7451, lng: 80.9312 },
    'indore': { lat: 22.7196, lng: 75.8577 },
    'surat': { lat: 21.1702, lng: 72.8311 },
    'nagpur': { lat: 21.1458, lng: 79.0882 },
    'patna': { lat: 25.5941, lng: 85.1376 },
    'kanpur': { lat: 26.4499, lng: 80.3319 },
    'agra': { lat: 27.1767, lng: 78.0081 },
    'meerut': { lat: 28.9845, lng: 77.7064 },
    'nashik': { lat: 19.9975, lng: 73.7898 },
    'faridabad': { lat: 28.4089, lng: 77.3178 },
    'gurgaon': { lat: 28.4595, lng: 77.0266 },
    'varanasi': { lat: 25.3176, lng: 82.9739 },
    'bhopal': { lat: 23.2599, lng: 77.4126 },
    'vijayawada': { lat: 16.5062, lng: 80.6480 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'kochi': { lat: 9.9312, lng: 76.2673 },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'aurangabad': { lat: 19.8762, lng: 75.3433 },
    'jodhpur': { lat: 26.2389, lng: 73.0243 },
    'guwahati': { lat: 26.1445, lng: 91.7362 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'raipur': { lat: 21.2514, lng: 81.6296 },
    'trivandrum': { lat: 8.5241, lng: 76.9366 },
    'ranchi': { lat: 23.3441, lng: 85.3096 },
    'hubli': { lat: 15.3647, lng: 75.1240 },
    'jammu': { lat: 32.7266, lng: 74.8570 },
    'mangalore': { lat: 12.9141, lng: 74.8560 },
    'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'dehradun': { lat: 30.3165, lng: 78.0322 },
    'cuttack': { lat: 20.4625, lng: 85.8830 },
    'firozabad': { lat: 27.1526, lng: 78.3928 },
    'gwalior': { lat: 26.2124, lng: 78.1772 },
    'kozhikode': { lat: 11.2588, lng: 75.7804 },
    'nanded': { lat: 19.1383, lng: 77.3210 },
    'salem': { lat: 11.6644, lng: 78.1460 },
    'solapur': { lat: 17.6599, lng: 75.9064 },
    'tiruppur': { lat: 11.1085, lng: 77.3411 },
    'moradabad': { lat: 28.8386, lng: 78.7733 },
    'aligarh': { lat: 27.8974, lng: 78.0884 },
    'bhiwandi': { lat: 19.2961, lng: 73.0468 },
    'saharanpur': { lat: 30.0173, lng: 77.3178 },
    'guntur': { lat: 16.3067, lng: 80.4365 },
    'amravati': { lat: 20.9372, lng: 77.7796 },
    'bikaner': { lat: 28.0229, lng: 73.3118 },
    'kakinada': { lat: 16.9893, lng: 82.2475 },
    'nizamabad': { lat: 18.6725, lng: 78.0945 },
    'sagar': { lat: 23.8435, lng: 78.8020 },
    'tumkur': { lat: 13.3419, lng: 77.1030 },
    'kollam': { lat: 8.8921, lng: 76.5955 },
    'ichalkaranji': { lat: 16.6929, lng: 74.5161 },
    'tirupati': { lat: 13.6288, lng: 79.4192 },
    'ajmer': { lat: 26.4499, lng: 74.6399 },
    'ulhasnagar': { lat: 19.0748, lng: 73.1519 },
    'jalandhar': { lat: 31.3260, lng: 75.5762 },
    'rajkot': { lat: 22.3039, lng: 70.8022 },
    'kota': { lat: 25.2138, lng: 75.8648 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'vadodara': { lat: 22.3072, lng: 73.1812 },
    'madurai': { lat: 9.9252, lng: 78.1198 },
    'mysore': { lat: 12.2958, lng: 76.6394 },
    'jabalpur': { lat: 23.1815, lng: 79.9864 },
    'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
    'warangal': { lat: 18.0000, lng: 79.5800 },
    
    // Karnataka towns
    'magadi': { lat: 13.0475, lng: 77.5117 },
    'tumakuru': { lat: 13.3406, lng: 77.1158 },
    'hoskote': { lat: 12.7667, lng: 77.5667 },
    'mandya': { lat: 12.5406, lng: 76.8956 },
    'chitradurga': { lat: 13.6989, lng: 77.6097 },
    'davanagere': { lat: 14.4694, lng: 77.5278 },
    'bellary': { lat: 15.1394, lng: 76.9128 },
    'raichur': { lat: 16.5122, lng: 77.0142 },
    'bidar': { lat: 17.9130, lng: 77.5172 },
    'gulbarga': { lat: 17.3333, lng: 76.8233 }
  };
  return Object.keys(cities);
};

// Fallback hospitals for when APIs fail
const getFallbackHospitals = (city: string): Hospital[] => {
  const cityHospitals: Record<string, Hospital[]> = {
    'delhi': [
      {
        id: 'delhi-1',
        name: 'All India Institute of Medical Sciences (AIIMS)',
        address: 'Ansari Nagar, New Delhi, Delhi 110029',
        lat: 28.5672,
        lng: 77.2069,
        phone: '+91-11-26588500',
        website: 'https://www.aiims.edu',
        specialties: ['Cardiology', 'Cardiothoracic Surgery'],
        emergency: true,
        hours: '24/7',
        source: 'Fallback Data'
      }
    ],
    'mumbai': [
      {
        id: 'mumbai-1',
        name: 'Kokilaben Dhirubhai Ambani Hospital',
        address: 'Sion, Mumbai, Maharashtra 400022',
        lat: 19.0760,
        lng: 72.8777,
        phone: '+91-22-25452505',
        website: 'https://www.kokilabenhospital.com',
        specialties: ['Cardiology', 'Cardiac Surgery'],
        emergency: true,
        hours: '24/7',
        source: 'Fallback Data'
      }
    ],
    'bangalore': [
      {
        id: 'bangalore-1',
        name: 'Manipal Hospital',
        address: 'Miller Road, Bengaluru, Karnataka 560104',
        lat: 12.9666,
        lng: 77.5983,
        phone: '+91-80-22410000',
        website: 'https://www.manipalhospital.com',
        specialties: ['Cardiology', 'Cardiac Surgery'],
        emergency: true,
        hours: '24/7',
        source: 'Fallback Data'
      }
    ],
    'magadi': [
      {
        id: 'magadi-1',
        name: 'Government District Hospital',
        address: 'Magadi, Karnataka 571401',
        lat: 13.0475,
        lng: 77.5117,
        phone: '+91-8161-224400',
        specialties: ['General Medicine', 'Cardiology'],
        emergency: true,
        hours: '24/7',
        source: 'Fallback Data'
      }
    ]
  };

  return cityHospitals[city.toLowerCase()] || [];
};
