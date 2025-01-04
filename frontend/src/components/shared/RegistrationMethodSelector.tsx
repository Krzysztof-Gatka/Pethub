import React from 'react';
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import EmailIcon from '@mui/icons-material/Email';

const RegistrationMethodSelector: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  
  const isUser = type === 'user-methods';
  const title = isUser ? 'użytkownika' : 'schroniska';

  const handleStandardRegistration = () => {
    navigate(`/signupform/${isUser ? 'user' : 'shelter'}`);
  };

  const handleGoogleRegistration = () => {
    const profileType = isUser ? 'user' : 'shelter';
    window.location.href = `http://localhost:3000/auth/google/signup?role=${profileType}&redirect_url=${encodeURIComponent(`http://localhost:5173/${profileType}ProfileForm`)}`
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Rejestracja konta {title}
        </Typography>
        
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<EmailIcon />}
                onClick={handleStandardRegistration}
                sx={{ py: 2, mb: 2 }}
              >
                REJESTRACJA PRZEZ E-MAIL
              </Button>

              <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 2 }}>
                lub
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleRegistration}
                sx={{ py: 2 }}
              >
                REJESTRACJA PRZEZ GOOGLE
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Button
          color="primary"
          onClick={() => navigate('/signup')}
          sx={{ mt: 2 }}
        >
          ← WRÓĆ DO WYBORU TYPU KONTA
        </Button>
      </Box>
    </Container>
  );
};

export default RegistrationMethodSelector;