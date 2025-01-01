const axios = require('axios')
const jwt = require('jsonwebtoken')
const {getAllAnimals, getAnimalById} = require('../repositories/animalRepository')

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



module.exports = {
    getAnimals,
    getAnmlById,
}