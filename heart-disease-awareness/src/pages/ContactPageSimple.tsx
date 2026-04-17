import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  LocationOn,
  Phone,
  AccessTime,
  Star,
  Navigation,
  Search,
  Email,
} from '@mui/icons-material';

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  distance: number;
  rating: number;
  specialties: string[];
  emergency: boolean;
  hours: string;
  lat: number;
  lng: number;
}

const mockHospitals: Hospital[] = [
  {
    id: '1',
    name: 'AIIMS Delhi - Cardiology Department',
    address: 'Ansari Nagar, New Delhi, Delhi 110029',
    phone: '+91-11-26588500',
    email: 'cardiology@aiims.edu',
    website: 'www.aiims.edu',
    distance: 2.5,
    rating: 4.8,
    specialties: ['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology'],
    emergency: true,
    hours: '24/7 Emergency',
    lat: 28.5665,
    lng: 77.2090,
  },
  {
    id: '2',
    name: 'Fortis Escorts Heart Institute',
    address: 'Okhla Road, New Delhi, Delhi 110025',
    phone: '+91-11-42888888',
    email: 'info@fortisescorts.in',
    website: 'www.fortisescorts.in',
    distance: 3.2,
    rating: 4.7,
    specialties: ['Cardiology', 'Cardiac Surgery', 'Pediatric Cardiology'],
    emergency: true,
    hours: '24/7 Emergency',
    lat: 28.5510,
    lng: 77.2743,
  },
  {
    id: '3',
    name: 'Max Super Speciality Hospital',
    address: 'Press Enclave Road, New Delhi, Delhi 110017',
    phone: '+91-11-40554055',
    email: 'info@maxhealthcare.in',
    website: 'www.maxhealthcare.in',
    distance: 4.1,
    rating: 4.6,
    specialties: ['Cardiology', 'Cardiac Surgery', 'Electrophysiology'],
    emergency: true,
    hours: '24/7 Emergency',
    lat: 28.5699,
    lng: 77.2387,
  },
];

const ContactPage: React.FC = () => {
  const [location, setLocation] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setHospitals(mockHospitals);
  }, []);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleLocationSearch = async () => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockCoords = { lat: 28.6139, lng: 77.2090 };
      setUserLocation(mockCoords);
      
      const hospitalsWithDistance = mockHospitals.map(hospital => ({
        ...hospital,
        distance: calculateDistance(mockCoords.lat, mockCoords.lng, hospital.lat, hospital.lng),
      })).sort((a, b) => a.distance - b.distance);
      
      setHospitals(hospitalsWithDistance);
    } catch (err) {
      setError('Failed to fetch location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          const hospitalsWithDistance = mockHospitals.map(hospital => ({
            ...hospital,
            distance: calculateDistance(latitude, longitude, hospital.lat, hospital.lng),
          })).sort((a, b) => a.distance - b.distance);
          
          setHospitals(hospitalsWithDistance);
          setLocation('Current Location');
          setLoading(false);
        },
        (error) => {
          setError('Unable to get your location. Please enter manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const getDirections = (hospitalLat: number, hospitalLng: number) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospitalLat},${hospitalLng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${hospitalLat},${hospitalLng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" color="primary">
            Find Heart Hospitals Near You
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Locate the best cardiac care facilities in your area
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Search Location
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your location or use your current location to find nearby heart hospitals
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city, area, or address"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLocationSearch}
                  disabled={loading}
                  startIcon={<Search />}
                  sx={{ flex: 1 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCurrentLocation}
                  disabled={loading}
                  startIcon={<Navigation />}
                >
                  Use Current
                </Button>
              </Box>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Paper>

        <Box>
          <Typography variant="h4" gutterBottom>
            Nearby Heart Hospitals
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {hospitals.length} hospitals found near you
          </Typography>

          <Grid container spacing={4}>
            {hospitals.map((hospital) => (
              <Grid item xs={12} md={6} lg={4} key={hospital.id}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationOn sx={{ mr: 2, fontSize: 32, color: 'primary' }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {hospital.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Star sx={{ fontSize: 16, mr: 0.5, color: 'warning' }} />
                          <Typography variant="body2" color="text.secondary">
                            {hospital.rating} ({hospital.distance.toFixed(1)} km away)
                          </Typography>
                        </Box>
                        {hospital.emergency && (
                          <Chip
                            label="24/7 Emergency"
                            size="small"
                            color="error"
                            sx={{ mb: 1 }}
                          />
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        {hospital.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <Phone sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        {hospital.phone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        {hospital.hours}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Specialties:
                      </Typography>
                      <Box sx={{ flexWrap: 'wrap', display: 'flex' }}>
                        {hospital.specialties.map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<Phone />}
                        href={`tel:${hospital.phone}`}
                        sx={{ flex: 1 }}
                      >
                        Call
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Navigation />}
                        onClick={() => getDirections(hospital.lat, hospital.lng)}
                        sx={{ flex: 1 }}
                      >
                        Directions
                      </Button>
                      <IconButton
                        color="primary"
                        href={`mailto:${hospital.email}`}
                        size="small"
                      >
                        <Email />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Emergency: Call 112 or 108
            </Typography>
            <Typography variant="body2">
              For immediate medical emergencies, call 112 (general emergency) or 108 (medical emergency)
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
