import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';

const SIGNIN_URL = 'http://localhost:5173/signin';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    handleClose();
  };

  const getMenuItems = () => {
    if (!isLoggedIn) {
      return [
        { label: 'Zwierzęta', path: '/animals' },
        { label: 'Schroniska', path: '/shelters' },
        { label: 'Zarejestruj się', path: '/signup' },
        { label: 'Zaloguj się', path: '/signin' }
      ];
    }

    if (user?.role === 'user') {
      return [
        { label: 'Zwierzęta', path: '/animals' },
        { label: 'Schroniska', path: '/shelters' },
        { label: 'Obserwowane', path: '/followed' },
        { label: 'Spacery', path: '/walks' },
        { label: 'Powiadomienia', path: '/notifications' },
        { label: 'Moje Adopcje', path: '/adoptions' },
        { label: 'Wyloguj', action: handleLogout }
      ];
    }

    if (user?.role === 'shelter') {
      return [
        { label: 'Zwierzęta', path: '/shelter/animals' },
        { label: 'Powiadomienia', path: '/shelter/notifications' },
        { label: 'Spacery', path: '/shelter/walks' },
        { label: 'Adopcje', path: '/shelter/adoptions' },
        { label: 'Profil schroniska', path: '/shelter/profile' },
        { label: 'Wyloguj', action: handleLogout }
      ];
    }

    return [];
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            >
              <img 
                src="/pethub-logo.png" 
                alt="PetHub Logo" 
                style={{ 
                  width: '100px',
                  height: 'auto'
                }} 
              />
            </Typography>

            {isMobile ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenu}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  {getMenuItems().map((item, index) => (
                    <MenuItem 
                      key={index} 
                      onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {getMenuItems().map((item, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => item.action ? item.action() : handleNavigation(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </Container>
  );
};

export default Navbar;