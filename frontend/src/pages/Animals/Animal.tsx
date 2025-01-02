import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const GET_WALKS_API_URL='http://localhost:3000/api/animals/animal/walks'
import WalkScheduler from '../../components/shared/WalkScheduler';

const Animal = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState<AnimalModel | null>(null);
  const { user, isLoggedIn } = useAuth();
  const [walks, setWalks] = useState<Walk[]>([])

  const handleWalk2 = async () => {
    console.log('handling walk button');
    console.log(user);
    const response = await axios.get(`${GET_WALKS_API_URL}?animalId=${id}`);
    setWalks(response.data)
  }
  
  const [openScheduler, setOpenScheduler] = useState(false);
  const handleWalk = () => {
    setOpenScheduler(true);
  };

  const handleBookWalk = async () => {
    console.log('handlingBookwalkbutton');
    try {
      await axios.post('http://localhost:3000/api/animals/book-walk', {
        animalId: animal?.id,
        userId: user?.userId,
        date: getCurrentSqlDate(),
        timeSlot: '08:00:00'
      })
    } catch (err) {
      console.log('err:', err)
    }
    
  }

  const handleFollow = () => {
    console.log('handling follow button');
  };

  const handleAdopt = () => {
    console.log('handling adopt button');
  };

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/animals/${id}`);
        console.log('Animal data:', response.data);
        setAnimal(response.data);
      } catch (err) {
        console.error('Błąd podczas pobierania danych:', err);
      }
    };

    fetchAnimal();
  }, [id]);

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
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<FavoriteIcon />}
                  size="large"
                  onClick={handleFollow}
                  disabled={!isLoggedIn}
                >
                  Obserwuj
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Box>
        <p>walks data</p>
        {walks.map(walk => 
        <p key={walk.id}> {walk.id} {walk.animal_id} {walk.user_id} {walk.date} {walk.time_slot} {walk.status} 
          </p>)}
        <Button onClick={handleBookWalk}>Book a walk at 12 8:00</Button>
      </Box>
      <WalkScheduler 
        animalId={animal.id}
        open={openScheduler}
        onClose={() => setOpenScheduler(false)}
      />
    </ShelterLayout>
  );
};

export default Animal;