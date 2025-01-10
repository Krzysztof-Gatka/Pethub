import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface WalkCardProps {
  id: number;
  animalName: string;
  shelterName: string;
  walkTime: string;
  date: string;
  imageUrl: string;
  onCancelWalk: (id: number) => void;
}

const WalkCard = ({ id, animalName, shelterName, date, walkTime, imageUrl, onCancelWalk }: WalkCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const confirmCancelWalk = () => {
    onCancelWalk(id);
    closeDialog();
  };

  return (
    <>
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
        <CardMedia
          component="img"
          sx={{
            width: 120,
            height: 120,
            borderRadius: '8px',
            objectFit: 'cover',
            mr: 2,
          }}
          image={imageUrl || `/api/placeholder/400/300`}
          alt={animalName}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            {animalName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Schronisko: {shelterName || 'Nieznane'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Termin spaceru: {date.split('T')[0]} {walkTime}:00
          </Typography>
        </CardContent>
        <Box>
          <Button
            variant="contained"
            color="error"
            onClick={openDialog}
            sx={{ ml: 2 }}
          >
            Anuluj spacer
          </Button>
        </Box>
      </Card>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Potwierdzenie anulowania spaceru</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz anulować spacer z {animalName} w schronisku {shelterName || 'Nieznane'} zaplanowany na {date.split('T')[0]} o godzinie {walkTime}:00?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Zamknij
          </Button>
          <Button onClick={confirmCancelWalk} color="error" autoFocus>
            Anuluj spacer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WalkCard;
