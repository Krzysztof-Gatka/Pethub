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
  Divider,
  Grid,
  Alert
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ShelterLayout from '../../layouts/ShelterLayout';

interface AdoptionFormProps {
  animalId?: string;
  animalName?: string;
}

const AdoptionForm: React.FC<AdoptionFormProps> = ({ animalId, animalName }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Tutaj dodamy logikę wysyłania formularza
  };

  return (
    <ShelterLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Nagłówek */}
          <Typography variant="h4" component="h1" gutterBottom sx={{
            textAlign: 'center',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}>
            <PetsIcon fontSize="large" />
            Formularz Adopcyjny
          </Typography>

          <Alert severity="info" sx={{ mb: 4 }}>
            Uwaga! Odpisujemy tylko na wybrane zgłoszenia.
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
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nazwisko"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Telefon"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Wiek"
                  type="number"
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Adres
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Ulica"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Numer"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Miasto"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Województwo"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Kod pocztowy"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Państwo"
                  variant="outlined"
                  defaultValue="Polska"
                />
              </Grid>
            </Grid>

            {/* Proces adopcyjny */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Proces adopcyjny
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Imię zwierzęcia"
                  variant="outlined"
                  defaultValue={animalName || ''}
                />
              </Grid>
              {[
                "Kto będzie właścicielem zwierzęcia i będzie sprawować większość obowiązków związanych z jego posiadaniem?",
                "Prosimy o szczegółowy opis środowiska, w którym będzie mieszkało adoptowane zwierzę.",
                "Czy miałeś/aś w przeszłości jakieś zwierzęta domowe?",
                "Czy w Twoim najbliższym otoczeniu znajdują się inne zwierzęta?",
                "Jak będzie wyglądać standardowy dzień adoptowanego zwierzęcia w Twoim domu?",
                "Jakie jest Twoje podejście do aktywności zwierzęcia?",
                "Podaj przykładowe marki karm jakie byś chciał podawać swojemu zwierzęciu.",
                "Czy zamierzasz uczyć adoptowane zwierzę trików i komend, uczestniczyć w kursach szkoleniowych itp.?",
                "Czy adoptowane zwierzę będzie Ci towarzyszyć w wyjazdach?",
                "Czy zdajesz sobie sprawę z długoterminowych zobowiązań związanych z adopcją?",
                "Opisz sytuacje, które mogłyby spowodować oddanie zwierzęcia."
              ].map((question, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    required
                    fullWidth
                    label={question}
                    variant="outlined"
                    multiline
                    rows={4}
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
                label="Oświadczam, że mam świadomość, że przed adopcją należy upewnić się że u żadnego z domowników nie występuje alergia na sierść lub ślinę zwierzęcia a jeśli występuje należy adopcję skonsultować z lekarzem."
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
                label="Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z polityką prywatności w celu realizacji procesu i umowy adopcyjnej."
              />
            </Box>

            {/* Przycisk Dalej */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!termsAccepted || !privacyAccepted}
              >
                Dalej
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ShelterLayout>
  );
};

export default AdoptionForm;