const express = require('express');
const { getWalks, removeWalk } = require('../controllers/walkController');
const router = express.Router();


router.get('/', getWalks)

router.delete('/:id', removeWalk)



module.exports = router