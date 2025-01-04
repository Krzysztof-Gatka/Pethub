import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, 
  Grid, 
  Typography, 
  Box,
  Pagination
} from '@mui/material';
import ShelterLayout from '../../layouts/ShelterLayout';
import ShelterCard from '../../components/shared/ShelterCard';
import { ShelterModel } from '../../models/Shelter';
import HomeIcon from '@mui/icons-material/Home';

const Shelters = () => {
  const [shelters, setShelters] = useState<ShelterModel[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Przykładowe dane do testowania interfejsu
    setShelters([
      {
        id: 1,
        name: "Schronisko Na Paluchu",
        address: "ul. Paluch 2, 02-147 Warszawa",
        description: "Największe schronisko dla bezdomnych zwierząt w Warszawie",
        phone: "+48 22 868 15 79",
        email: "kontakt@napaluchu.waw.pl",
        img_url: "/api/placeholder/400/300"
      },
      {
        id: 2,
        name: "Schronisko w Korabiewicach",
        address: "Korabiewice 11, 96-330 Puszcza Mariańska",
        description: "Schronisko prowadzone przez Fundację Viva",
        phone: "+48 725 850 950",
        email: "korabiewice@viva.org.pl",
        img_url: "/api/placeholder/400/300"
      },
      {
        id: 3,
        name: "Schronisko w Celestynowie",
        address: "ul. Prosta 3, 05-430 Celestynów",
        description: "Schronisko dla bezdomnych zwierząt",
        phone: "+48 22 789 70 61",
        email: "kontakt@celestynow.org.pl",
        img_url: "/api/placeholder/400/300"
      }
    ]);
  }, []);

  const totalPages = Math.ceil(shelters.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentShelters = shelters.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <HomeIcon fontSize="large" />
          Dostępne Schroniska
        </Typography>

        <Grid container spacing={3}>
          {currentShelters.map((shelter) => (
            <Grid item xs={12} sm={6} md={4} key={shelter.id}>
              <ShelterCard {...shelter} />
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

export default Shelters;