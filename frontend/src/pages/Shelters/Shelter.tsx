import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  Button,
  Collapse
} from '@mui/material';
import Navbar from '../../components/Navbar';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PetsIcon from '@mui/icons-material/Pets';
import { ShelterModel } from '../../models/Shelter';
import AnimalCard from '../../components/shared/AnimalCard';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

const Shelter = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuth();
  const [shelter, setShelter] = useState<ShelterModel | null>(null);
  const [animals, setAnimals] = useState([]);
  const [showAnimals, setShowAnimals] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const fetchAnimals = async () => {
    const response = await axios.get(`http://localhost:3000/api/animals/shelter?id=${Number(id)}`)
    const animals = response.data
    setAnimals(animals)
  }

  const fetchShelter = async () => {
    const response = await axios.get(`http://localhost:3000/api/shelter/profile?id=${Number(id)}`)
    const shelter = response.data
    console.log(shelter)
    setShelter(shelter);
  }

  useEffect(() => {
    fetchShelter();
    fetchAnimals();
    // Dane testowe schroniska
    // const testShelter: ShelterModel = {
    //   shelter_id: parseInt(id || '1'),
    //   name: "Schronisko Na Paluchu",
    //   street: "ul. Paluch 2",
    //   city: "Warszawa",
    //   postal_code: "02-147",
    //   building: "",
    //   description: "Największe schronisko dla bezdomnych zwierząt w Warszawie",
    //   phone: "+48 22 868 15 79",
    //   email: "kontakt@napaluchu.waw.pl"
    // };
  }, [id]);

  // Dane testowe zwierząt
  const mockAnimals = [
    {
      id: 1,
      name: "Max",
      age: "5 lat",
      description: "Przyjazny golden retriever",
      img_url: "/sample-dog-1.jpg",
      species: "dog"
    },
    {
      id: 2,
      name: "Luna",
      age: "3 lata",
      description: "Spokojna kotka",
      img_url: "/sample-cat-1.jpg",
      species: "cat"
    },
    {
      id: 3,
      name: "Rex",
      age: "2 lata",
      description: "Energiczny owczarek niemiecki",
      img_url: "/sample-dog-2.jpg",
      species: "dog"
    }
  ];

  const handleShowAnimals = () => {
    if (!showAnimals) {
      // fetchAnimals();
      // setAnimals(mockAnimals);
    }
    setShowAnimals(!showAnimals);
  };

  const handleFollow = async () => {
    setIsFollowed(!isFollowed);
  };

  if (!shelter) return null;

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Typography variant="h4" component="h1">
              {shelter.name}
            </Typography>
            {isLoggedIn && (
              <Button
                variant={isFollowed ? "contained" : "outlined"}
                color="primary"
                onClick={handleFollow}
              >
                {isFollowed ? 'Obserwujesz' : 'Obserwuj'}
              </Button>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>
                  {`${shelter.street} ${shelter.building}, ${shelter.postal_code} ${shelter.city}`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>{`${shelter.phone_number.split('').slice(0,3).join('')} ${shelter.phone_number.split('').slice(3,6).join('')} ${shelter.phone_number.split('').slice(6,9).join('')}`}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>{shelter.email}</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 4 }}>
                {shelter.description}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={handleShowAnimals}
            startIcon={<PetsIcon />}
            fullWidth
          >
            {showAnimals ? 'Ukryj zwierzęta' : 'Pokaż dostępne zwierzęta'}
          </Button>
        </Paper>

        <Collapse in={showAnimals}>
          <Grid container spacing={3}>
            {animals.map((animal) => (
              <Grid item xs={12} sm={6} md={4} key={animal.id}>
                <AnimalCard {...animal} />
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Container>
    </>
  );
};

export default Shelter;