import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import WalkCard from '../../components/shared/WalkCard';
import ShelterLayout from '../../layouts/ShelterLayout';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

interface Walk {
 walk_id:number;
 id: number;
 name: string; 
 shelterName: string;
 time_slot: number;
 img_url: string;
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
const fetchWalks = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/walks', { withCredentials: true });
    console.log(response.data.walks);
    setWalks(response.data.walks);
  } catch (error) {
    console.error('Error fetching walks:', error);
  }
};
 useEffect(() => {
   fetchWalks();
 }, []);

 const handleCancelWalk = async (walkId: number) => {
  console.log(walkId)
   try {
     await axios.delete(`http://localhost:3000/api/walks/${walkId}`);
    //  setWalks(walks.filter(walk => walk.id !== walkId));
     fetchWalks();
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
           <Grid item xs={12} sm={6} md={4} key={walk.walk_id}>
             <WalkCard
               id={walk.id}
               animalName={walk.name}
               shelterName={walk.shelterName}
               date={walk.date}
               walkTime={walk.time_slot}
               imageUrl={walk.img_url}
               onCancelWalk={() => handleCancelWalk(walk.walk_id)}
             />
           </Grid>
         ))}
       </Grid>
     </Container>
   </ShelterLayout>
 );
};

export default Walks;