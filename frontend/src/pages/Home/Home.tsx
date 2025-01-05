import React, { useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import Navbar from '../../components/Navbar';

const Home = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const WelcomeCard = () => (
    <Grid item xs={12} md={4}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <InfoIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          Witaj w PetHub!
        </Typography>
        <Typography sx={{ mb: 4 }}>
          PetHub to miejsce, gdzie możesz znaleźć swojego przyszłego czworonożnego przyjaciela. 
          Przeglądaj profile zwierząt, poznaj schroniska i daj dom potrzebującemu zwierzakowi.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
          Zacznij od przeglądania dostępnych zwierząt lub znajdź najbliższe schronisko.
        </Typography>
      </Paper>
    </Grid>
  );

  const AnimalsCard = () => (
    <Grid item xs={12} md={4}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <PetsIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          Zwierzęta
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Poznaj zwierzaki czekające na nowy dom. Możesz filtrować według różnych kryteriów, 
          aby znaleźć idealnego towarzysza.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={() => navigate('/animals')}
          sx={{ mt: 'auto' }}
        >
          ZOBACZ ZWIERZĘTA
        </Button>
      </Paper>
    </Grid>
  );

  const ShelterProfileCard = () => (
    <Grid item xs={12} md={4}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <ManageAccountsIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          Profil Schroniska
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Zarządzaj profilem swojego schroniska. Aktualizuj informacje, 
          dane kontaktowe i inne istotne szczegóły.
        </Typography>
        <Button 
          variant="contained" 
          color="success" 
          fullWidth
          onClick={() => navigate('/shelter/profile')}
          sx={{ mt: 'auto' }}
        >
          ZARZĄDZAJ PROFILEM
        </Button>
      </Paper>
    </Grid>
  );

  const SheltersCard = () => (
    <Grid item xs={12} md={4}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <HomeIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          Schroniska
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Znajdź schroniska w Twojej okolicy. Możesz przeglądać profile schronisk, 
          sprawdzać dostępne zwierzęta i kontaktować się z nimi.
        </Typography>
        <Button 
          variant="contained" 
          color="success" 
          fullWidth
          onClick={() => navigate('/shelters')}
          sx={{ mt: 'auto' }}
        >
          ZOBACZ SCHRONISKA
        </Button>
      </Paper>
    </Grid>
  );

  const ManageAdoptionsCard = () => (
    <Grid item xs={12} md={4}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)'
          }
        }}
      >
        <PeopleIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
        <Typography variant="h5" component="h2" gutterBottom>
          Zarządzanie Adopcjami
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Przeglądaj i zarządzaj procesami adopcyjnymi. Sprawdzaj zgłoszenia, 
          komunikuj się z potencjalnymi opiekunami i śledź postępy adopcji.
        </Typography>
        <Button 
          variant="contained" 
          color="warning" 
          fullWidth
          onClick={() => navigate('/shelter/adoptions')}
          sx={{ mt: 'auto' }}
        >
          ZARZĄDZAJ ADOPCJAMI
        </Button>
      </Paper>
    </Grid>
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <WelcomeCard />
          {user?.role === 'shelter' ? (
            // Karty dla schroniska
            <>
              <ShelterProfileCard />
              <ManageAdoptionsCard />
            </>
          ) : (
            // Karty dla użytkownika/gościa
            <>
              <AnimalsCard />
              <SheltersCard />
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Home;