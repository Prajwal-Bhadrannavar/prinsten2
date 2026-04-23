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
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
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
  LocalHospital,
  Map as MapIcon,
  FilterList,
} from '@mui/icons-material';
import { 
  searchHospitalsByCity, 
  searchHospitalsByCoords, 
  getSupportedCities,
  calculateDistance,
  Hospital,
  SearchResult 
} from '../services/hospitalService';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[12],
  },
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ContactPageRealtime: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [supportedCities] = useState<string[]>(getSupportedCities());

  useEffect(() => {
    // Load default hospitals for Delhi on mount
    loadDefaultHospitals();
  }, []);

  useEffect(() => {
    // Initialize Google Maps when tab changes to map view
    if (tabValue === 2 && hospitals.length > 0) {
      initializeMap();
    }
  }, [tabValue, hospitals]);

  const initializeMap = () => {
    // Load Google Maps API
    const mapScript = document.createElement('script');
    mapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBu5nZKbeK93tDIVjXwGdTuWg_60CTz7Ew&libraries=places,geometry`;
    mapScript.async = true;
    mapScript.defer = true;
    mapScript.onload = () => {
      if (window.google && window.google.maps) {
        renderMap();
      }
    };
    document.head.appendChild(mapScript);
  };

  const renderMap = () => {
    if (!window.google || !window.google.maps || hospitals.length === 0) return;

    // Calculate center point
    const centerLat = hospitals.reduce((sum, h) => sum + h.lat, 0) / hospitals.length;
    const centerLng = hospitals.reduce((sum, h) => sum + h.lng, 0) / hospitals.length;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    const map = new window.google.maps.Map(mapElement, {
      zoom: 11,
      center: { lat: centerLat, lng: centerLng },
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    // Add markers for hospitals
    hospitals.forEach((hospital) => {
      const marker = new window.google.maps.Marker({
        position: { lat: hospital.lat, lng: hospital.lng },
        map: map,
        title: hospital.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#f44336" stroke="#fff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">H</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${hospital.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">${hospital.address}</p>
            ${hospital.phone ? `<p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">📞 ${hospital.phone}</p>` : ''}
            ${hospital.emergency ? '<p style="margin: 0; color: #f44336; font-size: 12px; font-weight: bold;">🚨 24/7 Emergency</p>' : ''}
            <div style="margin-top: 8px;">
              <a href="tel:${hospital.phone || ''}" style="margin-right: 8px; color: #1976d2; text-decoration: none;">Call</a>
              <a href="https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}" style="color: #1976d2; text-decoration: none;">Directions</a>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });

    // Add user location marker if available
    if (userLocation) {
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" fill="#4285f4" stroke="#fff" stroke-width="2"/>
              <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Y</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });
    }
  };

  const loadDefaultHospitals = async () => {
    try {
      setLoading(true);
      const result = await searchHospitalsByCity('Delhi');
      setHospitals(result.hospitals);
      setSearchResult(result);
    } catch (err) {
      setError('Failed to load hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await searchHospitalsByCity(searchInput);
      setHospitals(result.hospitals);
      setSearchResult(result);
      setSelectedCity(searchInput);
      
      if (result.hospitals.length === 0) {
        setError(`No hospitals found in ${searchInput}. Try a different city.`);
      }
    } catch (err) {
      setError('Failed to fetch hospitals. Please try again.');
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
          
          try {
            const result = await searchHospitalsByCoords(latitude, longitude, 20);
            setHospitals(result.hospitals);
            setSearchResult(result);
            setSelectedCity('Current Location');
            
            if (result.hospitals.length === 0) {
              setError('No hospitals found near your location. Try searching by city.');
            }
          } catch (err) {
            setError('Failed to fetch nearby hospitals. Please try again.');
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          setError('Unable to get your location. Please search by city instead.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const getDirections = (hospital: Hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.lat},${hospital.lng}`;
      window.open(url, '_blank');
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`;
      window.open(url, '_blank');
    }
  };

  const openHospitalDetails = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedHospital(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredHospitals = hospitals.filter(hospital => 
    hospital.specialties?.some(specialty => 
      specialty.toLowerCase().includes('cardiac') || 
      specialty.toLowerCase().includes('heart') ||
      specialty.toLowerCase().includes('cardiology')
    )
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" color="primary" gutterBottom>
            Find Heart Hospitals Near You
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Real-time hospital search across all cities in India
          </Typography>
        </Box>

        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Search Hospitals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Search by city name or use your current location
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Autocomplete
                freeSolo
                options={supportedCities}
                value={searchInput}
                onChange={(event, newValue) => setSearchInput(newValue || '')}
                inputValue={searchInput}
                onInputChange={(event, newInputValue) => setSearchInput(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Enter City Name"
                    placeholder="e.g., Delhi, Mumbai, Bangalore..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCitySearch}
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
                  Current
                </Button>
              </Box>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {searchResult && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Found {searchResult.total} hospitals in {searchResult.city}
              </Typography>
            </Box>
          )}
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Hospitals ({filteredHospitals.length} heart specialists)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {selectedCity ? `Showing results for ${selectedCity}` : 'Showing default results'}
          </Typography>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="List View" />
          <Tab label={`Heart Specialists (${filteredHospitals.length})`} />
          <Tab label="Map View" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {hospitals.map((hospital) => (
              <Grid item xs={12} md={6} lg={4} key={hospital.id}>
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocalHospital color="primary" sx={{ mr: 2, fontSize: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {hospital.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {hospital.rating ? `${hospital.rating} ⭐` : 'No rating'} 
                            {hospital.distance && ` • ${hospital.distance.toFixed(1)} km away`}
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
                      {hospital.phone && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <Phone sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          {hospital.phone}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        {hospital.hours || 'Hours not specified'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Specialties:
                      </Typography>
                      <Box sx={{ flexWrap: 'wrap', display: 'flex' }}>
                        {(hospital.specialties || ['General']).map((specialty, index) => (
                          <Chip
                            key={index}
                            label={specialty}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {hospital.phone && (
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
                      )}
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Navigation />}
                        onClick={() => getDirections(hospital)}
                        sx={{ flex: 1 }}
                      >
                        Directions
                      </Button>
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        onClick={() => openHospitalDetails(hospital)}
                      >
                        Details
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {filteredHospitals.map((hospital) => (
              <Grid item xs={12} md={6} lg={4} key={hospital.id}>
                <StyledCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocalHospital color="error" sx={{ mr: 2, fontSize: 32 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {hospital.name}
                        </Typography>
                        <Chip
                          label="Heart Specialist"
                          size="small"
                          color="error"
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Star color="warning" sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" color="text.secondary">
                            {hospital.rating ? `${hospital.rating} ⭐` : 'No rating'} 
                            {hospital.distance && ` • ${hospital.distance.toFixed(1)} km away`}
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
                      {hospital.phone && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <Phone sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                          {hospital.phone}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                      {hospital.phone && (
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
                      )}
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Navigation />}
                        onClick={() => getDirections(hospital)}
                        sx={{ flex: 1 }}
                      >
                        Directions
                      </Button>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ height: '600px', width: '100%', position: 'relative' }}>
            <div id="map" style={{ height: '100%', width: '100%', borderRadius: '8px' }}></div>
            {hospitals.length === 0 && (
              <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <Typography variant="h6" color="text.secondary">
                  Search for hospitals to see them on the map
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Hospital Details Dialog */}
        <Dialog open={openDialog} onClose={closeDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h5">
              {selectedHospital?.name}
            </Typography>
          </DialogTitle>
          <DialogContent>
            {selectedHospital && (
              <Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                  {selectedHospital.address}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <List>
                  {selectedHospital.phone && (
                    <ListItem>
                      <ListItemText
                        primary="Phone"
                        secondary={selectedHospital.phone}
                      />
                    </ListItem>
                  )}
                  {selectedHospital.website && (
                    <ListItem>
                      <ListItemText
                        primary="Website"
                        secondary={selectedHospital.website}
                      />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText
                      primary="Hours"
                      secondary={selectedHospital.hours || 'Not specified'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emergency Services"
                      secondary={selectedHospital.emergency ? 'Available 24/7' : 'Not available'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Specialties"
                      secondary={selectedHospital.specialties?.join(', ') || 'General'}
                    />
                  </ListItem>
                  {selectedHospital.rating && (
                    <ListItem>
                      <ListItemText
                        primary="Rating"
                        secondary={`${selectedHospital.rating} / 5.0`}
                      />
                    </ListItem>
                  )}
                  {selectedHospital.distance && (
                    <ListItem>
                      <ListItemText
                        primary="Distance"
                        secondary={`${selectedHospital.distance.toFixed(1)} km`}
                      />
                    </ListItem>
                  )}
                </List>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
            {selectedHospital?.phone && (
              <Button
                variant="contained"
                color="primary"
                href={`tel:${selectedHospital.phone}`}
                startIcon={<Phone />}
              >
                Call Hospital
              </Button>
            )}
            {selectedHospital && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => getDirections(selectedHospital)}
                startIcon={<Navigation />}
              >
                Get Directions
              </Button>
            )}
          </DialogActions>
        </Dialog>

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

export default ContactPageRealtime;
