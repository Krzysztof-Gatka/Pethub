const express = require('express');
const { googleSignUp, googleSignUpCallback, setUserData } = require('../controllers/authController');
const { jwtAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/google/signup', googleSignUp)
router.get('/google/signup/callback', googleSignUpCallback)

router.post('/signup/form',jwtAuth, setUserData)

module.exports = router