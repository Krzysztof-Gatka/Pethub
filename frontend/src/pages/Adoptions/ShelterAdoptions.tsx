import React, { useEffect, useState } from 'react';
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
import AdoptionCard from '../../components/shared/AdoptionCard'; // Wspólny komponent do wyświetlania wniosków
import ShelterLayout from '../../layouts/ShelterLayout';
import PetsIcon from '@mui/icons-material/Pets';
import { useNavigate } from 'react-router-dom';

interface Adoption {
  id: number;
  animal_name: string;
  date: string;
  status: string;
  img_url: string;
}

const ShelterAdoptions: React.FC = () => {
  const [adoptions, setAdoptions] = useState<Adoption[]>([]);
  const [selectedAdoption, setSelectedAdoption] = useState<Adoption | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAdoptions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/profiles/shelter-session', {
        withCredentials: true,
      });

      const shelterId = response.data.user.shelterId;
      if (!shelterId) {
        throw new Error('Shelter ID not found for the current user.');
      }

      const adoptionsResponse = await axios.get(
        `http://localhost:3000/api/adoptions/shelter/${shelterId}`
      );
      setAdoptions(adoptionsResponse.data.adoptions);
    } catch (err) {
      console.error('Error fetching shelter adoptions:', err);
      setError('Nie udało się pobrać wniosków adopcyjnych.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const handleCancelAdoption = async (adoptionId: number) => {
    try {
      console.log(`Canceling adoption with ID: ${adoptionId}`);
      await axios.delete(`http://localhost:3000/api/adoptions/${adoptionId}`);
      alert('Wniosek adopcyjny został anulowany.');
      fetchAdoptions(); // Odśwież listę adopcji
    } catch (error) {
      console.error('Error canceling adoption:', error);
      alert('Nie udało się anulować wniosku adopcyjnego. Spróbuj ponownie później.');
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
      handleCancelAdoption(selectedAdoption.id);
    }
    closeDialog();
  };

  if (loading) {
    return (
      <ShelterLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography>Loading...</Typography>
        </Container>
      </ShelterLayout>
    );
  }

  if (error) {
    return (
      <ShelterLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography color="error">{error}</Typography>
        </Container>
      </ShelterLayout>
    );
  }

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
          Wnioski adopcyjne w Twoim schronisku
        </Typography>

        <Grid container spacing={3}>
          {adoptions.map((adoption) => (
            <Grid item xs={12} key={adoption.id}>
              <AdoptionCard
                id={adoption.id}
                animalName={adoption.animal_name}
                date={adoption.date}
                status={adoption.status}
                imageUrl={adoption.img_url}
                onCancelAdoption={() => openDialog(adoption)}
                hideShelterName={true}
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
              <strong>{selectedAdoption?.animal_name}</strong>?
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

export default ShelterAdoptions;
