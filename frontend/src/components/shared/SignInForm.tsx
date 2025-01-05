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
import { useAuth } from '../../hooks/useAuth';


interface FormData {
    email?: string;
    password: string;
}
const API_URL = 'http://localhost:3000'

const SignInForm = () => {

    const [formData, setFormData] = useState<FormData>({
        email:'',
        password:''
    })
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handling submit')
        try {
            const response = await axios.post(
                `${API_URL}/auth/signin`,
                formData,{withCredentials: true}
            )
            console.log(response)

            window.location.href='http://localhost:5173'


        } catch (err) {
            setFormData({...formData, password:''})
            console.log(err)
            alert('Wprowadzono nieprawidłowe hasło')
        }
        
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Logowanie 
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
                            Zaloguj się
                        </Button>
                    </Grid>

                </Grid>
            </form>
        </Paper>
  )
}

export default SignInForm
