const axios = require('axios')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const {getAllAnimals, getAnimalById, insertImg, insertAnimalData, getBookedSlots, insertBookedSlot, selectUserWalks, selectAnimalWalks, selectAnimalBookedWalks} = require('../repositories/animalRepository')

const getAnimals = async (req, res) => {
    try {
      const rows = await getAllAnimals();
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
  console.log('test')
  try {
    const {name, age, description, shelter_id } = req.body;

    console.log(name)
    console.log(req.file.path)
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result)
    const insertedId = await insertAnimalData(name, age, description, shelter_id); 
    console.log('test1')
    const insertedImg = await insertImg(insertedId, result.secure_url)
    console.log('test2')

    res.status(201).json({message: 'Animal profile created succesfully'});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
}

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
  console.log(req.body)
  const { animalId, userId, date, timeSlot } = req.body;
  try {
    const result = insertBookedSlot(animalId, userId, date, timeSlot)
    res.status(201).json({ message: 'Walk successfully booked.' });
  } catch (error) {
      res.status(500).json({ error: 'Error booking the walk.' });
  }

}

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
    getAnimalWalks
}