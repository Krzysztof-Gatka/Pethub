import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShelterModel } from '../../models/Shelter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const ShelterCard: React.FC<ShelterModel> = ({
  id,
  name,
  address,
  description,
  phone,
  email,
  img_url
}) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate(`/shelters/${id}`);
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
      <CardMedia
        component="img"
        height="200"
        image={img_url || "/api/placeholder/400/300"}
        alt={name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {address}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {phone}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmailIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={handleDetails}
        >
          Szczegóły
        </Button>
      </Box>
    </Card>
  );
};

export default ShelterCard;