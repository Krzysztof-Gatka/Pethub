import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import axios from 'axios';
import WalkCard from '../../components/shared/WalkCard';
import ShelterLayout from '../../layouts/ShelterLayout';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

interface Walk {
  id: number;
  animal_name: string;
  date: string;
  time_slot: string;
  img_url: string;
}

const ShelterWalks: React.FC = () => {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [selectedWalk, setSelectedWalk] = useState<Walk | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Pobieranie spacerów z backendu
  const fetchWalks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/walks/shelter/1', { withCredentials: true });

      // Sortowanie spacerów po dacie i godzinie
      const sortedWalks = response.data.data.sort((a: Walk, b: Walk) => {
        const dateTimeA = new Date(`${a.date}T${a.time_slot}`);
        const dateTimeB = new Date(`${b.date}T${b.time_slot}`);
        return dateTimeA.getTime() - dateTimeB.getTime();
      });

      setWalks(sortedWalks);
    } catch (error) {
      console.error('Błąd podczas pobierania spacerów:', error);
    }
  };

  useEffect(() => {
    fetchWalks();
  }, []);

  // Funkcja do anulowania spaceru
  const handleCancelWalk = async () => {
    if (!selectedWalk) return;

    try {
      await axios.delete(`http://localhost:3000/api/walks/${selectedWalk.id}`, { withCredentials: true });
      setIsDialogOpen(false); // Zamknięcie dialogu
      fetchWalks(); // Odświeżenie listy spacerów
    } catch (error) {
      console.error('Błąd podczas odwoływania spaceru:', error);
    }
  };

  // Otwieranie dialogu potwierdzenia
  const openDialog = (walk: Walk) => {
    setSelectedWalk(walk);
    setIsDialogOpen(true);
  };

  // Zamknięcie dialogu potwierdzenia
  const closeDialog = () => {
    setSelectedWalk(null);
    setIsDialogOpen(false);
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
          Zaplanowane spacery w schronisku
        </Typography>

        <Grid container spacing={3}>
          {walks.map((walk) => (
            <Grid item xs={12} key={walk.id}>
              <WalkCard
                id={walk.id}
                animalName={walk.animal_name}
                date={walk.date}
                walkTime={walk.time_slot}
                imageUrl={walk.img_url}
                onCancelWalk={() => openDialog(walk)}
                hideShelterName={true}
              />
            </Grid>
          ))}
        </Grid>

        {/* Dialog potwierdzający */}
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>Potwierdź odwołanie spaceru</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Czy na pewno chcesz odwołać spacer z {selectedWalk?.animal_name} zaplanowany na {selectedWalk?.date.split('T')[0]} o godzinie {selectedWalk?.time_slot}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Anuluj
            </Button>
            <Button
              onClick={() => {
                handleCancelWalk(); // Anuluj spacer
              }}
              color="error"
              autoFocus
            >
              Potwierdź
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ShelterLayout>
  );
};

export default ShelterWalks;
