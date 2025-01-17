import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Container, 
  Box, 
  Card, 
  CardContent, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';

interface FormData {
  firstName?: string;
  lastName?: string;
  phone: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  name?: string;
  description?: string;
  shelter_id?:number;
  city?: string,
  street?: string,
  postal_code?: string;
  building?: string;
}

interface ProfileFormProps {
  type: 'user' | 'shelter';
}

const ProfileForm: React.FC<ProfileFormProps> = ({ type }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {user} = useAuth();
  console.log('Logged in user:', user);
  const [image, setImage] = useState<File | null>(null);
  
  
  const [formData, setFormData] = useState<FormData>({
    ...(type === 'user' ? {
      firstName: '',
      lastName: '',
      phone: '',
      age: undefined,
      gender: undefined
    } : {
      name: '',
      phone: '',
      description: ''
    })
  });

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.userId = searchParams.get('userId');
    console.log(formData)
    try {
      console.log('sending create profile request')
      const response = await axios.post(`http://localhost:3000/api/profiles/user/create`, formData);
      console.log(response.data)
      navigate('/')
    } catch(error) {
      console.log('Błąd podczas zapisywania profilu')
    }
  }

// ...
const handleShelterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // userId bierzemy np. z kontekstu `useAuth()` lub z parametru:
  // formData.userId = user?.userId; // lub cokolwiek innego
  // na ten moment userId bierzemy z URL, jednak domyślnie będziemy korzystać z useAuth()
  formData.userId = searchParams.get('userId');

  // Na backend wysyłamy parametry: 
  //  userId, name, city, street, postal_code, building, description, phone
  // a nie "address" ;)
  
  if (image) formData.image = image; // jeśli chcesz wysyłać zdjęcie
  
  try {
    const response = await axios.post(
      `http://localhost:3000/api/profiles/shelter/create`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    window.location.href = "http://localhost:5173/"
    // ...
  } catch (error) {
    console.log('Błąd podczas zapisywania profilu schroniska');
  }
};




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Wysyłanie danych:', { userId, ...formData });
      navigate('/');
    } catch (error) {
      console.error('Błąd podczas zapisywania profilu:', error);
    }
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file)
      console.log('Wybrano plik:', file);
      // Tutaj logika uploadu pliku
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {type === 'shelter' ? 'Profil schroniska' : 'Profil użytkownika'}
        </Typography>
        
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box component="form" onSubmit={type == 'user' ? handleUserSubmit : handleShelterSubmit} sx={{ p: 2 }}>
              {type === 'user' ? (
                <>
                  <TextField
                    fullWidth
                    label="Imię"
                    value={formData.firstName}
                    onChange={handleChange('firstName')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Nazwisko"
                    value={formData.lastName}
                    onChange={handleChange('lastName')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Wiek"
                    type="number"
                    value={formData.age || ''}
                    onChange={handleChange('age')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                fullWidth
                label="Telefon"
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                required
                sx={{ mb: 3 }}
              />
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Płeć</InputLabel>
                    <Select
                      value={formData.gender || ''}
                      label="Płeć"
                      onChange={handleChange('gender')}
                      required
                    >
                      <MenuItem value="male">Mężczyzna</MenuItem>
                      <MenuItem value="female">Kobieta</MenuItem>
                      <MenuItem value="other">Inna</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Nazwa"
                    value={formData.name}
                    onChange={handleChange('name')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Miasto"
                    value={formData.city}
                    onChange={handleChange('city')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Ulica"
                    value={formData.street}
                    onChange={handleChange('street')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Kod pocztowy"
                    value={formData.postal_code}
                    onChange={handleChange('postal_code')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Numer budynku"
                    value={formData.building}
                    onChange={handleChange('building')}
                    required
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Opis"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange('description')}
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Telefon"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    required
                    sx={{ mb: 3 }}
                  />

                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 3 }}
                    fullWidth
                  >
                    Wgraj zdjęcie
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </>
              )}
              
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                sx={{ py: 2 }}
              >
                ZAPISZ PROFIL
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export const UserProfileForm = () => <ProfileForm type="user" />;
export const ShelterProfileForm = () => <ProfileForm type="shelter" />;

export default ProfileForm;