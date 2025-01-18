import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import DefaultLayout from '../layouts/DefaultLayout';
import { 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Alert, 
  AlertTitle,
  Box,
  Typography,
  CircularProgress,
  Container,
  Grid
} from '@mui/material';

const ShelterProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    city: '',
    street: '',
    postal_code: '',
    building: '',
    description: '',
    phone_number: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for user:', user?.userId);
        const response = await axios.get(`http://localhost:3000/api/profile?id=${user?.userId}`, {
          withCredentials: true
        });
        console.log('Profile data received:', response.data);
        setProfileData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Nie udało się załadować danych profilu');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
  
    try {
      // Przygotowanie danych do wysłania
      const dataToSend = {
        shelter_id: user?.userId ?? null,
        name: profileData.name ?? null,
        city: profileData.city ?? null,
        street: profileData.street ?? null,
        postal_code: profileData.postal_code ?? null,
        building: profileData.building ?? null,
        description: profileData.description || null,
        phone_number: profileData.phone_number || null
      };
  
      console.log('Data being sent to server:', dataToSend);
  
      const response = await axios.put('http://localhost:3000/api/profile', dataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Server response:', response.data);
      setSuccess('Profil został zaktualizowany');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err.response?.data);
      setError(err.response?.data?.error || 'Nie udało się zaktualizować profilu');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  if (loading) {
    return (
      <DefaultLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profil Schroniska
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Błąd</AlertTitle>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Sukces</AlertTitle>
              {success}
            </Alert>
          )}

          <Card>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Nazwa schroniska */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nazwa schroniska"
                      value={profileData.name || ''}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      required
                    />
                  </Grid>

                  {/* Telefon */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      value={profileData.phone_number || ''}
                      onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                      disabled={!isEditing}
                    />
                  </Grid>

                  {/* Miasto */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Miasto"
                      value={profileData.city || ''}
                      onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                      disabled={!isEditing}
                      required
                    />
                  </Grid>

                  {/* Ulica */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ulica"
                      value={profileData.street || ''}
                      onChange={(e) => setProfileData({...profileData, street: e.target.value})}
                      disabled={!isEditing}
                      required
                    />
                  </Grid>

                  {/* Kod pocztowy */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Kod pocztowy"
                      value={profileData.postal_code || ''}
                      onChange={(e) => setProfileData({...profileData, postal_code: e.target.value})}
                      disabled={!isEditing}
                      required
                    />
                  </Grid>

                  {/* Numer budynku */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Numer budynku"
                      value={profileData.building || ''}
                      onChange={(e) => setProfileData({...profileData, building: e.target.value})}
                      disabled={!isEditing}
                      required
                    />
                  </Grid>

                  {/* Opis */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Opis schroniska"
                      value={profileData.description || ''}
                      onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                      disabled={!isEditing}
                      multiline
                      rows={4}
                    />
                  </Grid>

                  {/* Przyciski akcji */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                      {isEditing ? (
                        <>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setIsEditing(false)}
                          >
                            Anuluj
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                          >
                            Zapisz zmiany
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => setIsEditing(true)}
                        >
                          Edytuj profil
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </DefaultLayout>
  );
};

export default ShelterProfilePage;