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
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShelterLayout from '../../layouts/ShelterLayout';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Followed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [followedAnimals, setFollowedAnimals] = useState([]);
  const [followedShelters, setFollowedShelters] = useState([]);

  useEffect(() => {
    const fetchFollowedAnimals = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/follows/animals?userId=${user?.userId}`);
        setFollowedAnimals(response.data);
      } catch (err) {
        console.error('Error fetching followed animals:', err);
      }
    };

    const fetchFollowedShelters = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/follows/shelters?userId=${user?.userId}`);
        setFollowedShelters(response.data);
      } catch (err) {
        console.error('Error fetching followed shelters:', err);
      }
    };

    if (user) {
      fetchFollowedAnimals();
      fetchFollowedShelters();
    }
  }, [user]);

  const handleAnimalClick = (animalId: number) => {
    navigate(`/animals/${animalId}`);
  };

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          textAlign: 'center',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <FavoriteIcon fontSize="large" />
          Obserwowane
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          Zwierzęta
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {followedAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleAnimalClick(animal.id)} 
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={animal.img_url || "/api/placeholder/400/300"}
                  alt={animal.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {animal.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {animal.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" component="h2" gutterBottom>
          Schroniska
        </Typography>
        <Grid container spacing={3}>
          {followedShelters.map((shelter) => (
            <Grid item xs={12} sm={6} md={4} key={shelter.id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {shelter.organization_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Adres: {shelter.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Telefon: {shelter.phone_number}
                  </Typography>
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
