export interface Walk {
    id: number; // Unique identifier for the walk
    animal_id: number; // ID of the animal
    user_id: number; // ID of the user who booked the walk
    date: string; // Date of the walk in 'YYYY-MM-DD' format
    time_slot: number; // Time of the walk in 'HH:mm:ss' format
    created_at?: string; // Timestamp of when the record was created (optional)
  }