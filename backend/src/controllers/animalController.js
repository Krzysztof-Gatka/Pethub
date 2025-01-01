const axios = require('axios')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const {getAllAnimals, getAnimalById, insertImg, insertAnimalData} = require('../repositories/animalRepository')

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



module.exports = {
    getAnimals,
    getAnmlById,
    addAnimal,
}