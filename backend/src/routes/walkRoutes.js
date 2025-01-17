const express = require('express');
const { getWalks, removeWalk, getShelterWalks, getWalksForAnimal  } = require('../controllers/walkController');
const router = express.Router();


router.get('/', getWalks)
router.get('/shelter/:shelterId', getShelterWalks);
router.get('/animal/:animalId', getWalksForAnimal);
router.delete('/:id', removeWalk)



module.exports = router

