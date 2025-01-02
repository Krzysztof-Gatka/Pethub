import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';


const SIGNIN_URL = 'http://localhost:3000/auth/google/signin'

export default function ButtonAppBar() {
    const navigate = useNavigate();
    const {user, isLoggedIn, loading, logout } = useAuth();

    const handleSignIn = () => {
      window.location.href = (SIGNIN_URL);
    }

    const handleLogout = async () => {
      await logout();
      navigate('/')
    }
    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img onClick={() => navigate('/')} width="100" src="/pethub-logo.png" alt="" />
          </Typography>
          {!isLoggedIn && (
            <>
              <Button color="inherit" onClick={() => navigate('/animals')}>Zwierzęta</Button>
              <Button color="inherit" onClick={() => navigate('/shelters')}>Schroniska</Button>
              <Button color="inherit" onClick={() => {navigate('/signup')}}>Zarejestruj się</Button>
              <Button color="inherit" onClick={handleSignIn}>Zaloguj się</Button>
            </>
          )}

          {
            user! && user.role == 'user' && (
              <>
                <Button color="inherit" onClick={() => navigate('/animals')}>Zwierzęta</Button>
                <Button color="inherit" onClick={() => navigate('/shelters')}>Schroniska</Button>
                <Button color="inherit" onClick={() => navigate('/followed')}>Obserwowane</Button>
                <Button color="inherit" onClick={() => navigate('/notifications')}>Powiadomienia</Button>
                <Button color="inherit" onClick={() => navigate('/appointments')}>Spotkania</Button>
                <Button color="inherit" onClick={() => navigate('/adoptions')}>Adopcje</Button>
                <Button color="inherit" onClick={handleLogout}>Wyloguj</Button>
              </>
            )
          }

          {
            user! && user.role == 'shelter' && (
              <>
                <Button color="inherit" onClick={() => navigate('/animals')}>Zwierzęta</Button>
                <Button color="inherit" onClick={() => navigate('/notifications')}>Powiadomienia</Button>
                <Button color="inherit" onClick={() => navigate('/appointments')}>Spotkania</Button>
                <Button color="inherit" onClick={() => navigate('/adoptions')}>Adopcje</Button>
                <Button color="inherit" onClick={handleLogout}>Wyloguj</Button>
              </>
            )
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}