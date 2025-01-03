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
import axios from 'axios';

const RegistrationMethodSelector: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams(); // 'user-methods' lub 'shelter-methods'
  
  const isUser = type === 'user-methods';
  const title = isUser ? 'użytkownika' : 'schroniska';

  // Na razie te handlery będą tylko logować akcję
  const handleStandardRegistration = () => {
    console.log('Wybrano rejestrację przez email');
    // Tutaj później dodamy nawigację
  };

  const handleGoogleRegistration = () => {
    console.log('Wybrano rejestrację przez Google');
    // Tutaj później dodamy nawigację
    window.location.href = `http://localhost:3000/auth/google/signup?role=${type == 'user-methods' ? 'user' : 'shelter'}`
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