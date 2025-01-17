const express = require('express');
const {
  createNewAdoption,
  getAdoptionsForUser,
  getAdoptionsForShelter,
  updateAdoption,
  deleteAdoption,
  getAdoptionFormDetails,
  getAdoptionsForAnimal,
} = require('../controllers/adoptionController');

const router = express.Router();

router.post('/', createNewAdoption); // Dodawanie nowego wniosku
router.get('/user/:userId', getAdoptionsForUser); // Pobieranie adopcji użytkownika
router.get('/shelter/:shelterId', getAdoptionsForShelter); // Pobieranie adopcji schroniska
router.put('/:adoptionId', updateAdoption); // Aktualizowanie statusu adopcji
router.delete('/:adoptionId', deleteAdoption); 
router.get('/shelter/:shelterId', getAdoptionsForShelter);
router.get('/:adoptionId/details', getAdoptionFormDetails);
router.get('/animal/:id', getAdoptionsForAnimal);




module.exports = router;
