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
              <Button color="inherit" onClick={() => navigate('/animals')}>Animals</Button>
              <Button color="inherit" onClick={() => navigate('/shelters')}>Shelters</Button>
              <Button color="inherit" onClick={() => {navigate('/login')}}>Sign up</Button>
              <Button color="inherit" onClick={handleSignIn}>Sign in</Button>
            </>
          )}

          {
            user! && user.role == 'user' && (
              <>
                <Button color="inherit" onClick={() => navigate('/animals')}>Animals</Button>
                <Button color="inherit" onClick={() => navigate('/shelters')}>Shelters</Button>
                <Button color="inherit" onClick={() => navigate('/followed')}>Followed</Button>
                <Button color="inherit" onClick={() => navigate('/notifications')}>Notifications</Button>
                <Button color="inherit" onClick={() => navigate('/appointments')}>Appointments</Button>
                <Button color="inherit" onClick={() => navigate('/adoptions')}>Adoptions</Button>
                <Button color="inherit" onClick={handleLogout}>Log out</Button>
              </>
            )
          }

          {
            user! && user.role == 'shelter' && (
              <>
                <Button color="inherit" onClick={() => navigate('/animals')}>Animals</Button>
                <Button color="inherit" onClick={() => navigate('/notifications')}>Notifications</Button>
                <Button color="inherit" onClick={() => navigate('/appointments')}>Appointments</Button>
                <Button color="inherit" onClick={() => navigate('/adoptions')}>Adoptions</Button>

                <Button color="inherit" onClick={handleLogout}>Log out</Button>
              </>
            )
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}