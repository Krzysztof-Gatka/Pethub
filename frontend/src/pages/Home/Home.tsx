import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PetsIcon from '@mui/icons-material/Pets';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import Navbar from '../../components/Navbar';

const InfoCard = ({ icon: Icon, title, description, buttonText, buttonColor, onClick }) => (
  <Grid item xs={12} md={12} lg={4}>
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 3, sm: 4 },
        height: '100%',
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
      <Box sx={{ mb: 3 }}>
        <Icon sx={{ 
          fontSize: { xs: 48, sm: 56 }, 
          color: `${buttonColor}.main`
        }} />
      </Box>
      
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
          mb: 2
        }}
      >
        {title}
      </Typography>
      
      <Typography 
        sx={{ 
          mb: 4,
          flexGrow: 1,
          fontSize: { xs: '1rem', sm: '1.125rem' }
        }}
      >
        {description}
      </Typography>
      
      {buttonText && (
        <Button 
          variant="contained" 
          color={buttonColor}
          size="large"
          onClick={onClick}
          sx={{ 
            mt: 'auto',
            py: 1.5,
            px: 4,
            minWidth: '200px'
          }}
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  </Grid>
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const cards = {
    welcome: {
      icon: InfoIcon,
      title: "Witaj w PetHub!",
      description: "PetHub to miejsce, gdzie możesz znaleźć swojego przyszłego czworonożnego przyjaciela. Przeglądaj profile zwierząt, poznaj schroniska i daj dom potrzebującemu zwierzakowi.",
      buttonColor: "primary"
    },
    animals: {
      icon: PetsIcon,
      title: "Zwierzęta",
      description: "Poznaj zwierzaki czekające na nowy dom. Możesz filtrować według różnych kryteriów, aby znaleźć idealnego towarzysza.",
      buttonText: "ZOBACZ ZWIERZĘTA",
      buttonColor: "error",
      onClick: () => navigate('/animals')
    },
    shelters: {
      icon: HomeIcon,
      title: "Schroniska",
      description: "Znajdź schroniska w Twojej okolicy. Możesz przeglądać profile schronisk, sprawdzać dostępne zwierzęta i kontaktować się z nimi.",
      buttonText: "ZOBACZ SCHRONISKA",
      buttonColor: "success",
      onClick: () => navigate('/shelters')
    },
    shelterProfile: {
      icon: ManageAccountsIcon,
      title: "Profil Schroniska",
      description: "Zarządzaj profilem swojego schroniska. Aktualizuj informacje, dane kontaktowe i inne istotne szczegóły.",
      buttonText: "ZARZĄDZAJ PROFILEM",
      buttonColor: "success",
      onClick: () => navigate('/shelter/profile')
    },
    adoptions: {
      icon: PeopleIcon,
      title: "Zarządzanie Adopcjami",
      description: "Przeglądaj i zarządzaj procesami adopcyjnymi. Sprawdzaj zgłoszenia, komunikuj się z potencjalnymi opiekunami i śledź postępy adopcji.",
      buttonText: "ZARZĄDZAJ ADOPCJAMI",
      buttonColor: "warning",
      onClick: () => navigate('/shelter/adoptions')
    }
  };

  return (
    <>
      <Navbar />
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 4, sm: 4, md: 4 },
          px: { xs: 8, sm: 8 }
        }}
      >
        <Grid 
          container 
          spacing={{ xs: 10, sm: 12, md: 12, lg: 4}}
          alignItems="stretch"
          justifyContent={"space-between"}
        >
          <InfoCard {...cards.welcome} />
          {user?.role === 'shelter' ? (
            <>
              <InfoCard {...cards.shelterProfile} />
              <InfoCard {...cards.adoptions} />
            </>
          ) : (
            <>
              <InfoCard {...cards.animals} />
              <InfoCard {...cards.shelters} />
            </>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Home;