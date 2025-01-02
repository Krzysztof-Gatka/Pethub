import React from 'react';
import {
  Paper,
  Typography,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import PetsIcon from '@mui/icons-material/Pets';

const AccountTypeSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Wybierz rodzaj konta
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Kafelek użytkownika */}
        <Grid item xs={12} md={5}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate('/signup/user-methods')}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
              <PersonIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Konto użytkownika
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Załóż konto użytkownika, aby móc przeglądać ogłoszenia, 
                umawiać wizyty w schroniskach i adoptować zwierzęta. 
                Będziesz mógł także śledzić wybrane ogłoszenia i otrzymywać 
                powiadomienia o nowych zwierzętach.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                fullWidth
              >
                Wybierz konto użytkownika
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Kafelek schroniska */}
        <Grid item xs={12} md={5}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
                cursor: 'pointer'
              }
            }}
            onClick={() => navigate('/signup/shelter-methods')}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
              <PetsIcon sx={{ fontSize: 60, mb: 2, color: 'secondary.main' }} />
              <Typography variant="h5" component="h2" gutterBottom>
                Konto schroniska
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Załóż konto schroniska, aby móc dodawać ogłoszenia o zwierzętach, 
                zarządzać wizytami potencjalnych opiekunów i prowadzić proces adopcji. 
                Otrzymasz dostęp do panelu zarządzania zwierzętami i statystyk.
              </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="secondary"
                size="large"
                fullWidth
              >
                Wybierz konto schroniska
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountTypeSelector;