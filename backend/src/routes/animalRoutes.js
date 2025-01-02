const express = require('express');
const { getAnimals, getAnmlById, addAnimal } = require('../controllers/animalController');
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({})
const upload = multer({storage})

router.get('/', getAnimals)
router.get('/:id', getAnmlById)

router.post('/add', upload.single('image'), addAnimal)

module.exports = router