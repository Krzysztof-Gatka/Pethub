import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Grid
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';

const GOOGLE_LOGIN_URL = 'http://localhost:3000/auth/google/signin';

const Login = () => {
  const navigate = useNavigate();

  const handleEmailSignIn = () => {
    navigate('/signinform');
  };
  
  const handleGoogleSignIn = () => {
    window.location.href = GOOGLE_LOGIN_URL;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Wybierz metodę logowania
      </Typography>
      
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {/* Email i hasło */}
        <Grid item xs={12} sm={6} md={5}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
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
            <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Email i hasło
            </Typography>
            <Typography sx={{ mb: 4, flexGrow: 1 }}>
              Zaloguj się używając swojego adresu email i hasła. Ta opcja wymaga wcześniejszej rejestracji w systemie.
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleEmailSignIn}
              startIcon={<EmailIcon />}
            >
              ZALOGUJ SIĘ EMAILEM
            </Button>
          </Paper>
        </Grid>

        {/* Google */}
        <Grid item xs={12} sm={6} md={5}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
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
            <GoogleIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Konto Google
            </Typography>
            <Typography sx={{ mb: 4, flexGrow: 1 }}>
              Zaloguj się za pomocą swojego konta Google. To szybka i bezpieczna metoda logowania bez potrzeby pamiętania dodatkowego hasła.
            </Typography>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon />}
              sx={{ 
                bgcolor: 'error.main',
                '&:hover': {
                  bgcolor: 'error.dark',
                }
              }}
            >
              ZALOGUJ SIĘ Z GOOGLE
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;