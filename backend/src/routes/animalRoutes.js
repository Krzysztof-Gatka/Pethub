const express = require('express');
const { getAnimals, getAnmlById, addAnimal, getAnimalWalkSlots, bookWalk, getUserWalks, getAnimalWalks } = require('../controllers/animalController');
const router = express.Router();
const multer = require('multer')

const storage = multer.diskStorage({})
const upload = multer({storage})

router.get('/', getAnimals)

router.get('/user/walks', getUserWalks)

router.get('/animal/walks', getAnimalWalks)


router.get('/:animalId/available-slots', getAnimalWalkSlots)

router.post('/book-walk', bookWalk)

router.get('/:id', getAnmlById)
router.post('/add', upload.single('image'), addAnimal)

module.exports = router