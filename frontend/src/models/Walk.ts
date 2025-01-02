export interface Walk {
    id: number; // Unique identifier for the walk
    animalId: number; // ID of the animal
    userId: number; // ID of the user who booked the walk
    date: string; // Date of the walk in 'YYYY-MM-DD' format
    timeSlot: string; // Time of the walk in 'HH:mm:ss' format
    status: 'booked' | 'completed' | 'cancelled'; // Status of the walk
    createdAt?: string; // Timestamp of when the record was created (optional)
  }