// profileController.js
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');

const {
  insertUserProfile,
  selectUserProfileById,
  insertShelterProfile,
  selectShelterProfileById
} = require('../repositories/profileRepository');

const createUserProfile = async (req, res) => {
  try {
    const { userId, age, firstName, gender, lastName, phone } = req.body;
    // 1. sprawdź, czy taki profil nie istnieje
    const profileExists = await selectUserProfileById(userId);
    if (profileExists.length > 0) {
      return res.status(409).json({ message: 'Profile already exists' });
    }
    // 2. wstaw do bazy
    await insertUserProfile(
      Number(userId),
      firstName,
      lastName,
      Number(age),
      gender,
      phone
    );
    res.status(201).json({ message: 'Profile created successfully' });
  } catch (err) {
    console.error('createUserProfile error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createShelterProfile = async (req, res) => {
  try {
    const {
      userId,
      name,
      city,
      street,
      building,
      postal_code,
      description,
      phone
    } = req.body;
    console.log(req.body)
    if (!userId) {
      return res.status(400).json({ error: 'No userId provided' });
    }

    // Sprawdź, czy user istnieje
    const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(400).json({ error: 'Taki użytkownik nie istnieje' });
    }

    // Opcjonalnie sprawdź rolę
    if (userRows[0].role !== 'shelter') {
      return res.status(403).json({ error: 'Użytkownik nie jest schroniskiem (rola != shelter)' });
    }

    // Sprawdź, czy nie istnieje już shelter_profiles z tym userId
    const existingProfile = await selectShelterProfileById(userId);
    if (existingProfile.length > 0) {
      return res.status(409).json({ error: 'Profil schroniska już istnieje' });
    }

    // Dodaj nowy profil
    await insertShelterProfile(
      userId,
      name,
      city,
      street,
      building,
      postal_code,
      description,
      phone // phone_number
    );

    return res.status(201).json({ message: 'Schronisko zostało utworzone poprawnie' });
  } catch (err) {
    console.error('createShelterProfile error', err);
    return res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia schroniska' });
  }
};


const getShelterSession = async (req, res) => {
  const token = req.cookies['jwt'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Jeśli użytkownik jest schroniskiem, pobierz jego `shelterId`
    let shelterId = null;
    if (user.role === 'shelter') {
      const [shelter] = await pool.query(
        'SELECT id FROM shelter_profiles WHERE shelter_id = ?',
        [user.userId]
      );
      shelterId = shelter.length > 0 ? shelter[0].id : null;
    }

    res.status(200).json({
      user: {
        email: user.email,
        userId: user.userId,
        role: user.role,
        shelterId,
      },
    });
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  createUserProfile,
  createShelterProfile,
  getShelterSession

};
