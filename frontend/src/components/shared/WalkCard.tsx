import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';

interface WalkCardProps {
  id: number;
  animalName: string;
  shelterName: string;
  walkTime: string;
  imageUrl: string;
  onCancelWalk: (id: number) => void;
}

const WalkCard = ({ id, animalName, date, shelterName, walkTime, imageUrl, onCancelWalk }: WalkCardProps) => {
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
        image={imageUrl || `/api/placeholder/400/300`}
        alt={animalName}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {animalName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Schronisko: {shelterName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Termin spaceru: {date.split('T')[0]} {walkTime}:00
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          color="error" 
          onClick={() => onCancelWalk(id)}
          fullWidth
        >
          Anuluj spacer
        </Button>
      </Box>
    </Card>
  );
};

export default WalkCard;