const axios = require('axios')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const {getAllAnimals, getAnimalById, insertImg, insertAnimalData, getBookedSlots, insertBookedSlot, selectUserWalks, selectAnimalWalks, selectAnimalBookedWalks, selectAnimalsByShelterId} = require('../repositories/animalRepository')
const { addNotification } = require('./notificationController');


const getAnimals = async (req, res) => {
    try {
      const rows = await getAllAnimals();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const getAnimalsByShelterId = async (req, res) => {
  const {id} = req.query 
  console.log(id)
  try {
    const rows = await selectAnimalsByShelterId(id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const getAnmlById = async (req, res) => {
  const animalId = req.params.id;

  try {
    const rows = await getAnimalById(Number(animalId));
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const addAnimal = async (req, res) => {
  try {
      const { name, birth_date, description, type, breed, shelter_id } = req.body;
      const date_joined = new Date().toISOString().split('T')[0]; // Automatyczna data dołączenia
      const imageUrl = req.file ? req.file.path : null; // Jeśli obraz jest przesyłany

      // Wstaw dane do bazy danych
      await insertAnimalData(name, birth_date, description, type, breed, shelter_id, date_joined, imageUrl);
      res.status(201).json({ message: 'Animal added successfully' });
  } catch (err) {
      console.error('Error inserting animal', err);
      res.status(500).json({ error: err.message });
  }
};


const getAnimalWalks = async (req, res) => {
  const { animalId, date } = req.query;
  const bookedWalks = await selectAnimalBookedWalks(animalId, date)
  console.log(bookedWalks)
  res.json(bookedWalks)
}

const getAnimalWalkSlots = async (req, res) => {
    const { animalId } = req.params;
    console.log(animalId)
    const { date } = req.query; // e.g., "2025-01-05"
    console.log(date)
    const bookedSlots = await getBookedSlots(animalId, date)
    console.log(bookedSlots)
    return res.json(bookedSlots)

    const allSlots = [...Array(24).keys()].map(hour => `${hour.toString().padStart(2, '0')}:00:00`);
    const availableSlots = allSlots.filter(slot => bookedSlots.some(b => b.time_slot === slot));
    res.json(availableSlots);
}

const bookWalk = async (req, res) => {
  console.log(req.body);
  const { animalId, userId, date, timeSlot } = req.body;
  try {
    const result = await insertBookedSlot(animalId, userId, date, timeSlot);

    // Dodaj powiadomienie
    await addNotification(
      userId,
      'new_walk',
      `Zaplanowano spacer z zwierzęciem o ID ${animalId} na ${date} o godzinie ${timeSlot}:00.`
    );

    res.status(201).json({ message: 'Walk successfully booked.' });
  } catch (error) {
    console.error('Error booking walk:', error.message);
    res.status(500).json({ error: 'Error booking the walk.' });
  }
};

const getUserWalks = async (req, res) => {
  const { userId } = req.query;
  console.log(userId)
  const walks = await selectUserWalks(Number(userId));
  res.json(walks);
}





module.exports = {
    getAnimals,
    getAnmlById,
    addAnimal,
    getAnimalWalkSlots,
    bookWalk,
    getUserWalks,
    getAnimalWalks,
    getAnimalsByShelterId
}