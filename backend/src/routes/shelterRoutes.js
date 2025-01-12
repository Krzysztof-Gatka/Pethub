const express = require('express');
const router = express.Router();
const { 
    createShelterProfile, 
    updateShelterProfile, 
    deleteShelterProfile,
    getShelterProfile,
    getShelterProfiles
} = require('../controllers/shelterController');

router.get('/profile', getShelterProfile);
router.get('/profiles', getShelterProfiles);
router.get('/shelters', getShelterProfiles);

router.post('/profile', createShelterProfile);

router.put('/profile', updateShelterProfile);

router.delete('/profile', deleteShelterProfile);

module.exports = router;