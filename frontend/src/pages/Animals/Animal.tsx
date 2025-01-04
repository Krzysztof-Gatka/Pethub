import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import ShelterLayout from '../../layouts/ShelterLayout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PetsIcon from '@mui/icons-material/Pets';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { useAuth } from '../../hooks/useAuth';
import { AnimalModel } from '../../components/shared/AnimalCard';
import { Walk } from '../../models/Walk';
import { getCurrentSqlDate } from '../../utils/dateUtils';
import WalkScheduler from '../../components/shared/WalkScheduler';

const GET_WALKS_API_URL = 'http://localhost:3000/api/animals/animal/walks';
const FOLLOW_API_URL = 'http://localhost:3000/api/follows/animal';

const Animal = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState<AnimalModel | null>(null);
  const { user, isLoggedIn } = useAuth();
  const [walks, setWalks] = useState<Walk[]>([]);
  const [isFollowed, setIsFollowed] = useState(false);
  const [openScheduler, setOpenScheduler] = useState(false);
  const navigate = useNavigate()

  const handleWalk = () => {
    setOpenScheduler(!openScheduler);
    console.log('handle walk');
  };

  const handleBookWalk = async () => {
    try {
      await axios.post('http://localhost:3000/api/animals/book-walk', {
        animalId: animal?.id,
        userId: user?.userId,
        date: getCurrentSqlDate(),
        timeSlot: '08:00:00',
      });
    } catch (err) {
      console.error('Error booking walk:', err);
    }
  };

  const handleFollow = async () => {
    if (!animal || !id) return;

    try {
      if (isFollowed) {
        await axios.delete(`${FOLLOW_API_URL}/delete`, {
          data: {
            userId: user?.userId,
            targetId: id,
            type: 'animal',
          },
        });
        setIsFollowed(false);
      } else {
        await axios.post(`${FOLLOW_API_URL}/add`, {
          userId: user?.userId,
          targetId: id,
          type: 'animal',
        });
        setIsFollowed(true);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      alert('Wystąpił problem z obserwowaniem zwierzęcia.');
    }
  };


  const handleAdopt = () => {
    console.log('handling adopt button');
    navigate(`/adopt/${id}`);
  };

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/animals/${id}`);
        setAnimal(response.data);
      } catch (err) {
        console.error('Error fetching animal data:', err);
      }
    };

    const fetchFollowStatus = async () => {
      try {
        const response = await axios.get(`${FOLLOW_API_URL}/${id}?userId=${user?.userId}`);
        setIsFollowed(response.data.followed);
      } catch (err) {
        console.error('Error fetching follow status:', err);
      }
    };

    fetchAnimal();
    if (isLoggedIn) {
      fetchFollowStatus();
    }
  }, [id, user, isLoggedIn]);

  if (!animal) {
    return <div>Ładowanie...</div>;
  }

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="500"
                image={animal.img_url || "/api/placeholder/800/500"}
                alt={animal.name}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {animal.name}
              </Typography>

              <Box sx={{ my: 2 }}>
                <Chip label={`Wiek: ${animal.age} lat`} sx={{ mr: 1, mb: 1 }} />
              </Box>

              <Typography variant="body1" paragraph>
                {animal.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 3, display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<PetsIcon />}
                  size="large"
                  onClick={handleAdopt}
                  disabled={!isLoggedIn}
                >
                  Adoptuj
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<DirectionsWalkIcon />}
                  size="large"
                  onClick={handleWalk}
                  disabled={!isLoggedIn}
                >
                  Umów spacer
                </Button>
                <Button
                  variant="outlined" // Używamy obrysu
                  fullWidth
                  startIcon={<FavoriteIcon />}
                  size="large"
                  onClick={handleFollow}
                  disabled={!isLoggedIn}
                  sx={{
                    color: isFollowed ? '#9c27b0' : 'primary.main', // Zmieniamy kolor tekstu
                    borderColor: isFollowed ? '#9c27b0' : 'primary.main', // Zmieniamy kolor obrysu
                    '&:hover': {
                      borderColor: isFollowed ? '#7b1fa2' : 'primary.dark', // Zmieniamy kolor obrysu na hover
                      color: isFollowed ? '#7b1fa2' : 'primary.dark', // Zmieniamy kolor tekstu na hover
                    },
                  }}
                >
                  {isFollowed ? 'Przestań obserwować' : 'Obserwuj'}
                </Button>

              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {openScheduler && (
        <WalkScheduler
          animalId={animal.id}
          open={openScheduler}
          onClose={() => setOpenScheduler(false)}
          user={user}
        />
      )}
    </ShelterLayout>
  );
};

export default Animal;
