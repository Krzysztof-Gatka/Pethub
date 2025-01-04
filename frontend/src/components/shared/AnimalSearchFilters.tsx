import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  IconButton,
  Collapse
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { 
  AnimalFilters, 
  DEFAULT_ANIMAL_FILTERS,
  ANIMAL_CATEGORIES,
  ANIMAL_SPECIES 
} from '../../models/Filters';

interface AnimalSearchFiltersProps {
  onFilterChange: (filters: AnimalFilters) => void;
  shelters: { id: number; name: string; }[];
}

const AnimalSearchFilters: React.FC<AnimalSearchFiltersProps> = ({ onFilterChange, shelters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AnimalFilters>(DEFAULT_ANIMAL_FILTERS);

  const handleChange = (field: keyof AnimalFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Szukaj zwierzaka"
          variant="outlined"
          value={filters.searchTerm}
          onChange={(e) => handleChange('searchTerm', e.target.value)}
        />
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? <CloseIcon /> : <FilterListIcon />}
        </IconButton>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <FormControl fullWidth>
            <InputLabel>Gatunek</InputLabel>
            <Select
              value={filters.species}
              label="Gatunek"
              onChange={(e) => handleChange('species', e.target.value)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value={ANIMAL_SPECIES.DOG}>Psy</MenuItem>
              <MenuItem value={ANIMAL_SPECIES.CAT}>Koty</MenuItem>
              <MenuItem value={ANIMAL_SPECIES.OTHER}>Inne</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Kategoria</InputLabel>
            <Select
              value={filters.category}
              label="Kategoria"
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value={ANIMAL_CATEGORIES.YOUNG}>Młode</MenuItem>
              <MenuItem value={ANIMAL_CATEGORIES.ADULT}>Dorosłe</MenuItem>
              <MenuItem value={ANIMAL_CATEGORIES.SENIOR}>Seniorzy</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Schronisko</InputLabel>
            <Select
              value={filters.shelter}
              label="Schronisko"
              onChange={(e) => handleChange('shelter', e.target.value)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              {shelters.map((shelter) => (
                <MenuItem key={shelter.id} value={shelter.id}>
                  {shelter.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ px: 2 }}>
            <Typography gutterBottom>Wiek</Typography>
            <Slider
              value={filters.ageRange}
              onChange={(_, newValue) => handleChange('ageRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={20}
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AnimalSearchFilters;