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
import AnimalSearchFilters from '../../components/shared/AnimalSearchFilters';
import { AnimalFilters } from '../../models/Filters';

const Animals = () => {
  const [animals, setAnimals] = useState([]); // Lista zwierząt
  const [filteredAnimals, setFilteredAnimals] = useState([]); // Filtrowane zwierzęta
  const [shelters, setShelters] = useState([]); // Lista schronisk
  const [page, setPage] = useState(1); // Obecna strona
  const itemsPerPage = 6; // Ilość zwierząt na stronę
  const navigate = useNavigate();

  // Pobieranie zwierząt
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/animals');
        const fetchedAnimals = response.data;
        setAnimals(fetchedAnimals);
        setFilteredAnimals(fetchedAnimals); // Na początku wszystkie zwierzęta
      } catch (err) {
        console.error('Błąd podczas pobierania danych o zwierzętach:', err);
      }
    };

    fetchAnimals();
  }, []);

  // Pobieranie schronisk
  useEffect(() => {
    const fetchShelters = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/shelters');
        setShelters(response.data); // Ustawienie listy schronisk
      } catch (err) {
        console.error('Błąd podczas pobierania schronisk:', err);
      }
    };

    fetchShelters();
  }, []);

  // Obsługa zmiany filtrów
  const handleFilterChange = (filters: AnimalFilters) => {
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
      if (filters.shelter && animal.shelter_id !== Number(filters.shelter)) {
        return false;
      }
      return true;
    });

    setFilteredAnimals(filtered);
  };

  const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentAnimals = filteredAnimals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnimalDetails = (animalId) => {
    navigate(`/animals/${animalId}`);
  };

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Nagłówek */}
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
          <PetsIcon fontSize="large" />
          Dostępne Zwierzęta
        </Typography>

        {/* Filtry */}
        <AnimalSearchFilters 
          onFilterChange={handleFilterChange} 
          onPageReset={() => setPage(1)}
          shelters={shelters} // Przekazanie schronisk do filtrów
        />

        {/* Lista zwierząt */}
        <Grid container spacing={3}>
          {currentAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={animal.img_url || '/api/placeholder/400/300'}
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
                <Box sx={{ p: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    fullWidth
                    onClick={() => handleAnimalDetails(animal.id)}
                  >
                    Szczegóły
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Paginacja */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
