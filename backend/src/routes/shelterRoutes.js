const express = require('express');
const router = express.Router();
const { 
    createShelterProfile, 
    updateShelterProfile, 
    deleteShelterProfile,
    getShelterProfile,
    getShelterProfiles
} = require('../controllers/shelterController');

// Get shelter profile
router.get('/profile', getShelterProfile);
router.get('/profiles', getShelterProfiles);
router.get('/shelters', getShelterProfiles);

// Create new shelter profile
router.post('/profile', createShelterProfile);

// Update shelter profile
router.put('/profile', updateShelterProfile);

// Delete shelter profile
router.delete('/profile', deleteShelterProfile);

module.exports = router;