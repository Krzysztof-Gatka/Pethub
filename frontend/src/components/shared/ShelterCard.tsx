import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ShelterCardProps } from '../../models/Shelter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const ShelterCard: React.FC<ShelterCardProps> = ({
  shelter_id,  // ID schroniska
  name,
  street,
  city,
  postal_code,
  building,
  description,
  phone_number,
  email
}) => {
  const navigate = useNavigate();

  const handleDetails = () => {
    if (!shelter_id) {
      console.error('Brak poprawnego ID schroniska:', shelter_id);
      return;
    }
    navigate(`/shelters/${shelter_id}`);
  };
  
  

  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {name || 'Brak nazwy schroniska'}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {street && city && postal_code
              ? `${street} ${building || ''}, ${postal_code} ${city}`
              : 'Brak adresu'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {phone_number || 'Brak numeru telefonu'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmailIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary">
            {email || 'Brak adresu e-mail'}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {description || 'Brak opisu schroniska'}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2 }}>
        <Button 
          variant="outlined" 
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
