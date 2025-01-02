import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
} from '@mui/material';

const AnimalAdd: React.FC = () => {
    const [form, setForm] = useState({
        name: '',
        age: '',
        description: '',
        shelter_id: '',
    });
    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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
        formData.append('age', form.age);
        formData.append('description', form.description);
        formData.append('shelter_id', form.shelter_id);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:3000/api/animals/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Create Animal Profile
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Name Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                    </Grid>

                    {/* Age Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            variant="outlined"
                            type="number"
                            required
                        />
                    </Grid>

                    {/* Description Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={4}
                            required
                        />
                    </Grid>

                    {/* Shelter ID Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Shelter ID"
                            name="shelter_id"
                            value={form.shelter_id}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                    </Grid>

                    {/* Image Upload Field */}
                    <Grid item xs={12}>
                        <Button variant="contained" component="label" fullWidth>
                            Upload Image
                            <input
                                type="file"
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                        {image && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Selected File: {image.name}
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
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default AnimalAdd;