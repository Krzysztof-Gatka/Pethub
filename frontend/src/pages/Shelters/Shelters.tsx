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
import { useAuth } from '../../hooks/useAuth';

const Shelters = () => {
  const { isLoggedIn } = useAuth();
  const [shelters, setShelters] = useState<ShelterModel[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<ShelterModel[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const fetchShelters = async () => {
    const response = await axios.get('http://localhost:3000/api/shelter/profiles')
    const shelters = response.data;
    console.log(shelters)
    setShelters(shelters)
    setFilteredShelters(shelters)
  }

  useEffect(() => {
    // Przykładowe dane do testowania interfejsu
    fetchShelters();
    // const testShelters: ShelterModel[] = [
    //   {
    //     shelter_id: 1,
    //     name: "Schronisko Na Paluchu",
    //     street: "ul. Paluch 2",
    //     city: "Warszawa",
    //     postal_code: "02-147",
    //     building: "",
    //     description: "Największe schronisko dla bezdomnych zwierząt w Warszawie",
    //     phone: "+48 22 868 15 79",
    //     email: "kontakt@napaluchu.waw.pl"
    //   },
    //   {
    //     shelter_id: 2,
    //     name: "Schronisko w Korabiewicach",
    //     street: "Korabiewice",
    //     building: "11",
    //     city: "Puszcza Mariańska",
    //     postal_code: "96-330",
    //     description: "Schronisko prowadzone przez Fundację Viva",
    //     phone: "+48 725 850 950",
    //     email: "korabiewice@viva.org.pl"
    //   },
    //   {
    //     shelter_id: 3,
    //     name: "Schronisko w Celestynowie",
    //     street: "ul. Prosta",
    //     building: "3",
    //     city: "Celestynów",
    //     postal_code: "05-430",
    //     description: "Schronisko dla bezdomnych zwierząt",
    //     phone: "+48 22 789 70 61",
    //     email: "kontakt@celestynow.org.pl"
    //   }
    // ];
    // setShelters(testShelters);
    // setFilteredShelters(testShelters);
  }, []);

  const handleFilterChange = (filters: ShelterFilters) => {
    let filtered = shelters.filter((shelter) => {
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

  const handleFollow = async (shelterId: number) => {
    try {
      await axios.post(`http://localhost:3000/api/shelters/${shelterId}/follow`);
      // Odśwież stan po obserwowaniu
    } catch (error) {
      console.error('Błąd podczas obserwowania schroniska:', error);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(filteredShelters.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentShelters = filteredShelters.slice(startIndex, startIndex + itemsPerPage);

  const cities = [...new Set(shelters.map(shelter => shelter.city))];

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          textAlign: 'center',
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2
        }}>
          <HomeIcon fontSize="large" />
          Dostępne Schroniska
        </Typography>

        <ShelterSearchFilters 
          onFilterChange={handleFilterChange}
          cities={cities}
        />

        <Grid container spacing={3}>
          {currentShelters.map((shelter) => (
            <Grid item xs={12} sm={6} md={4} key={shelter.shelter_id}>
              <ShelterCard 
                {...shelter}
                isLoggedIn={isLoggedIn}
                onFollow={handleFollow}
              />
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
    </>
  );
};

export default Shelters;