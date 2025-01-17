const axios = require('axios');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { verifyGoogleToken, generateToken } = require('../utils/jwtUtils');
const { insertUser, getUserIdByEmail, getUserRoleByEmail } = require('../repositories/userRepository');
const { insertEmailUser, selectUserPassword } = require('../repositories/authRepository');

// Google Sign-In
const googleSignIn = (req, res) => {
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.O_AUTH_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_SIGNIN_CALLBACK}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&prompt=consent`;
  res.redirect(authUrl);
};

const googleSignInCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.O_AUTH_CLIENT_ID,
      client_secret: process.env.O_AUTH_SECRET_KEY,
      redirect_uri: process.env.GOOGLE_SIGNIN_CALLBACK,
      grant_type: 'authorization_code',
    });

    const { id_token } = tokenResponse.data;
    const user = verifyGoogleToken(id_token);

    const existingUserId = await getUserIdByEmail(user.email);
    if (!existingUserId) {
      return res.redirect('http://localhost:5173/');
    }

    const userRole = await getUserRoleByEmail(user.email);

    // Fetch shelterId if the user is a shelter
    let shelterId = null;
    if (userRole === 'shelter') {
      const [shelter] = await pool.query('SELECT id FROM shelter_profiles WHERE shelter_id = ?', [existingUserId]);
      shelterId = shelter.length > 0 ? shelter[0].id : null;
    }

    // Generate JWT
    user.userId = existingUserId;
    user.role = userRole;
    user.shelterId = shelterId;

    const jwt_token = generateToken(user);

    res.cookie('jwt', jwt_token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    res.redirect('http://localhost:5173/');
  } catch (error) {
    res.status(500).send('Error exchanging code for token');
    console.log(error);
  }
};

// Google Sign-Up
const googleSignUp = (req, res) => {
  const { role } = req.query;
  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.O_AUTH_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_SIGNUP_CALLBACK}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&prompt=consent` +
    `&state=${encodeURIComponent(role)}`;
  res.redirect(authUrl);
};

const googleSignUpCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.O_AUTH_CLIENT_ID,
      client_secret: process.env.O_AUTH_SECRET_KEY,
      redirect_uri: process.env.GOOGLE_SIGNUP_CALLBACK,
      grant_type: 'authorization_code',
    });

    const { id_token } = tokenResponse.data;
    const user = verifyGoogleToken(id_token);
    user.role = decodeURIComponent(state);

    const existingUserId = await getUserIdByEmail(user.email);
    if (!existingUserId) {
      await insertUser(user.email, user.role);

      // Create a shelter profile if the role is 'shelter'
      if (user.role === 'shelter') {
        const newUserId = await getUserIdByEmail(user.email);
        await pool.query('INSERT INTO shelter_profiles (shelter_id) VALUES (?)', [newUserId]);
      }
    }

    const userId = await getUserIdByEmail(user.email);
    user.userId = userId;

    // Fetch shelterId if the user is a shelter
    let shelterId = null;
    if (user.role === 'shelter') {
      const [shelter] = await pool.query('SELECT id FROM shelter_profiles WHERE shelter_id = ?', [userId]);
      shelterId = shelter.length > 0 ? shelter[0].id : null;
    }

    user.shelterId = shelterId;

    const jwt_token = generateToken(user);

    res.cookie('jwt', jwt_token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    if (!existingUserId) {
      if (user.role === 'user') {
        res.redirect(`http://localhost:5173/userProfileForm?userId=${userId}`);
      } else {
        res.redirect(`http://localhost:5173/shelterProfileForm?userId=${userId}`);
      }
    } else {
      res.redirect(`http://localhost:5173/`);
    }
  } catch (error) {
    res.status(500).send('Error exchanging code for token');
    console.log(error);
  }
};

// Set User Data
const setUserData = (req, res) => {
  const { name, phone, secondName, userId } = req.body;

  if (!userId || !name || !secondName || !phone) {
    return res.status(400).json({ message: 'All fields (id, name, secondName, phone) are required.' });
  }

  const sql = `
    UPDATE user_profiles
    SET first_name = ?, second_name = ?, phone_number = ?
    WHERE user_id = ?;
  `;

  pool.query(sql, [name, secondName, phone, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'An error occurred while updating the user.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found with the provided ID.' });
    }

    return res.status(200).json({ message: 'User updated successfully!' });
  });
};

// Get User Session
const getUserSession = async (req, res) => {
  const token = req.cookies['jwt'];
  if (!token) {
    return res.status(401).json({ loggedIn: false });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    if (user.role === 'shelter') {
      const [shelter] = await pool.query('SELECT id FROM shelter_profiles WHERE shelter_id = ?', [user.userId]);
      user.shelterId = shelter.length > 0 ? shelter[0].id : null;
    }

    return res.status(200).json({ loggedIn: true, user });
  } catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

const emailSignUp = async (req, res) => {
  const { role } = req.query;
  const { email, password } = req.body;

  try {
    const userId = await insertEmailUser(email, password, role);

    if (role === 'shelter') {
      await pool.query('INSERT INTO shelter_profiles (shelter_id) VALUES (?)', [userId]);
    }

    const user = {
      userId,
      role,
      email,
    };

    const jwt_token = generateToken(user);

    res.cookie('jwt', jwt_token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    res.status(201).json({ userId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error signing up user.' });
  }
};

const emailSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id, password_hash, role } = await selectUserPassword(email);

    if (!id || password !== password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    let shelterId = null;
    if (role === 'shelter') {
      const [shelter] = await pool.query('SELECT id FROM shelter_profiles WHERE shelter_id = ?', [id]);
      shelterId = shelter.length > 0 ? shelter[0].id : null;
    }

    const user = {
      email,
      userId: id,
      role,
      shelterId,
    };

    const jwt_token = generateToken(user);

    res.cookie('jwt', jwt_token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    res.status(201).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error signing in user.' });
  }
};

module.exports = {
  googleSignUp,
  googleSignUpCallback,
  googleSignIn,
  googleSignInCallback,
  setUserData,
  getUserSession,
  logout,
  emailSignUp,
  emailSignIn,
};
