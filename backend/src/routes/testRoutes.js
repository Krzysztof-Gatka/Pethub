const express = require('express');
const { getNow, getUser } = require('../controllers/testController');
const { jwtAuth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/now', getNow)
router.get('/private/now', jwtAuth, getNow)
router.get('/user', jwtAuth, getUser)

module.exports = router