import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Pagination
} from '@mui/material';
import Navbar from '../../components/Navbar';
import ShelterCard from '../../components/shared/ShelterCard';
import ShelterSearchFilters from '../../components/shared/ShelterSearchFilters';
import { ShelterModel } from '../../models/Shelter';
import { ShelterFilters } from '../../models/Filters';
import HomeIcon from '@mui/icons-material/Home';

const Shelters = () => {
  const [shelters, setShelters] = useState<ShelterModel[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<ShelterModel[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch shelters from the backend
  const fetchShelters = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/shelter/profiles', {
        responseType: 'json', // Wymuszenie JSON
    });
    console.log('Dane z backendu (surowe):', response.data); // Debug surowych danych
      setShelters(response.data);
      setFilteredShelters(response.data);
    } catch (error) {
      console.error('Błąd podczas pobierania danych schronisk:', error);
    }
  };

  // Handle filtering
  const handleFilterChange = (filters: ShelterFilters) => {
    const filtered = shelters.filter((shelter) => {
      if (filters.searchTerm && !shelter.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.city && !shelter.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      return true;
    });
    setFilteredShelters(filtered);
  };

  // Handle pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch shelters on component mount
  useEffect(() => {
    fetchShelters();
  }, []);

  const totalPages = Math.ceil(filteredShelters.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentShelters = filteredShelters.slice(startIndex, startIndex + itemsPerPage);

  // Extract unique cities for filtering
  const cities = [...new Set(shelters.map((shelter) => shelter.city))];

  return (
    <>
      <Navbar />
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
          <HomeIcon fontSize="large" />
          Dostępne Schroniska
        </Typography>

        <ShelterSearchFilters 
          onFilterChange={handleFilterChange}
          cities={cities} // Lista unikalnych miast
        />

        <Grid container spacing={3}>
          {currentShelters.map((shelter) => {
            console.log('Schronisko ID:', shelter.id || shelter.shelter_id); // Debugowanie

            if (!shelter.id && !shelter.shelter_id) {
              console.error('Niekompletne dane schroniska:', shelter);
              return null;
            }

            return (
              <Grid item xs={12} sm={6} md={4} key={shelter.id || shelter.shelter_id}>
                <ShelterCard 
                  shelter_id={shelter.id || shelter.shelter_id} // Ustawiamy poprawne ID
                  name={shelter.name}
                  street={shelter.street}
                  city={shelter.city}
                  postal_code={shelter.postal_code}
                  building={shelter.building}
                  description={shelter.description}
                  phone_number={shelter.phone_number}
                  email={shelter.email}
                />
              </Grid>
            );
          })}
        </Grid>




        {totalPages > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
            }}
          >
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
    </>
  );
};

export default Shelters;
