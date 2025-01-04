import React, { useState } from 'react'
import {
    Box,
    Button,
    TextField,
    Typography,
    Grid,
    Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface FormData {
    email?: string;
    password: string;
}

const API_URL = 'http://localhost:3000'

const SignUpForm = () => {

    const { role } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        email:'',
        password:''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handling submit')
        try {
            const response = await axios.post(
                `${API_URL}/auth/signup?role=${role}`,
                formData,
            )
            const userId = response.data.userId
            if (role == 'shelter') {
                navigate(`/shelterProfileForm?userId=${userId}`)
            } else {
                navigate(`/userProfileForm?userId=${userId}`)
            }

        } catch (err) {
            console.log(err)
        }
        
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Rejestracja konta {role == 'user' ? 'użytkownika' : 'schroniska'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* email Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                    </Grid>

                    {/* password Field */}
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            variant="outlined"
                            type="password"
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                        >
                            Zarejestruj się
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Paper>
  )
}

export default SignUpForm
