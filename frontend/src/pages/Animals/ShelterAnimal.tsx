import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ShelterLayout from '../../layouts/ShelterLayout';

const ShelterAnimal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [walks, setWalks] = useState([]);
  const [adoptions, setAdoptions] = useState([]);
  const [showWalks, setShowWalks] = useState(false);
  const [showAdoptions, setShowAdoptions] = useState(false);

  useEffect(() => {
    const fetchAnimalData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/animals/${id}`);
        setAnimal(response.data);
      } catch (error) {
        console.error('Error fetching animal:', error);
      }
    };

    const fetchWalks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/walks/animal/${id}`);
        setWalks(response.data);
      } catch (error) {
        console.error('Error fetching walks:', error);
      }
    };

    const fetchAdoptions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/adoptions/animal/${id}`);
        setAdoptions(response.data);
      } catch (error) {
        console.error('Error fetching adoptions:', error);
      }
    };

    fetchAnimalData();
    fetchWalks();
    fetchAdoptions();
  }, [id]);

  const toggleWalks = () => {
    setShowWalks(!showWalks);
    setShowAdoptions(false);
  };

  const toggleAdoptions = () => {
    setShowAdoptions(!showAdoptions);
    setShowWalks(false);
  };

  const handleEditAnimal = () => {
    navigate(`/shelter/animals`);
  };

  if (!animal) {
    return <div>Ładowanie...</div>;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pl-PL', options);
  };

  const formatTime = (timeString) => {
    const time = String(timeString).padStart(4, '0'); // Upewnij się, że ciąg ma co najmniej 4 cyfry
    const hours = time.slice(2); // Pierwsze dwie cyfry to godziny
    const minutes = time.slice(0, 2); // Ostatnie dwie cyfry to minuty
    return `${hours}:${minutes}`; // Zwróć w formacie "hh:mm"
  };
  
  

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="500"
                image={animal.img_url || '/api/placeholder/800/500'}
                alt={animal.name}
                sx={{ objectFit: 'contain' }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h4">{animal.name}</Typography>
              <Box sx={{ my: 2 }}>
                <Chip label={`Wiek: ${animal.age} lat`} sx={{ mr: 1, mb: 1 }} />
                <Chip label={`Rasa: ${animal.breed}`} sx={{ mr: 1, mb: 1 }} />
                <Chip label={`Dołączono: ${formatDate(animal.date_joined)}`} sx={{ mr: 1, mb: 1 }} />
              </Box>
              <Typography>{animal.description}</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                <Button variant="contained" onClick={toggleAdoptions}>
                  Zaplanowane Adopcje
                </Button>
                <Button variant="outlined" onClick={toggleWalks}>
                  Zaplanowane Spacery
                </Button>
                <Button variant="contained" color="primary" onClick={handleEditAnimal}>
                  Edytuj Zwierzaka
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {showWalks && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Zaplanowane spacery</Typography>
            <List>
              {walks.map((walk) => {
                const formattedDate = walk.date ? formatDate(walk.date) : 'Nieznana data';
                const formattedTime = walk.time_slot ? formatTime(walk.time_slot) : 'Nieznana godzina';
                return (
                  <ListItem key={walk.id}>
                    <ListItemText primary={`Data: ${formattedDate}, Godzina: ${formattedTime}`} />
                  </ListItem>
                );
              })}
              {walks.length === 0 && <Typography>Brak zaplanowanych spacerów.</Typography>}
            </List>
          </Box>
        )}

        {showAdoptions && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Zaplanowane adopcje</Typography>
            <List>
              {adoptions.map((adoption) => (
                <ListItem key={adoption.id}>
                  <ListItemText
                    primary={`Data: ${formatDate(adoption.date)}, Status: ${adoption.status}`}
                  />
                </ListItem>
              ))}
              {adoptions.length === 0 && <Typography>Brak zaplanowanych adopcji.</Typography>}
            </List>
          </Box>
        )}
      </Container>
    </ShelterLayout>
  );
};

export default ShelterAnimal;
