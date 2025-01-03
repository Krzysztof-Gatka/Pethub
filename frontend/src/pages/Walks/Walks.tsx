import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import WalkCard from '../../components/shared/WalkCard';
import ShelterLayout from '../../layouts/ShelterLayout';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

interface Walk {
 id: number;
 animalName: string; 
 shelterName: string;
 walkTime: string;
 imageUrl: string;
}

const Walks = () => {
 const [walks, setWalks] = useState<Walk[]>([]);

 //do testów
//  useEffect(() => {
//   setWalks([
//     {
//       id: 1,
//       animalName: "Max",
//       shelterName: "Schronisko Na Paluchu",
//       walkTime: "2024-01-04 15:00",
//       imageUrl: "/sample-dog-1.jpg"
//     }
//   ]);
// }, []);

//to czeka na dane z api
 useEffect(() => {
   const fetchWalks = async () => {
     try {
       const response = await axios.get('http://localhost:3000/api/animals/walks');
       setWalks(response.data);
     } catch (error) {
       console.error('Error fetching walks:', error);
     }
   };
   fetchWalks();
 }, []);

 const handleCancelWalk = async (walkId: number) => {
   try {
     await axios.delete(`http://localhost:3000/api/animals/walks/${walkId}`);
     setWalks(walks.filter(walk => walk.id !== walkId));
   } catch (error) {
     console.error('Error canceling walk:', error);
   }
 };

 return (
   <ShelterLayout>
     <Container maxWidth="lg" sx={{ py: 4 }}>
       <Typography variant="h4" component="h1" gutterBottom sx={{ 
         textAlign: 'center',
         mb: 4,
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'center',
         gap: 2
       }}>
         <DirectionsWalkIcon fontSize="large" />
         Zaplanowane spacery
       </Typography>

       <Grid container spacing={3}>
         {walks.map((walk) => (
           <Grid item xs={12} sm={6} md={4} key={walk.id}>
             <WalkCard
               id={walk.id}
               animalName={walk.animalName}
               shelterName={walk.shelterName}
               walkTime={walk.walkTime}
               imageUrl={walk.imageUrl}
               onCancelWalk={handleCancelWalk}
             />
           </Grid>
         ))}
       </Grid>
     </Container>
   </ShelterLayout>
 );
};

export default Walks;