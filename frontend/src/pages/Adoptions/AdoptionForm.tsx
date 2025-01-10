import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  Alert,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ShelterLayout from '../../layouts/ShelterLayout';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/adoptions';

const AdoptionForm: React.FC = () => {
  const { animalId } = useParams<{ animalId: string }>(); // Pobranie ID zwierzęcia z URL
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false); // Obsługa ładowania
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    street: '',
    building: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Polska',
    additionalInfo: [],
  });

  const navigate = useNavigate();

  // Obsługa zmiany wartości w polach formularza
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    if (typeof index === 'number') {
      const updatedAdditionalInfo = [...formData.additionalInfo];
      updatedAdditionalInfo[index] = e.target.value;
      setFormData({ ...formData, additionalInfo: updatedAdditionalInfo });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Obsługa wysyłania formularza
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!termsAccepted || !privacyAccepted) {
      alert('Musisz zaakceptować wszystkie oświadczenia.');
      return;
    }

    if (!animalId) {
      alert('Brak ID zwierzęcia! Upewnij się, że ID zwierzęcia zostało przekazane.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id: 1, // Tu możesz użyć identyfikatora zalogowanego użytkownika
        animal_id: animalId,
        adoptionData: formData,
      };

      console.log('Payload:', payload);

      await axios.post(API_URL, payload);
      alert('Formularz adopcyjny został pomyślnie wysłany!');
      navigate('/adoptions'); // Przekierowanie do widoku adopcji użytkownika
    } catch (error) {
      console.error('Error submitting adoption form:', error);
      alert('Wystąpił problem podczas wysyłania formularza.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShelterLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Nagłówek */}
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
            Formularz Adopcyjny
          </Typography>

          <Alert severity="info" sx={{ mb: 4 }}>
            Wypełnij formularz, aby zgłosić chęć adopcji zwierzęcia. Jeżeli pozytywnie przejdzie on weryfikację,
            przejdziemy do następnego etapu adopcji.
          </Alert>

          <form onSubmit={handleSubmit}>
            {/* Dane kontaktowe */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Dane kontaktowe
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Imię"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nazwisko"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Telefon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Wiek"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  type="number"
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Pytania dodatkowe */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Proces adopcyjny
            </Typography>
            <Grid container spacing={3}>
              {[
                "Kto będzie właścicielem zwierzęcia i będzie sprawować większość obowiązków związanych z jego posiadaniem?",
                "Prosimy o szczegółowy opis środowiska, w którym będzie mieszkało adoptowane zwierzę.",
                "Czy miałeś/aś w przeszłości jakieś zwierzęta domowe?",
                "Czy w Twoim najbliższym otoczeniu znajdują się inne zwierzęta?",
                "Jak będzie wyglądać standardowy dzień adoptowanego zwierzęcia w Twoim domu?",
                "Jakie jest Twoje podejście do aktywności zwierzęcia?",
                "Podaj przykładowe marki karm, jakie byś chciał podawać swojemu zwierzęciu.",
                "Czy zamierzasz uczyć adoptowane zwierzę trików i komend, uczestniczyć w kursach szkoleniowych itp.?",
                "Czy adoptowane zwierzę będzie Ci towarzyszyć w wyjazdach?",
                "Czy zdajesz sobie sprawę z długoterminowych zobowiązań związanych z adopcją?",
                "Opisz sytuacje, które mogłyby spowodować oddanie zwierzęcia.",
              ].map((question, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    required
                    fullWidth
                    label={question}
                    variant="outlined"
                    multiline
                    rows={4}
                    onChange={(e) => handleChange(e, index)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Oświadczenia */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Oświadczenia
            </Typography>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                }
                label="Oświadczam, że mam świadomość zobowiązań związanych z adopcją."
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    required
                  />
                }
                label="Wyrażam zgodę na przetwarzanie moich danych osobowych w celu realizacji adopcji."
              />
            </Box>

            {/* Przycisk Dalej */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={loading || !termsAccepted || !privacyAccepted}
              >
                {loading ? 'Wysyłanie...' : 'Wyślij'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ShelterLayout>
  );
};

export default AdoptionForm;
