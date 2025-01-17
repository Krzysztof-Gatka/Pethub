import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface AdoptionDetails {
  adoption_id: number;
  animal_name: string;
  user_name: string;
  user_email: string;
  status: string;
  date: string;
  answers: string[];
}

const AdoptionResponses: React.FC = () => {
  const { adoptionId } = useParams<{ adoptionId: string }>();
  const [details, setDetails] = useState<AdoptionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdoptionDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/adoptions/${adoptionId}/details`);
        setDetails(response.data);
      } catch (error: any) {
        console.error('Error fetching adoption details:', error);
        setError('Nie udało się załadować szczegółów adopcji.');
      }
    };

    fetchAdoptionDetails();
  }, [adoptionId]);

  if (error) {
    return (
      <Container>
        <Typography variant="h4" color="error">{error}</Typography>
      </Container>
    );
  }

  if (!details) {
    return (
      <Container>
        <Typography variant="h4">Ładowanie szczegółów adopcji...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Szczegóły adopcji</Typography>
        <Typography variant="h6">Zwierzę: {details.animal_name}</Typography>
        <Typography>Data złożenia: {details.date}</Typography>
        <Typography>Status: {details.status}</Typography>
        <Typography>Imię i nazwisko: {details.user_name}</Typography>
        <Typography>Email: {details.user_email}</Typography>

        <Box mt={4}>
          <Typography variant="h5">Odpowiedzi z formularza</Typography>
          {details.answers.map((answer, index) => (
            <Typography key={index} sx={{ mt: 2 }}>
              {index + 1}. {answer}
            </Typography>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdoptionResponses;
