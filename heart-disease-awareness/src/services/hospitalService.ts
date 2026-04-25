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
}

export interface SearchResult {
  hospitals: Hospital[];
  total: number;
  city: string;
}

const HEART_KEYWORDS = [
  'cardio',
  'cardiac',
  'heart',
  'cardiothoracic',
  'electrophysiology',
  'interventional cardiology'
];

const isValidCoordinate = (lat: number, lng: number): boolean => {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

const textHasHeartKeyword = (text: string): boolean => {
  const normalized = text.toLowerCase();
  return HEART_KEYWORDS.some((keyword) => normalized.includes(keyword));
};

const deriveSpecialties = (tags: Record<string, any>, hospitalName: string): string[] => {
  const collected = new Set<string>();

  const rawSpecialtyFields = [
    tags['healthcare:speciality'],
    tags['healthcare:specialty'],
    tags.speciality,
    tags.specialty,
    tags.department
  ]
    .filter(Boolean)
    .join(';');

  if (rawSpecialtyFields) {
    rawSpecialtyFields
      .split(/[;,|]/)
      .map((item) => item.trim())
      .filter(Boolean)
      .forEach((item) => collected.add(item));
  }

  if (collected.size === 0 && textHasHeartKeyword(hospitalName)) {
    collected.add('Cardiology');
  }

  if (collected.size === 0) {
    collected.add('General');
  }

  return Array.from(collected);
};

export const isHeartSpecialistHospital = (hospital: Hospital): boolean => {
  const fullText = `${hospital.name} ${hospital.address} ${(hospital.specialties || []).join(' ')}`;
  return textHasHeartKeyword(fullText);
};

// Using Overpass API for real-time hospital data
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Fallback to predefined data if API fails
const getFallbackHospitals = (city: string): Hospital[] => {
  const cityHospitals: Record<string, Hospital[]> = {
    'delhi': [
      {
        id: 'delhi-1',
        name: 'All India Institute of Medical Sciences (AIIMS)',
        address: 'Ansari Nagar, New Delhi, Delhi 110029',
        lat: 28.5672,
        lng: 77.2069,
        phone: '+91-11-2658-8500',
        website: 'https://www.aiims.edu',
        rating: 4.8,
        specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Heart Transplant', 'Electrophysiology'],
        emergency: true,
        hours: '24/7'
      },
      {
        id: 'delhi-2',
        name: 'Fortis Escorts Heart Institute',
        address: 'Okhla Road, New Delhi, Delhi 110025',
        lat: 28.5510,
        lng: 77.2743,
        phone: '+91-11-4288-8888',
        website: 'https://www.fortisescorts.in',
        rating: 4.7,
        specialties: ['Cardiology', 'Cardiac Surgery', 'Pediatric Cardiology'],
        emergency: true,
        hours: '24/7'
      }
    ],
    'mumbai': [
      {
        id: 'mumbai-1',
        name: 'Kokilaben Dhirubhai Ambani Hospital',
        address: 'Sion, Mumbai, Maharashtra 400022',
        lat: 19.0760,
        lng: 72.8777,
        phone: '+91-22-2545-2505',
        website: 'https://www.kokilabenhospital.com',
        rating: 4.5,
        specialties: ['Cardiology', 'Cardiac Surgery', 'Neurology'],
        emergency: true,
        hours: '24/7'
      },
      {
        id: 'mumbai-2',
        name: 'Lilavati Hospital',
        address: 'Bandra-Worli Sea Face Road, Mumbai, Maharashtra 400025',
        lat: 19.0176,
        lng: 72.8564,
        phone: '+91-22-2545-2505',
        website: 'https://www.lilavatihospital.com',
        rating: 4.4,
        specialties: ['Cardiology', 'Cardiac Surgery', 'Pediatric Cardiology'],
        emergency: true,
        hours: '24/7'
      }
    ],
    'bangalore': [
      {
        id: 'bangalore-1',
        name: 'Manipal Hospital',
        address: 'Miller Road, Bengaluru, Karnataka 560104',
        lat: 12.9666,
        lng: 77.5983,
        phone: '+91-80-2241-0000',
        website: 'https://www.manipalhospital.com',
        rating: 4.4,
        specialties: ['Cardiology', 'Cardiac Surgery', 'Neurology'],
        emergency: true,
        hours: '24/7'
      },
      {
        id: 'bangalore-2',
        name: 'Fortis Hospital',
        address: 'Cunningham Road, Bengaluru, Karnataka 560103',
        lat: 12.9867,
        lng: 77.5966,
        phone: '+91-80-2241-0000',
        website: 'https://www.fortis.com',
        rating: 4.6,
        specialties: ['Cardiology', 'Cardiac Surgery', 'Pediatric Cardiology'],
        emergency: true,
        hours: '24/7'
      }
    ]
  };

  return cityHospitals[city.toLowerCase()] || [];
};

// Get coordinates for Indian cities
const getCityCoordinates = (city: string): { lat: number; lng: number } | null => {
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
    'warangal': { lat: 18.0000, lng: 79.5800 }
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

// Search hospitals by city using real-time API
export const searchHospitalsByCity = async (city: string): Promise<SearchResult> => {
  try {
    const cityCoords = getCityCoordinates(city);
    
    if (!cityCoords) {
      // Return fallback data if city not found
      const fallbackHospitals = getFallbackHospitals(city);
      return {
        hospitals: fallbackHospitals,
        total: fallbackHospitals.length,
        city
      };
    }

    // Query Overpass API for hospitals and cardiology-focused clinics near the city.
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](${cityCoords.lat - 0.2},${cityCoords.lng - 0.2},${cityCoords.lat + 0.2},${cityCoords.lng + 0.2});
        way["amenity"="hospital"](${cityCoords.lat - 0.2},${cityCoords.lng - 0.2},${cityCoords.lat + 0.2},${cityCoords.lng + 0.2});
        relation["amenity"="hospital"](${cityCoords.lat - 0.2},${cityCoords.lng - 0.2},${cityCoords.lat + 0.2},${cityCoords.lng + 0.2});
        node["amenity"="clinic"]["healthcare:speciality"~"cardio|heart",i](${cityCoords.lat - 0.2},${cityCoords.lng - 0.2},${cityCoords.lat + 0.2},${cityCoords.lng + 0.2});
        way["amenity"="clinic"]["healthcare:speciality"~"cardio|heart",i](${cityCoords.lat - 0.2},${cityCoords.lng - 0.2},${cityCoords.lat + 0.2},${cityCoords.lng + 0.2});
        relation["amenity"="clinic"]["healthcare:speciality"~"cardio|heart",i](${cityCoords.lat - 0.2},${cityCoords.lng - 0.2},${cityCoords.lat + 0.2},${cityCoords.lng + 0.2});
      );
      out geom;
    `;

    const response = await axios.post(OVERPASS_API, query, {
      headers: {
        'Content-Type': 'text/plain',
      },
      timeout: 10000
    });

    const data = response.data;
    const hospitals: Hospital[] = [];

    if (data.elements) {
      data.elements.forEach((element: any) => {
        if (element.tags && element.tags.name) {
          const parsedLat = typeof element.lat === 'number' ? element.lat : element.center?.lat;
          const parsedLng = typeof element.lon === 'number' ? element.lon : element.center?.lon;

          if (!isValidCoordinate(parsedLat, parsedLng)) {
            return;
          }

          const hospital: Hospital = {
            id: `osm-${element.id}`,
            name: element.tags.name || 'Unknown Hospital',
            address: element.tags['addr:street'] || element.tags['addr:full'] || 'Address not available',
            lat: parsedLat,
            lng: parsedLng,
            phone: element.tags.phone || element.tags['contact:phone'],
            website: element.tags.website || element.tags['contact:website'],
            rating: parseFloat(element.tags.rating) || undefined,
            specialties: deriveSpecialties(element.tags, element.tags.name || 'Unknown Hospital'),
            emergency: element.tags.emergency === 'yes' || element.tags['emergency'] === 'yes',
            hours: element.tags.opening_hours || 'Not specified'
          };

          // Calculate distance from city center
          hospital.distance = calculateDistance(cityCoords.lat, cityCoords.lng, hospital.lat, hospital.lng);

          hospitals.push(hospital);
        }
      });
    }

    // If no hospitals found from API, use fallback data
    if (hospitals.length === 0) {
      const fallbackHospitals = getFallbackHospitals(city);
      return {
        hospitals: fallbackHospitals,
        total: fallbackHospitals.length,
        city
      };
    }

    // Sort by distance and limit to 20 results
    hospitals.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    const limitedHospitals = hospitals.slice(0, 20);

    return {
      hospitals: limitedHospitals,
      total: limitedHospitals.length,
      city
    };

  } catch (error) {
    console.error('Error fetching hospitals from API:', error);
    
    // Fallback to predefined data
    const fallbackHospitals = getFallbackHospitals(city);
    return {
      hospitals: fallbackHospitals,
      total: fallbackHospitals.length,
      city
    };
  }
};

// Search hospitals by coordinates
export const searchHospitalsByCoords = async (lat: number, lng: number, radius: number = 10): Promise<SearchResult> => {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](${lat - 0.1},${lng - 0.1},${lat + 0.1},${lng + 0.1});
        way["amenity"="hospital"](${lat - 0.1},${lng - 0.1},${lat + 0.1},${lng + 0.1});
        relation["amenity"="hospital"](${lat - 0.1},${lng - 0.1},${lat + 0.1},${lng + 0.1});
        node["amenity"="clinic"]["healthcare:speciality"~"cardio|heart",i](${lat - 0.1},${lng - 0.1},${lat + 0.1},${lng + 0.1});
        way["amenity"="clinic"]["healthcare:speciality"~"cardio|heart",i](${lat - 0.1},${lng - 0.1},${lat + 0.1},${lng + 0.1});
        relation["amenity"="clinic"]["healthcare:speciality"~"cardio|heart",i](${lat - 0.1},${lng - 0.1},${lat + 0.1},${lng + 0.1});
      );
      out geom;
    `;

    const response = await axios.post(OVERPASS_API, query, {
      headers: {
        'Content-Type': 'text/plain',
      },
      timeout: 10000
    });

    const data = response.data;
    const hospitals: Hospital[] = [];

    if (data.elements) {
      data.elements.forEach((element: any) => {
        if (element.tags && element.tags.name) {
          const parsedLat = typeof element.lat === 'number' ? element.lat : element.center?.lat;
          const parsedLng = typeof element.lon === 'number' ? element.lon : element.center?.lon;

          if (!isValidCoordinate(parsedLat, parsedLng)) {
            return;
          }

          const hospital: Hospital = {
            id: `osm-${element.id}`,
            name: element.tags.name || 'Unknown Hospital',
            address: element.tags['addr:street'] || element.tags['addr:full'] || 'Address not available',
            lat: parsedLat,
            lng: parsedLng,
            phone: element.tags.phone || element.tags['contact:phone'],
            website: element.tags.website || element.tags['contact:website'],
            rating: parseFloat(element.tags.rating) || undefined,
            specialties: deriveSpecialties(element.tags, element.tags.name || 'Unknown Hospital'),
            emergency: element.tags.emergency === 'yes' || element.tags['emergency'] === 'yes',
            hours: element.tags.opening_hours || 'Not specified'
          };

          // Calculate distance from user location
          hospital.distance = calculateDistance(lat, lng, hospital.lat, hospital.lng);

          // Only include hospitals within the specified radius
          if (hospital.distance <= radius) {
            hospitals.push(hospital);
          }
        }
      });
    }

    // Sort by distance
    hospitals.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return {
      hospitals: hospitals.slice(0, 20),
      total: hospitals.length,
      city: 'Current Location'
    };

  } catch (error) {
    console.error('Error fetching hospitals from API:', error);
    
    // Return empty result on API failure
    return {
      hospitals: [],
      total: 0,
      city: 'Current Location'
    };
  }
};

// Get list of all supported cities
export const getSupportedCities = (): string[] => {
  return [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
    'Jaipur', 'Lucknow', 'Indore', 'Surat', 'Nagpur', 'Patna', 'Kanpur', 'Agra', 'Meerut',
    'Nashik', 'Faridabad', 'Gurgaon', 'Varanasi', 'Bhopal', 'Vijayawada', 'Coimbatore',
    'Kochi', 'Visakhapatnam', 'Aurangabad', 'Jodhpur', 'Guwahati', 'Chandigarh', 'Raipur',
    'Trivandrum', 'Ranchi', 'Hubli', 'Jammu', 'Mangalore', 'Bhubaneswar', 'Amritsar',
    'Dehradun', 'Cuttack', 'Firozabad', 'Gwalior', 'Kochi', 'Kozhikode', 'Nanded',
    'Salem', 'Solapur', 'Tiruppur', 'Moradabad', 'Aligarh', 'Bhiwandi', 'Saharanpur',
    'Guntur', 'Amravati', 'Bikaner', 'Kakinada', 'Nizamabad', 'Sagar', 'Tumkur',
    'Kollam', 'Ichalkaranji', 'Tirupati', 'Ajmer', 'Ulhasnagar', 'Jalandhar', 'Rajkot',
    'Kota', 'Ludhiana', 'Vadodara', 'Madurai', 'Mysore', 'Jabalpur', 'Thiruvananthapuram',
    'Warangal', 'Tiruppur', 'Gwalior', 'Raipur', 'Chandigarh', 'Guwahati', 'Nagpur',
    'Lucknow', 'Pune', 'Jaipur', 'Indore', 'Ahmedabad', 'Kolkata', 'Chennai',
    'Bengaluru', 'Mumbai', 'Delhi'
  ];
};
