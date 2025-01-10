import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
      {/* Wyszukiwarka */}
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

      {/* Filtr miejscowości */}
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
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default ShelterSearchFilters;
