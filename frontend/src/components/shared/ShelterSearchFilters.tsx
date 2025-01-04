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
import { ShelterFilters, DEFAULT_SHELTER_FILTERS } from '../../models/Filters';

interface ShelterSearchFiltersProps {
  onFilterChange: (filters: ShelterFilters) => void;
  cities: string[];
}

const ShelterSearchFilters: React.FC<ShelterSearchFiltersProps> = ({ onFilterChange, cities }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ShelterFilters>(DEFAULT_SHELTER_FILTERS);

  const handleChange = (field: keyof ShelterFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Szukaj schroniska"
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
            <InputLabel>Miejscowość</InputLabel>
            <Select
              value={filters.city}
              label="Miejscowość"
              onChange={(e) => handleChange('city', e.target.value)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Rodzaje zwierząt</InputLabel>
            <Select
              multiple
              value={filters.animalTypes}
              label="Rodzaje zwierząt"
              onChange={(e) => handleChange('animalTypes', e.target.value)}
            >
              <MenuItem value="dogs">Psy</MenuItem>
              <MenuItem value="cats">Koty</MenuItem>
              <MenuItem value="other">Inne</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ px: 2 }}>
            <Typography gutterBottom>Liczba zwierząt</Typography>
            <Slider
              value={filters.animalCountRange}
              onChange={(_, newValue) => handleChange('animalCountRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
            />
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ShelterSearchFilters;