const express = require('express');
const { getAnimals, getAnmlById, addAnimal, getAnimalWalkSlots } = require('../controllers/animalController');
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({})
const upload = multer({storage})

router.get('/', getAnimals)
router.get('/:id', getAnmlById)

router.get('/:animalId/available-slots', getAnimalWalkSlots)

router.post('/:animalId/book-walk', )

router.post('/add', upload.single('image'), addAnimal)

module.exports = router