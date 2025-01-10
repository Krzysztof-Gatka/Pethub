import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Button,
  Collapse
} from '@mui/material';
import Navbar from '../../components/Navbar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PetsIcon from '@mui/icons-material/Pets';
import { ShelterModel } from '../../models/Shelter';
import AnimalSearchFilters from '../../components/shared/AnimalSearchFilters';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';

const FOLLOW_SHELTER_API_URL = 'http://localhost:3000/api/follows/shelter';

const Shelter = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [shelter, setShelter] = useState<ShelterModel | null>(null);
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [showAnimals, setShowAnimals] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const fetchAnimals = async () => {
    const response = await axios.get(`http://localhost:3000/api/animals/shelter?id=${Number(id)}`);
    const animals = response.data.map((animal: any) => ({
      ...animal,
      age: Math.floor((new Date().getTime() - new Date(animal.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 365.25)), // Obliczanie wieku
    }));
    setAnimals(animals);
    setFilteredAnimals(animals);
  };

  const fetchShelter = async () => {
    const response = await axios.get(`http://localhost:3000/api/shelter/profile?id=${Number(id)}`);
    const shelter = response.data;
    setShelter(shelter);
  };

  const fetchFollowStatus = async () => {
    try {
      if (user) {
        const response = await axios.get(`${FOLLOW_SHELTER_API_URL}/${id}?userId=${user.userId}`);
        setIsFollowed(response.data.followed); // Ustawia stan na podstawie odpowiedzi API
      }
    } catch (err) {
      console.error('Error fetching follow status:', err);
    }
  };

  const handleFollowShelter = async () => {
    try {
      if (isFollowed) {
        await axios.delete(`${FOLLOW_SHELTER_API_URL}/delete`, {
          data: { userId: user?.userId, targetId: id },
        });
        setIsFollowed(false);
      } else {
        await axios.post(`${FOLLOW_SHELTER_API_URL}/add`, {
          userId: user?.userId,
          targetId: id,
        });
        setIsFollowed(true);
      }
    } catch (err) {
      console.error('Error toggling follow status:', err);
    }
  };

  const handleFilterChange = (filters) => {
    const filtered = animals.filter((animal) => {
      if (filters.searchTerm && !animal.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.species && animal.type !== filters.species) {
        return false;
      }
      if (filters.ageRange) {
        const age = parseInt(animal.age, 10);
        if (
          (filters.ageRange === 'young' && (age < 0 || age > 2)) ||
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

  const handleShowAnimals = () => {
    setShowAnimals(!showAnimals);
  };

  useEffect(() => {
    fetchShelter();
    fetchAnimals();
    if (isLoggedIn) fetchFollowStatus(); // Upewnij się, że status obserwacji jest sprawdzany
  }, [id, isLoggedIn]);

  if (!shelter) return null;

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Typography variant="h4" component="h1">
              {shelter.name}
            </Typography>
            {isLoggedIn && (
              <Button
                        variant="outlined"
                        startIcon={<FavoriteIcon />}
                        size="large"
                        onClick={handleFollowShelter}
                        sx={{
                          color: isFollowed ? '#9c27b0' : 'primary.main',
                          borderColor: isFollowed ? '#9c27b0' : 'primary.main',
                          '&:hover': {
                            borderColor: isFollowed ? '#7b1fa2' : 'primary.dark',
                            color: isFollowed ? '#7b1fa2' : 'primary.dark',
                          },
                        }}
                      >
                        {isFollowed ? 'Przestań obserwować' : 'Obserwuj'}
                      </Button>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>
                  {`${shelter.street} ${shelter.building}, ${shelter.postal_code} ${shelter.city}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>{shelter.phone_number}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>{shelter.email}</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 4 }}>
                {shelter.description}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={handleShowAnimals}
            startIcon={<PetsIcon />}
            fullWidth
          >
            {showAnimals ? 'Ukryj zwierzęta' : 'Pokaż dostępne zwierzęta'}
          </Button>
        </Paper>

        <Collapse in={showAnimals}>
          <AnimalSearchFilters 
            onFilterChange={handleFilterChange} 
            shelters={[]} // No shelter filtering here
            hideShelterFilter={true} // Ukrywa pole schroniska
          />
          <Grid container spacing={3}>
            {filteredAnimals.map((animal) => (
              <Grid item xs={12} sm={6} md={4} key={animal.id}>
                <Box 
                  sx={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    transition: 'transform 0.2s', 
                    '&:hover': { transform: 'scale(1.05)' } 
                  }}
                >
                  {animal.img_url && (
                    <img 
                      src={animal.img_url} 
                      alt={animal.name} 
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {animal.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {animal.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Wiek: {animal.age} lat
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/animals/${animal.animal_id}`)}
                      sx={{ mt: 1 }}
                    >
                      Szczegóły
                    </Button>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Container>
    </>
  );
};

export default Shelter;
