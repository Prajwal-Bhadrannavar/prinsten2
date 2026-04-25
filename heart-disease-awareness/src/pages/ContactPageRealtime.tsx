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
  LocalHospital,
} from '@mui/icons-material';
import { 
  searchHospitalsByCity, 
  searchHospitalsByCoords, 
  getSupportedCities,
  isHeartSpecialistHospital,
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
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [supportedCities] = useState<string[]>(getSupportedCities());

  useEffect(() => {
    // Load default hospitals for Delhi on mount
    loadDefaultHospitals();
  }, []);

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
    const destination = `${hospital.lat},${hospital.lng}`;
    const destinationFallbackQuery = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
    const originPart = userLocation ? `&origin=${userLocation.lat},${userLocation.lng}` : '';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}${originPart}&travelmode=driving`;

    // Open precise coordinates-based destination first.
    // If browser blocks it for any reason, query by hospital name/address.
    const opened = window.open(url, '_blank');
    if (!opened) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${destinationFallbackQuery}`, '_blank');
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

  const filteredHospitals = hospitals.filter(isHeartSpecialistHospital);

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

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">
            All Hospitals
          </Typography>
        </Box>
        <TabPanel value={0} index={0}>
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

        <Box sx={{ mt: 6, mb: 3 }}>
          <Typography variant="h6">
            Heart Specialists ({filteredHospitals.length})
          </Typography>
        </Box>
        <TabPanel value={1} index={1}>
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
