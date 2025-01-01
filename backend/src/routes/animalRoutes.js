const express = require('express');
const { getAnimals, getAnmlById } = require('../controllers/animalController');
const router = express.Router();

router.get('/', getAnimals)
router.get('/:id', getAnmlById)

module.exports = router