import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';

interface AdoptionCardProps {
  id: number;
  animalName: string;
  shelterName: string;
  date: string;
  status: string;
  imageUrl: string;
  onCancelAdoption: () => void;
  hideShelterName?: boolean; // Nowy opcjonalny props
}

const AdoptionCard: React.FC<AdoptionCardProps> = ({
  animalName,
  shelterName,
  date,
  status,
  imageUrl,
  onCancelAdoption,
  hideShelterName = false, // Domyślnie wyświetlamy nazwę schroniska
}) => {
  const statusColor = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        p: 2,
        mb: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <img
        src={imageUrl || '/api/placeholder/300'}
        alt={animalName}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '8px',
          objectFit: 'cover',
          marginRight: '16px',
        }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6">{animalName}</Typography>
        {!hideShelterName && (
          <Typography variant="body2" color="textSecondary">
            Schronisko: {shelterName}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          Data zgłoszenia: {date.split('T')[0]}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip label={`Status: ${status}`} color={statusColor[status] || 'default'} />
        </Box>
      </CardContent>
      <Box>
        <Button variant="contained" color="error" onClick={onCancelAdoption}>
          Anuluj
        </Button>
      </Box>
    </Card>
  );
};

export default AdoptionCard;
