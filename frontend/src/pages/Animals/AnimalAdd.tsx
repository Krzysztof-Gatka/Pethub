import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import ShelterLayout from '../../layouts/ShelterLayout';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from "react-router-dom";


const AnimalAdd: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuth();
    const [form, setForm] = useState({
        name: '',
        birth_date: '',
        date_joined: new Date().toISOString().split('T')[0], // Dzisiejsza data
        description: '',
        type: '',
        breed: '',
        shelter_id: user?.userId || '', // Identyfikator schroniska
    });
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setForm({ ...form, [e.target.name]: e.target.value as string });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('birth_date', form.birth_date);
        formData.append('date_joined', form.date_joined);
        formData.append('description', form.description);
        formData.append('type', form.type);
        formData.append('breed', form.breed);
        formData.append('shelter_id', form.shelter_id);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:3000/api/animals/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
            alert('Profil zwierzęcia został dodany!');
            navigate('/shelter/animals')
        } catch (error) {
            console.error('Błąd podczas dodawania zwierzęcia:', error);
            alert('Nie udało się dodać profilu zwierzęcia.');
        }

        
    };

    return (
        <ShelterLayout>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Stwórz nowy profil zwierzęcia
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Name Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Imię"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Birth Date Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Data urodzenia"
                                name="birth_date"
                                type="date"
                                value={form.birth_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Date Joined Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Data dołączenia"
                                name="date_joined"
                                type="date"
                                value={form.date_joined}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Type Field */}
                        <Grid item xs={12}>
                            <FormControl fullWidth variant="outlined" required>
                                <InputLabel>Typ</InputLabel>
                                <Select
                                    value={form.type}
                                    onChange={handleSelectChange}
                                    name="type"
                                    label="Typ"
                                >
                                    <MenuItem value="dog">Pies</MenuItem>
                                    <MenuItem value="cat">Kot</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Breed Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Rasa"
                                name="breed"
                                value={form.breed}
                                onChange={handleChange}
                                variant="outlined"
                                required
                            />
                        </Grid>

                        {/* Description Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Opis"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                variant="outlined"
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>

                        {/* Image Upload Field */}
                        <Grid item xs={12}>
                            <Button variant="contained" component="label" fullWidth>
                                Wgraj zdjęcie
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </Button>
                            {image && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Wybrano plik: {image.name}
                                </Typography>
                            )}
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                            >
                                Dodaj profil
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </ShelterLayout>
    );
};

export default AnimalAdd;
