const axios = require('axios')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/db')

const getNow = async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT NOW() AS current');
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}

const getUser = async (req, res) => {
    const {userId, email, role} = req.user 

    res.status(201).json({userId, email, role})
}

module.exports = {
    getNow,
    getUser,
}