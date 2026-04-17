import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LocationOn,
  Phone,
  AccessTime,
  Star,
  Navigation,
  Search,
  Email,
  Language,
  LocalHospital,
} from '@mui/icons-material';
import hospitalsData from '../data/hospitals-india.json';

interface HospitalData {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website: string;
  specialties: string[];
  emergency: boolean;
  rating: number;
  hours: string;
  beds: number;
  doctors: string;
  hasEcho: boolean;
  hasCathLab: boolean;
}

interface HospitalWithDistance extends HospitalData {
  distance: number;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12],
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ContactPageFixed: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [hospitals, setHospitals] = useState<HospitalWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<HospitalWithDistance | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Load all hospitals on mount
    setHospitals(
      (hospitalsData.hospitals as HospitalData[]).map((h) => ({
        ...h,
        distance: 0,
      }))
    );
  }, []);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const geocodeCity = async (cityName: string): Promise<{ lat: number; lng: number } | null> => {
    // City coordinates database for major Indian cities
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      delhi: { lat: 28.7041, lng: 77.1025 },
      'new delhi': { lat: 28.6139, lng: 77.209 },
      mumbai: { lat: 19.076, lng: 72.8777 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      hyderabad: { lat: 17.3850, lng: 78.4867 },
      pune: { lat: 18.5204, lng: 73.8567 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      gurgaon: { lat: 28.4595, lng: 77.0589 },
      noida: { lat: 28.5355, lng: 77.3911 },
      vellore: { lat: 12.9352, lng: 79.1304 },
      indore: { lat: 22.7196, lng: 75.8577 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      lucknow: { lat: 26.8467, lng: 80.9462 },
      dehradun: { lat: 30.1988, lng: 78.1018 },
      coimbatore: { lat: 11.0066, lng: 76.9655 },
      chandigarh: { lat: 30.7333, lng: 76.7794 },
      kochi: { lat: 9.9312, lng: 76.2673 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
      surat: { lat: 21.1702, lng: 72.8311 },
    };

    const normalizedCity = cityName.toLowerCase().trim();
    return cityCoordinates[normalizedCity] || null;
  };

  const handleSearchByLocation = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a city name or location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const coords = await geocodeCity(searchInput);
      if (!coords) {
        setError('City not found. Please try major cities like Delhi, Mumbai, Bangalore, etc.');
        setLoading(false);
        return;
      }

      setUserLocation(coords);
      const hospitalsWithDistance = (hospitalsData.hospitals as HospitalData[])
        .map((hospital) => ({
          ...hospital,
          distance: calculateDistance(coords.lat, coords.lng, hospital.lat, hospital.lng),
        }))
        .sort((a, b) => a.distance - b.distance);

      setHospitals(hospitalsWithDistance);
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const hospitalsWithDistance = (hospitalsData.hospitals as HospitalData[])
          .map((hospital) => ({
            ...hospital,
            distance: calculateDistance(latitude, longitude, hospital.lat, hospital.lng),
          }))
          .filter((hospital) => hospital.distance <= 100) // Show hospitals within 100km
          .sort((a, b) => a.distance - b.distance);

        setHospitals(hospitalsWithDistance);
        setSearchInput('📍 Your Location');
        setLoading(false);
      },
      (error) => {
        setError('Unable to access your location. Please enter a city name manually.');
        setLoading(false);
      }
    );
  };

  const getDirections = (hospital: HospitalWithDistance) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.lat},${hospital.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;
      window.open(url, '_blank');
    }
  };

  const handleOpenDialog = (hospital: HospitalWithDistance) => {
    setSelectedHospital(hospital);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHospital(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" color="primary" gutterBottom>
            🏥 Find Heart Hospitals Near You
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Locate the best cardiac care facilities across India
          </Typography>
        </Box>

        {/* Search Section */}
        <Paper sx={{ p: 4, mb: 6, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Search sx={{ mr: 2, color: 'primary' }} />
            Find Hospitals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Enter your city or allow access to your location to find nearby cardiology hospitals
          </Typography>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter City or Area"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchByLocation()}
                placeholder="e.g., Delhi, Mumbai, Bangalore..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="primary" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSearchByLocation}
                  disabled={loading}
                  startIcon={<Search />}
                  sx={{ flex: 1 }}
                  size="large"
                >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleUseCurrentLocation}
                  disabled={loading}
                  startIcon={<Navigation />}
                  size="large"
                >
                  Use GPS
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

        {/* Results Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            {hospitals.length > 0
              ? `${hospitals.length} Hospital${hospitals.length !== 1 ? 's' : ''} Found`
              : 'Search to Find Hospitals'}
          </Typography>

          {hospitals.length === 0 && !loading && (
            <Alert severity="info">
              No hospitals found yet. Enter a city name or use your current location to find
              cardiology hospitals nearby.
            </Alert>
          )}

          <Grid container spacing={3}>
            {hospitals.map((hospital) => (
              <Grid item xs={12} md={6} lg={4} key={hospital.id}>
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    {/* Hospital Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocalHospital
                        color="primary"
                        sx={{ mr: 2, fontSize: 28, flexShrink: 0 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {hospital.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Star sx={{ fontSize: 18, color: 'warning.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {hospital.rating}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                            {hospital.distance.toFixed(1)} km
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Location and Contact */}
                    <Box sx={{ mb: 2, pl: 4 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <strong>{hospital.city}, {hospital.state}</strong>
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        {hospital.address}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <Phone sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
                        <a href={`tel:${hospital.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {hospital.phone}
                        </a>
                      </Typography>
                      <Typography variant="body2">
                        <AccessTime sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
                        {hospital.hours}
                      </Typography>
                    </Box>

                    {/* Badges */}
                    <Box sx={{ mb: 2, pl: 4 }}>
                      {hospital.emergency && (
                        <StyledChip label="🚨 24/7 Emergency" size="small" color="error" />
                      )}
                      {hospital.hasCathLab && (
                        <StyledChip label="Cath Lab" size="small" variant="outlined" />
                      )}
                      {hospital.hasEcho && (
                        <StyledChip label="Echo" size="small" variant="outlined" />
                      )}
                    </Box>

                    {/* Specialties */}
                    <Box sx={{ mb: 3, pl: 4 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Specialties:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {hospital.specialties.map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1, pl: 4 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<Navigation />}
                        onClick={() => getDirections(hospital)}
                        sx={{ flex: 1 }}
                      >
                        Directions
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog(hospital)}
                        sx={{ flex: 1 }}
                      >
                        Details
                      </Button>
                      <IconButton
                        size="small"
                        href={`mailto:${hospital.email}`}
                        color="primary"
                      >
                        <Email sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        href={hospital.website}
                        target="_blank"
                        color="primary"
                      >
                        <Language sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Emergency Section */}
        <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
              🚨 Medical Emergency?
            </Typography>
            <Typography variant="body2">
              <strong>Call 112 (General Emergency) or 108 (Medical Emergency)</strong> for immediate
              medical assistance
            </Typography>
          </Alert>
        </Box>
      </Container>

      {/* Hospital Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedHospital && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6">{selectedHospital.name}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  📍 Location
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedHospital.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedHospital.city}, {selectedHospital.state}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  📞 Contact
                </Typography>
                <Typography variant="body2">
                  Phone:{' '}
                  <a href={`tel:${selectedHospital.phone}`} style={{ color: 'inherit' }}>
                    {selectedHospital.phone}
                  </a>
                </Typography>
                <Typography variant="body2">
                  Email:{' '}
                  <a href={`mailto:${selectedHospital.email}`} style={{ color: 'inherit' }}>
                    {selectedHospital.email}
                  </a>
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  🏥 Hospital Details
                </Typography>
                <Typography variant="body2">Beds: {selectedHospital.beds}</Typography>
                <Typography variant="body2">Doctors: {selectedHospital.doctors}</Typography>
                <Typography variant="body2">Hours: {selectedHospital.hours}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  🔬 Facilities
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {selectedHospital.hasCathLab && <Chip label="Cath Lab" size="small" />}
                  {selectedHospital.hasEcho && <Chip label="Echo Lab" size="small" />}
                  {selectedHospital.emergency && (
                    <Chip label="24/7 Emergency" size="small" color="error" />
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  getDirections(selectedHospital);
                  handleCloseDialog();
                }}
              >
                Get Directions
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ContactPageFixed;
