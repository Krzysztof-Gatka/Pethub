const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql2/promise');
const app = express()
const port = 3000
const cors = require('cors');
const dotenv = require('dotenv').config()

const host = dotenv.parsed.DB_HOST
const mysqlUser = dotenv.parsed.MYSQL_USER
const mysqlPassword = dotenv.parsed.MYSQL_PASSWORD
const mysqlDatabase = dotenv.parsed.MYSQL_DATABASE

app.use(morgan('combined'))
app.use(cors())

const pool = mysql.createPool({
  host: host,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase,
});

app.get('/now', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS current');
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows)
  } catch (err) {
    res.status(500).json({error: err.message});
  }
})

app.get('/reloa', async (req, res) => {
  res.json({data: "backend reload działa poprawnie"})
})

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});