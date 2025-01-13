const express = require('express');
const { jwtAuth } = require('../middlewares/authMiddleware');
const { createUserProfile, createShelterProfile } = require('../controllers/profileController');


const multer = require('multer')

const storage = multer.diskStorage({})
const upload = multer({storage})

const router = express.Router();

router.post('/shelter/create', upload.single('image'),createShelterProfile);

router.post('/user/create', createUserProfile);


module.exports = router;