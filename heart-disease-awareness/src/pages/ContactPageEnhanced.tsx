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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
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
  Settings,
  MyLocation,
  Public,
  CloudDownload,
  GpsFixed,
  Language,
  Refresh,
} from '@mui/icons-material';
import { 
  searchHospitalsByCoords, 
  searchHospitalsByCity, 
  getSupportedCities,
  getCityCoordinates,
  calculateDistance,
  Hospital,
  SearchResult 
} from '../services/enhancedHospitalService';

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

const ContactPageEnhanced: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchRadius, setSearchRadius] = useState(100); // Default 100km radius
  const [selectedAPI, setSelectedAPI] = useState('overpass'); // API selection
  const [cityCoords, setCityCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [supportedCities, setSupportedCities] = useState<string[]>([]);

  useEffect(() => {
    // Load supported cities on mount
    const cities = getSupportedCities();
    setSupportedCities(cities.sort());
    
    // Load default hospitals for Delhi
    loadDefaultHospitals();
  }, []);

  useEffect(() => {
    // Initialize Google Maps when tab changes to map view
    if (tabValue === 2 && hospitals.length > 0) {
      initializeMap();
    }
  }, [tabValue, hospitals]);

  const loadDefaultHospitals = async () => {
    try {
      setLoading(true);
      const result = await searchHospitalsByCity('Delhi', searchRadius);
      setHospitals(result.hospitals);
      setSearchResult(result);
    } catch (err) {
      setError('Failed to load hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    // Load Google Maps API
    const mapScript = document.createElement('script');
    mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyBu5nZKbeK93tDIVjXwGdTuWg_60CTz7Ew'}&libraries=places,geometry`;
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
    const centerLat = userLocation ? userLocation.lat : hospitals.reduce((sum, h) => sum + h.lat, 0) / hospitals.length;
    const centerLng = userLocation ? userLocation.lng : hospitals.reduce((sum, h) => sum + h.lng, 0) / hospitals.length;

    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    const map = new window.google.maps.Map(mapElement, {
      zoom: userLocation ? 12 : 10,
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
            <p style="margin: 4px 0; color: #666; font-size: 12px;">${hospital.address}</p>
            ${hospital.phone ? `<p style="margin: 4px 0; color: #666; font-size: 12px;">📞 ${hospital.phone}</p>` : ''}
            ${hospital.emergency ? '<p style="margin: 4px 0; color: #f44336; font-size: 12px; font-weight: bold;">🚨 24/7 Emergency</p>' : ''}
            ${hospital.source ? `<p style="margin: 8px 0 0 0; color: #999; font-size: 10px;">📊 Source: ${hospital.source}</p>` : ''}
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

  const handleCitySearch = async () => {
    if (!searchInput.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await searchHospitalsByCity(searchInput, searchRadius);
      setHospitals(result.hospitals);
      setSearchResult(result);
      const coords = getCityCoordinates(searchInput);
      setCityCoords(coords);
    } catch (err) {
      setError('Failed to search hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError('');

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          try {
            const result = await searchHospitalsByCoords(latitude, longitude, searchRadius);
            setHospitals(result.hospitals);
            setSearchResult(result);
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

  const handleRadiusChange = (event: Event, value: number | number[]) => {
    const newRadius = Array.isArray(value) ? value[0] : value;
    setSearchRadius(newRadius);
  };

  const handleAPIChange = (event: any) => {
    setSelectedAPI(event.target.value as string);
  };

  const filteredHospitals = hospitals.filter(hospital => 
    hospital.specialties?.some(specialty => 
      specialty.toLowerCase().includes('cardiac') || 
      specialty.toLowerCase().includes('heart') ||
      specialty.toLowerCase().includes('cardiology')
    )
  );

  const cardiacHospitals = hospitals.filter(hospital => 
    hospital.specialties?.some(specialty => 
      specialty.toLowerCase().includes('cardiac') || 
      specialty.toLowerCase().includes('heart') ||
      specialty.toLowerCase().includes('cardiology')
    )
  );

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Searching hospitals...
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" color="primary" gutterBottom>
            🗺️ Enhanced Real-time Hospital Search
          </Typography>
          <Typography variant="h5" color="text.secondary">
            100km radius • Multiple APIs • Global Coverage
          </Typography>
        </Box>

        {/* Search Controls */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Search Hospitals
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Search by city name or use your current location for exact positioning
          </Typography>
          
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter City Name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g., Delhi, Mumbai, Bengaluru, Magadi..."
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleCitySearch}
                disabled={loading}
                startIcon={<Search />}
                sx={{ height: '56px' }}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search City'}
              </Button>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCurrentLocation}
                disabled={loading}
                startIcon={<MyLocation />}
                sx={{ height: '56px' }}
                fullWidth
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Use My Location'}
              </Button>
            </Grid>
          </Grid>

          {/* Enhanced Controls */}
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<Settings />}>
              Advanced Search Options
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Search Radius</InputLabel>
                    <Slider
                      value={searchRadius}
                      onChange={handleRadiusChange}
                      min={10}
                      max={200}
                      step={10}
                      valueLabelDisplay="on"
                      marks={[
                        { value: 10, label: '10km' },
                        { value: 25, label: '25km' },
                        { value: 50, label: '50km' },
                        { value: 100, label: '100km' },
                        { value: 200, label: '200km' }
                      ]}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Current: {searchRadius}km radius
                    </Typography>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Data Source API</InputLabel>
                    <Select
                      value={selectedAPI}
                      onChange={handleAPIChange}
                      fullWidth
                    >
                      <MenuItem value="overpass">OpenStreetMap Overpass (Free)</MenuItem>
                      <MenuItem value="mapbox">Mapbox Geocoding (50k/month)</MenuItem>
                      <MenuItem value="here">HERE Places (100k/month)</MenuItem>
                      <MenuItem value="nominatim">OpenStreetMap Nominatim (Free)</MenuItem>
                      <MenuItem value="photon">Photon API (Free)</MenuItem>
                    </Select>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Current: {selectedAPI}
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {searchResult && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                📊 Found {searchResult.total} hospitals in {searchResult.city} using {searchResult.source}
                {searchRadius > 50 && ' (enhanced radius)'}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Results Display */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Hospitals ({filteredHospitals.length} cardiac specialists found)
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {userLocation ? `Searching within ${searchRadius}km of your location` : `Showing results for ${searchInput || 'Delhi'}`}
          </Typography>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 4 }}>
          <Tab label="List View" />
          <Tab label={`Cardiac Specialists (${cardiacHospitals.length})`} />
          <Tab label="Map View" />
          <Tab label={`All Hospitals (${hospitals.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {filteredHospitals.map((hospital) => (
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
                        {hospital.hours || 'Not specified'}
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
                        onClick={() => getDirections(hospital)}
                        sx={{ flex: 1 }}
                      >
                        Directions
                      </Button>
                      <Tooltip title="View Details">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openHospitalDetails(hospital)}
                        >
                          <FilterList />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {cardiacHospitals.map((hospital) => (
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
                          label="Cardiac Specialist"
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
                textAlign: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                p: 4,
                borderRadius: 2
              }}>
                <Typography variant="h6" color="text.secondary">
                  Search for hospitals to see them on the map
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
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
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Address" 
                      secondary={selectedHospital.address} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Phone" 
                      secondary={selectedHospital.phone || 'Not available'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AccessTime color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Hours" 
                      secondary={selectedHospital.hours || 'Not specified'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Star color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Rating" 
                      secondary={selectedHospital.rating ? `${selectedHospital.rating} / 5.0` : 'No rating'} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Public color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Specialties" 
                      secondary={(selectedHospital.specialties || ['General']).join(', ')} 
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CloudDownload color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Data Source" 
                      secondary={selectedHospital.source || 'Unknown'} 
                    />
                  </ListItem>
                  
                  {selectedHospital.distance && (
                    <ListItem>
                      <ListItemIcon>
                        <GpsFixed color="primary" />
                      </ListItemIcon>
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
            <Button onClick={closeDialog}>
              Close
            </Button>
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

export default ContactPageEnhanced;
