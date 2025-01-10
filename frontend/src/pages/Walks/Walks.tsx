import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import axios from 'axios';
import WalkCard from '../../components/shared/WalkCard';
import ShelterLayout from '../../layouts/ShelterLayout';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

interface Walk {
  id: number;
  walk_id: number;
  animal_name: string;
  shelter_name: string;
  date: string;
  time_slot: string;
  img_url: string;
}

const Walks = () => {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [selectedWalk, setSelectedWalk] = useState<Walk | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchWalks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/walks', { withCredentials: true });
      setWalks(response.data.walks);
    } catch (error) {
      console.error('Error fetching walks:', error);
    }
  };

  useEffect(() => {
    fetchWalks();
  }, []);

  const handleCancelWalk = async (walkId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/walks/${walkId}`);
      fetchWalks(); // Reload the walks after successful cancellation
    } catch (error) {
      console.error('Error canceling walk:', error);
    }
  };

  const openDialog = (walk: Walk) => {
    setSelectedWalk(walk);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedWalk(null);
  };

  const confirmCancelWalk = () => {
    if (selectedWalk) {
      handleCancelWalk(selectedWalk.walk_id);
    }
    closeDialog();
  };

  return (
    <ShelterLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <DirectionsWalkIcon fontSize="large" />
          Zaplanowane spacery
        </Typography>

        <Grid container spacing={3}>
          {walks.map((walk) => (
            <Grid item xs={12} key={walk.walk_id}>
              <WalkCard
                id={walk.walk_id}
                animalName={walk.animal_name}
                shelterName={walk.shelter_name}
                date={walk.date}
                walkTime={walk.time_slot}
                imageUrl={walk.img_url}
                onCancelWalk={() => openDialog(walk)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Dialog for cancel confirmation */}
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>Potwierdź anulowanie spaceru</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Czy na pewno chcesz anulować spacer z {selectedWalk?.animal_name} w schronisku {selectedWalk?.shelter_name} zaplanowany na {selectedWalk?.date.split('T')[0]} o godzinie {selectedWalk?.time_slot}:00?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Anuluj
            </Button>
            <Button onClick={confirmCancelWalk} color="error" autoFocus>
              Potwierdź
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ShelterLayout>
  );
};

export default Walks;
