import React, { useState } from 'react';
import { DialogContent, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { Walk } from '../../models/Walk';
import { time } from 'console';

interface WalkSchedulerProps {
  animalId: number;
  open: boolean;
  onClose: () => void;
}

interface TimeSlot {
  hour: number;
  status: 'locked' | 'booked' | 'available'
}


const WalkScheduler: React.FC<WalkSchedulerProps> = ({ user, animalId, open, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('');


  
  const timeSlots:TimeSlot[] = [
    {hour: 10, status: 'available'},
    {hour: 11, status: 'available'},
    {hour: 12, status: 'available'},
    {hour: 13, status: 'available'},
    {hour: 14, status: 'available'},
    {hour: 15, status: 'available'},
  ];

  const [slots, setSlots] = useState<TimeSlot[]>(timeSlots)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const handleSlotClick = (slot) => {
    console.log(slot)
    setSelectedSlot(slot.hour)
  }


  
  const fetchWalks = async (animalId, date) => {
    console.log('fetching walks')
    const response = await axios.get(`http://localhost:3000/api/animals/animal/walks?animalId=${animalId}&date=${date}`)
    const bookedWalks = response.data
    if(bookedWalks) {
      const bookedSlotsHours = bookedWalks.map(walk => walk.time_slot)
      const updatedSlots = slots.map(slot => {
        return {...slot, status: bookedSlotsHours.some(hour => hour == slot.hour) ? 'locked' : 'available'}
      })
      setSlots(updatedSlots)
      console.log(bookedSlotsHours)
    }
  }

  const handleBook = async () => {
    console.log('handling book')
    try {
      const response = await axios.post(
        'http://localhost:3000/api/animals/book-walk',
        {
          animalId,
          userId: user.userId,
          date: selectedDate,
          timeSlot: selectedSlot
        }
      )

      alert('termin został zarezerwowany')
    } catch (err) {
      console.log(err)
    }
    
  }

  const handleDataChange = (e) => {
    fetchWalks(animalId, e.target.value);
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
    console.log(e.target.value);
  }

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
          onChange={handleDataChange}
          InputProps={{
            inputProps: { min: new Date().toISOString().split('T')[0] }
          }}
        />

        {
          selectedDate != '' &&
            (
              <>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {slots.map((slot) => (
                  <Button 
                    key={slot.hour} 
                    variant={(selectedSlot == slot.hour) ? "contained" : "outlined"} 
                    sx={{ py: 2 }}
                    disabled={slot.status == 'locked'}
                    onClick={() => handleSlotClick(slot)}
                  >
                    {`${slot.hour}:00`}
                  </Button>
                ))}
                </Box>
                {
                  selectedSlot && 

                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleBook}
                  >
                    Zarezerwuj termin
                  </Button>
                }
                
              </>
              
            )
        }
      </Box>
    </Box>
  );
};

export default WalkScheduler;