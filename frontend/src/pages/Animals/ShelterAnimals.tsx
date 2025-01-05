import React, { useEffect, useState } from 'react'
import ShelterLayout from '../../layouts/ShelterLayout'
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
import { useAuth } from '../../hooks/useAuth';
import PetsIcon from '@mui/icons-material/Pets';
import AnimalSearchFilters from '../../components/shared/AnimalSearchFilters';
import { AnimalFilters } from '../../models/Filters';
import { useNavigate } from 'react-router-dom';



const ShelterAnimals =  () => {
    const {user} = useAuth();
    const [animals, setAnimals] = useState([]);
    const [filteredAnimals, setFilteredAnimals] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnimals = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/api/animals/shelter?id=${user.userId}`);
            const fetchedAnimals = response.data;
            setAnimals(fetchedAnimals);
            setFilteredAnimals(fetchedAnimals);
          } catch (err) {
            console.error('Błąd podczas pobierania danych:', err);
          }
        };
    
        fetchAnimals();
      }, [user?.userId]);

      const handleFilterChange = (filters: AnimalFilters) => {
          let filtered = animals.filter((animal) => {
            if (filters.searchTerm && !animal.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
              return false;
            }
            if (filters.category && animal.category !== filters.category) {
              return false;
            }
            if (filters.species && animal.species !== filters.species) {
              return false;
            }
            if (filters.shelter && animal.shelter_id !== filters.shelter) {
              return false;
            }
            const age = parseInt(animal.age);
            if (filters.ageRange && (age < filters.ageRange[0] || age > filters.ageRange[1])) {
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
            navigate(`/shelter/animals/${animalId}`);
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
          Twoje Zwierzęta
        </Typography>
        <Button onClick={() => navigate('/shelter/animals/add')}>
            Dodaj Profil
        </Button>

        <AnimalSearchFilters 
          onFilterChange={handleFilterChange} 
          shelters={[]} // Tu należy dodać listę schronisk
        />

        <Grid container spacing={3}>
          {currentAnimals.map((animal) => (
            <Grid item xs={12} sm={6} md={4} key={animal.animal_id}>
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
                    onClick={() => handleAnimalDetails(animal.animal_id)}
                  >
                    Szczegóły
                  </Button>
                  {/* <Button 
                    size="small" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => handleAdopt(animal.id)}
                  >
                    Adoptuj
                  </Button> */}
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
  )
}

export default ShelterAnimals
