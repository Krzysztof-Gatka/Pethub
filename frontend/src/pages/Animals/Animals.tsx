import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box,
  Pagination,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShelterLayout from '../../layouts/ShelterLayout';
import PetsIcon from '@mui/icons-material/Pets';




const Animals = () => {
  const [animals, setAnimals] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/animals');
        setAnimals(response.data);
      } catch (err) {
        console.error('Błąd podczas pobierania danych:', err);
      }
    };

    fetchAnimals();
  }, []);

  const totalPages = Math.ceil(animals.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentAnimals = animals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnimalDetails = (animalId) => {
    navigate(`/animals/${animalId}`);
  };
  const handleAdopt = (animalId) => {
    navigate(`/adopt/${animalId}`);
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
          <PetsIcon fontSize="large" />
          Dostępne Zwierzęta
        </Typography>

        <Grid container spacing={3}>
          {currentAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}>
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
                    Wiek: {animal.age} lat
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {animal.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    fullWidth
                    onClick={() => handleAnimalDetails(animal.id)}
                  >
                    Szczegóły
                  </Button>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => handleAdopt(animal.id)}
                  >
                    Adoptuj
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 4 
          }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </ShelterLayout>
  );
};

export default Animals;