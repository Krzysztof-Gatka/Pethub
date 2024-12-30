const express = require('express')
const morgan = require('morgan')
const axios = require('axios')
const jwt = require('jsonwebtoken')
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

const verifyGoogleToken = (idToken) => {
  const decoded = jwt.decode(idToken);
  return {
    googleId: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    photo: decoded.picture,
  };
};
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email }, // Payload
    process.env.JWT_SECRET,            // Secret key
    { expiresIn: '1h' }                // Token expiration
  );
};


app.get('/auth/google/signup', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.O_AUTH_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&prompt=consent`; 
  res.redirect(authUrl);
});

app.get('/auth/google/signup/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.O_AUTH_CLIENT_ID,
      client_secret: process.env.O_AUTH_SECRET_KEY,
      redirect_uri: process.env.GOOGLE_SIGNUP_CALLBACK,
      grant_type: 'authorization_code',
    });

    const { id_token } = tokenResponse.data; // Contains the user's profile info
    // Now use the id_token to authenticate the user in your app
    const user = verifyGoogleToken(id_token);
    const jwt_token = generateToken(user)

    // Set the JWT as an HTTP-only cookie
    res.cookie('jwt', jwt_token, {
      httpOnly: true,       // Prevents client-side JavaScript access
      sameSite: 'Strict',   // CSRF protection
      maxAge: 3600000,      // 1 hour
    });

    res.redirect(`http://localhost:5173/auth/google/signup`);
    } catch (error) {
      res.status(500).send('Error exchanging code for token');
      console.log(error)
    }
});



app.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.O_AUTH_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&prompt=consent`; 
  res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.O_AUTH_CLIENT_ID,
      client_secret: process.env.O_AUTH_SECRET_KEY,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    });

    const { id_token } = tokenResponse.data; // Contains the user's profile info
    // Now use the id_token to authenticate the user in your app
    const user = verifyGoogleToken(id_token);
    const jwt_token = generateToken(user)

    // Set the JWT as an HTTP-only cookie
    res.cookie('jwt', jwt_token, {
      httpOnly: true,       // Prevents client-side JavaScript access
      sameSite: 'Strict',   // CSRF protection
      maxAge: 3600000,      // 1 hour
    });

    res.redirect(`http://localhost:5173?userId=${user.googleId}`);
    } catch (error) {
      res.status(500).send('Error exchanging code for token');
      console.log(error)
    }
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


app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});