import React, { useState } from 'react';
import { DialogContent, Box, Button, TextField, Typography } from '@mui/material';

interface WalkSchedulerProps {
  animalId: number;
  open: boolean;
  onClose: () => void;
}

const WalkScheduler: React.FC<WalkSchedulerProps> = ({ animalId, open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const timeSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Wybierz termin spaceru
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          type="date"
          fullWidth
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputProps={{
            inputProps: { min: new Date().toISOString().split('T')[0] }
          }}
        />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {timeSlots.map((time) => (
            <Button 
              key={time} 
              variant="outlined" 
              sx={{ py: 2 }}
            >
              {time}
            </Button>
          ))}
        </Box>
        <Button variant="contained" color="primary">
          Zarezerwuj termin
        </Button>
      </Box>
    </Box>
  );
};

export default WalkScheduler;