const axios = require('axios')
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise');
const {pool} = require('../config/db')
const {verifyGoogleToken, generateToken} = require('../utils/jwtUtils');
const { insertUser, getUserIdByEmail, getUserRoleByEmail } = require('../repositories/userRepository');




const googleSignIn = (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.O_AUTH_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_SIGNIN_CALLBACK}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&prompt=consent`;
  res.redirect(authUrl);
}

const googleSignInCallback = async (req, res) => {
  const {code} = req.query;
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
      return res.redirect('http://localhost:5173/')
    }

    const userRole = await getUserRoleByEmail(user.email);

    user.userId = existingUserId
    user.role = userRole
    const jwt_token = generateToken(user)

    res.cookie('jwt', jwt_token, {
      httpOnly: true,       // Prevents client-side JavaScript access
      sameSite: 'Strict',   // CSRF protection
      maxAge: 3600000,      // 1 hour
    });

    res.redirect(`http://localhost:5173`);

    } catch (error) {
      res.status(500).send('Error exchanging code for token');
      console.log(error)
    }
}


const googleSignUp = (req, res) => {
    const { role } = req.query
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.O_AUTH_CLIENT_ID}` +
      `&redirect_uri=${process.env.GOOGLE_SIGNUP_CALLBACK}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&prompt=consent` + 
      `&state=${encodeURIComponent(role)}`; 
    res.redirect(authUrl);
  }

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
      await insertUser(user.email, user.role)
    }

    const user_id = await getUserIdByEmail(user.email)
    user.userId = user_id
    const jwt_token = generateToken(user)

    res.cookie('jwt', jwt_token, {
      httpOnly: true,       // Prevents client-side JavaScript access
      sameSite: 'Strict',   // CSRF protection
      maxAge: 3600000,      // 1 hour
    });

    if(!existingUserId) {
      if(user.role == 'user') {
        res.redirect(`http://localhost:5173/userProfileForm?userId=${user_id}`);
      } else {
        res.redirect(`http://localhost:5173/shelterProfileForm?userId=${user_id}`);
      }
    } else {
      res.redirect(`http://localhost:5173`);

    }
    } catch (error) {
      res.status(500).send('Error exchanging code for token');
      console.log(error)
    }
}


const setUserData = (req, res) => {

    const { name, phone, secondName, userId } = req.body;
    console.log(name)
    console.log(phone)
    console.log(secondName)
    console.log(userId)

    if (!userId || !name || !secondName || !phone) {
      return res.status(400).json({ message: "All fields (id, name, secondName, phone) are required." });
    }
  
    // SQL query to update the user
    const sql = `
      UPDATE users
      SET first_name = ?, second_name = ?, phone = ?
      WHERE user_id = ?;
    `;
  
    // Execute the query with placeholders
    pool.query(sql, [name, secondName, phone, userId], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ message: "An error occurred while updating the user." });
      }
  
      // Check if any rows were updated
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found with the provided ID." });
      }
  
    });

    return res.status(200).json({ message: "User updated successfully!" });
  
  }

  const getUserSession = (req, res) => {
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(401).json({ loggedIn: false });
    }

    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ loggedIn: true, user });
    } catch (err) {
      return res.status(401).json({ loggedIn: false });
    }
  } 

  const logout = (req, res) => {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });

  }


  module.exports = {
    googleSignUp,
    googleSignUpCallback,
    googleSignIn,
    googleSignInCallback,
    setUserData,
    getUserSession,
    logout,
  }