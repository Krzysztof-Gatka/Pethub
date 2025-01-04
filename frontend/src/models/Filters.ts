export interface AnimalFilters {
    searchTerm: string;
    category: string;
    ageRange: number[];
    shelter: string;
    species: string;
}

export interface ShelterFilters {
    searchTerm: string;
    city: string;
    animalTypes: string[];
    animalCountRange: number[];
}

// Stałe pomocnicze dla filtrów
export const ANIMAL_CATEGORIES = {
    YOUNG: 'young',
    ADULT: 'adult',
    SENIOR: 'senior'
} as const;

export const ANIMAL_SPECIES = {
    DOG: 'dog',
    CAT: 'cat',
    OTHER: 'other'
} as const;

export const DEFAULT_ANIMAL_FILTERS: AnimalFilters = {
    searchTerm: '',
    category: '',
    ageRange: [0, 20],
    shelter: '',
    species: ''
};

export const DEFAULT_SHELTER_FILTERS: ShelterFilters = {
    searchTerm: '',
    city: '',
    animalTypes: [],
    animalCountRange: [0, 1000]
};
//const [filters, setFilters] = useState<AnimalFilters>(DEFAULT_ANIMAL_FILTERS);
//<MenuItem value={ANIMAL_SPECIES.DOG}>Psy</MenuItem>
// <MenuItem value={ANIMAL_SPECIES.CAT}>Koty</MenuItem>
// <MenuItem value={ANIMAL_SPECIES.OTHER}>Inne</MenuItem>