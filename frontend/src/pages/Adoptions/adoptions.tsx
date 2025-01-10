import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import axios from 'axios';
import AdoptionCard from '../../components/shared/AdoptionCard'; // Stwórz ten komponent na wzór WalkCard
import ShelterLayout from '../../layouts/ShelterLayout';
import PetsIcon from '@mui/icons-material/Pets';

interface Adoption {
  adoption_id: number;
  animal_name: string;
  shelter_name: string;
  date: string;
  status: string; // "pending", "approved", "rejected", "cancelled"
  img_url: string;
}

const Adoptions = () => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [selectedAdoption, setSelectedAdoption] = useState<Adoption | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAdoptions = async () => {
    try {
      const userId = 1; // Przykładowe ID użytkownika, zastąp rzeczywistym
      const response = await axios.get(`http://localhost:3000/api/adoptions/user/${userId}`);
      setAdoptions(response.data.adoptions);
    } catch (error) {
      console.error('Error fetching adoptions:', error);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const handleCancelAdoption = async (adoptionId: number) => {
    try {
      console.log(`Canceling adoption with ID: ${adoptionId}`);
      await axios.delete(`http://localhost:3000/api/adoptions/${adoptionId}`);
      alert('Wniosek adopcyjny został usunięty.');
      fetchAdoptions(); // Odśwież listę adopcji
    } catch (error) {
      console.error('Error canceling adoption:', error);
      alert('Nie udało się usunąć wniosku adopcyjnego. Spróbuj ponownie później.');
    }
  };
  

  const openDialog = (adoption: Adoption) => {
    setSelectedAdoption(adoption);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedAdoption(null);
  };

  const confirmCancelAdoption = () => {
    if (selectedAdoption) {
      handleCancelAdoption(selectedAdoption.adoption_id);
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
          <PetsIcon fontSize="large" />
          Twoje wnioski adopcyjne
        </Typography>

        <Grid container spacing={3}>
          {adoptions.map((adoption) => (
            <Grid item xs={12} key={adoption.adoption_id}>
              <AdoptionCard
                id={adoption.adoption_id}
                animalName={adoption.animal_name}
                shelterName={adoption.shelter_name}
                date={adoption.date}
                status={adoption.status}
                imageUrl={adoption.img_url}
                onCancelAdoption={() => openDialog(adoption)}
              />
            </Grid>
          ))}
        </Grid>

        {/* Dialog potwierdzający anulowanie wniosku */}
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>Potwierdź anulowanie wniosku</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Czy na pewno chcesz anulować wniosek adopcyjny dla zwierzęcia{' '}
              <strong>{selectedAdoption?.animal_name}</strong> w schronisku{' '}
              <strong>{selectedAdoption?.shelter_name}</strong>?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Anuluj
            </Button>
            <Button onClick={confirmCancelAdoption} color="error" autoFocus>
              Potwierdź
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ShelterLayout>
  );
};

export default Adoptions;
