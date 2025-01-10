import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShelterLayout from '../../layouts/ShelterLayout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AnimalSearchFilters from '../../components/shared/AnimalSearchFilters';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Followed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [followedAnimals, setFollowedAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [followedShelters, setFollowedShelters] = useState([]);
  const [filteredShelters, setFilteredShelters] = useState([]);
  const [shelterSearchTerm, setShelterSearchTerm] = useState('');

  useEffect(() => {
    const fetchFollowedAnimals = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/follows/animals?userId=${user?.userId}`);
        const animalsWithAge = response.data.map((animal) => ({
          ...animal,
          age: animal.age || 'Nieznany',
        }));
        setFollowedAnimals(animalsWithAge);
        setFilteredAnimals(animalsWithAge);
      } catch (err) {
        console.error('Error fetching followed animals:', err);
      }
    };

    const fetchFollowedShelters = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/follows/shelters?userId=${user?.userId}`);
        const sheltersWithDefaults = response.data.map((shelter) => ({
          ...shelter,
          city: shelter.city || 'Nieznane',
          phone_number: shelter.phone_number || 'Nieznany',
          email: shelter.email || 'Nieznany',
        }));
        setFollowedShelters(sheltersWithDefaults);
        setFilteredShelters(sheltersWithDefaults);
      } catch (err) {
        console.error('Error fetching followed shelters:', err);
      }
    };

    if (user) {
      fetchFollowedAnimals();
      fetchFollowedShelters();
    }
  }, [user]);

  const handleAnimalFilterChange = (filters) => {
    const filtered = followedAnimals.filter((animal) => {
      if (filters.searchTerm && !animal.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.species && animal.type && animal.type.toLowerCase() !== filters.species.toLowerCase()) {
        return false;
      }
      if (filters.ageRange) {
        const age = animal.age === 'Nieznany' ? 0 : animal.age;
        if (
          (filters.ageRange === 'young' && age > 2) ||
          (filters.ageRange === 'adult' && (age < 3 || age > 7)) ||
          (filters.ageRange === 'senior' && age < 8)
        ) {
          return false;
        }
      }
      return true;
    });

    setFilteredAnimals(filtered);
  };

  const handleShelterSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setShelterSearchTerm(searchTerm);
    const filtered = followedShelters.filter((shelter) =>
      shelter.name.toLowerCase().includes(searchTerm)
    );
    setFilteredShelters(filtered);
  };

  const handleAnimalClick = (animalId) => {
    navigate(`/animals/${animalId}`);
  };

  const handleShelterClick = (shelterId) => {
    navigate(`/shelters/${shelterId}`);
  };

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <FavoriteIcon fontSize="large" />
          Obserwowane
        </Typography>

        {/* Zwierzęta */}
        <Typography variant="h5" component="h2" gutterBottom>
          Zwierzęta
        </Typography>
        <AnimalSearchFilters onFilterChange={handleAnimalFilterChange} shelters={[]} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {filteredAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card onClick={() => handleAnimalClick(animal.id)} sx={{ cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={animal.img_url || '/api/placeholder/400/300'}
                  alt={animal.name}
                />
                <CardContent>
                  <Typography variant="h6">{animal.name}</Typography>
                  <Typography>Wiek: {animal.age} lat</Typography>
                  <Typography>{animal.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Schroniska */}
        <Typography variant="h5" component="h2" gutterBottom>
          Schroniska
        </Typography>
        <TextField
          label="Szukaj schronisk"
          variant="outlined"
          fullWidth
          value={shelterSearchTerm}
          onChange={handleShelterSearchChange}
          sx={{ mb: 3 }}
        />
        <Grid container spacing={3}>
          {filteredShelters.map((shelter) => (
            <Grid item xs={12} sm={6} md={4} key={shelter.id}>
              <Card
                onClick={() => handleShelterClick(shelter.id)}
                sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
              >
                <CardContent>
                  <Typography variant="h6">{shelter.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>Miasto: {shelter.city}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>Telefon: {shelter.phone_number}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>Email: {shelter.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography>Opis: {shelter.description}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ShelterLayout>
  );
};

export default Followed;
