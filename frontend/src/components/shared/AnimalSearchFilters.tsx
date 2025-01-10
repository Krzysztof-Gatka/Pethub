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
  Collapse,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { AnimalFilters, DEFAULT_ANIMAL_FILTERS } from '../../models/Filters';

interface AnimalSearchFiltersProps {
  onFilterChange: (filters: AnimalFilters) => void;
  onPageReset: () => void; // Dodano nowy props do resetowania strony
  shelters: { id: number; name: string }[];
}

const AnimalSearchFilters: React.FC<AnimalSearchFiltersProps> = ({ onFilterChange, onPageReset, shelters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AnimalFilters>({
    ...DEFAULT_ANIMAL_FILTERS,
    shelter: '', // Domyślna wartość dla schroniska
    ageRange: "", // Domyślna wartość dla wieku
  });

  const handleChange = (field: keyof AnimalFilters, value: any) => {
    console.log(`Pole: ${field}, Wartość: ${value}`); // Debugowanie
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    onPageReset(); // Resetowanie strony
  };

  console.log('Schroniska:', shelters); // Debugowanie schronisk

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
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {/* Filtr Gatunek */}
          <FormControl fullWidth>
            <InputLabel>Gatunek</InputLabel>
            <Select
              value={filters.species || ''}
              label="Gatunek"
              onChange={(e) => handleChange('species', e.target.value)}
            >
              <MenuItem value="">Wszystkie</MenuItem>
              <MenuItem value="dog">Pies</MenuItem>
              <MenuItem value="cat">Kot</MenuItem>
            </Select>
          </FormControl>

          {/* Filtr Wiek */}
<FormControl fullWidth>
  <InputLabel> Wiek </InputLabel>
  <Select
    labelId="age-range-label"
    value={filters.ageRange || ''}
    label="Wiek"
    onChange={(e) => handleChange('ageRange', e.target.value)}
  >
    <MenuItem value="">Wszystkie</MenuItem>
    <MenuItem value="young">Młode (0-2 lata)</MenuItem>
    <MenuItem value="adult">Dorosłe (3-7 lat)</MenuItem>
    <MenuItem value="senior">Starsze (8+ lat)</MenuItem>
  </Select>
</FormControl>



          {/* Filtr Schronisko */}
          <FormControl fullWidth>
            <InputLabel>Schronisko</InputLabel>
            <Select
              value={filters.shelter || ''} // Domyślna wartość
              label="Schronisko"
              onChange={(e) => handleChange('shelter', Number(e.target.value))} // Konwersja na liczbę
            >
              <MenuItem value="">Wszystkie schroniska</MenuItem>
              {shelters.map((shelter) => (
                <MenuItem key={shelter.id} value={shelter.id}>
                  {shelter.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AnimalSearchFilters;
