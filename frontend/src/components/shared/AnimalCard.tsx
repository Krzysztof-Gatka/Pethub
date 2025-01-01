import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Navigate, useNavigate } from 'react-router-dom';

export interface AnimalModel {
    id: number;
    name: string;
    age: string;
    description: string;
    shelter_id: number;
    img_url: string;
}


const AnimalCard = ({id, name, age, description, shelter_id, img_url}:AnimalModel) => {

    const navigate = useNavigate()

    const handleCardClick = () => {
        navigate(`/animals/${id}`)
    }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {name}
        </Typography>
        <Typography variant="h5" component="div">
         {age} {id} {shelter_id}
        </Typography>
        <Typography variant="body2">
          {description}
        </Typography>
        <img src={img_url} width={200} alt="" />
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleCardClick}>Learn More</Button>
      </CardActions>
    </Card>
  )
}

export default AnimalCard
