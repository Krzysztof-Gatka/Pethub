const express = require('express');
const { googleSignUp, googleSignUpCallback, setUserData, getUserSession, logout, googleSignIn, googleSignInCallback } = require('../controllers/authController');
const { jwtAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/google/signup', googleSignUp)
router.get('/google/signup/callback', googleSignUpCallback)

router.get('/google/signin', googleSignIn)
router.get('/google/signin/callback', googleSignInCallback)

router.get('/session', getUserSession)

router.post('/logout', logout)

router.post('/signup/form',jwtAuth, setUserData)

module.exports = router