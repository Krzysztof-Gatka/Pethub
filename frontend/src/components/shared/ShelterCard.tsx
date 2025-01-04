import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShelterCardProps } from '../../models/Shelter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const ShelterCard: React.FC<ShelterCardProps> = ({
  shelter_id,  // zmiana z id na shelter_id
  name,
  street,     // zmiana z address
  city,
  postal_code,
  building,
  description,
  phone_number,
  email,
  isLoggedIn,
  isFollowed,
  onFollow
}) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/shelters/${shelter_id}`);
  };

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2" sx={{ mb: 2 }}>
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {`${street} ${building}, ${postal_code} ${city}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {`${phone_number.split('').slice(0,3).join('')} ${phone_number.split('').slice(3,6).join('')} ${phone_number.split('').slice(6,9).join('')}`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          fullWidth
          onClick={handleDetails}
        >
          SZCZEGÓŁY
        </Button>
        {isLoggedIn && (
          <Button 
            variant={isFollowed ? "contained" : "outlined"}
            color="primary" 
            fullWidth
            onClick={() => onFollow && onFollow(shelter_id)}
          >
            {isFollowed ? 'OBSERWUJESZ' : 'OBSERWUJ'}
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default ShelterCard;