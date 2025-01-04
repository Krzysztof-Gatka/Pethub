import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export interface AnimalModel {
    id: number;
    name: string;
    age: string;
    description: string;
    shelter_id: number;
    img_url: string;
}

const AnimalCard = ({id, name, age, description, shelter_id, img_url}: AnimalModel) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleCardClick = () => {
        navigate(`/animals/${id}`);
    };

    const handleAdopt = () => {
        navigate(`/adopt/${id}`);
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            {img_url &&
                <CardMedia
                    sx={{ height: 140 }}
                    image={img_url}
                    title={name}
                />
            }
            
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Wiek: {age}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleCardClick} size="small">Szczegóły</Button>
                {isLoggedIn && (
                    <Button onClick={handleAdopt} size="small">Adoptuj</Button>
                )}
            </CardActions>
        </Card>
    );
};

export default AnimalCard;