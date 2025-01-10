// profileRepository.js
const { pool } = require('../config/db');

/**
 * Wstawia nowy rekord do user_profiles
 */
const insertUserProfile = async (user_id, first_name, second_name, age, sex, phone_number) => {
  const query = `
    INSERT INTO user_profiles (user_id, first_name, second_name, age, sex, phone_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.query(query, [
      Number(user_id),
      first_name,
      second_name,
      Number(age),
      sex,
      phone_number
    ]);
    return result.insertId;
  } catch (err) {
    console.error('Error in insertUserProfile', err);
    throw err;
  }
};

/**
 * Wstawia nowy rekord do shelter_profiles
 */
const insertShelterProfile = async (
  userId,         // docelowo to "shelter_id"
  name,
  city,
  street,
  building,
  postal_code,
  description,
  phone_number
) => {
  // Upewniamy się, że kolejność kolumn i wartości pasuje do definicji w DB
  const query = `
    INSERT INTO shelter_profiles
      (shelter_id, name, city, street, building, postal_code, description, phone_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.query(query, [
      Number(userId),
      name,
      city,
      street,
      building,
      postal_code,
      description,
      phone_number
    ]);
    return result.insertId;
  } catch (err) {
    console.error('Błąd w insertShelterProfile:', err);
    throw err;
  }
};

/**
 * Sprawdza, czy dany user_id ma już przypisany profil schroniska
 */
const selectShelterProfileById = async (shelter_id) => {
  const query = `SELECT * FROM shelter_profiles WHERE shelter_id = ?`;
  try {
    const [rows] = await pool.query(query, [shelter_id]);
    return rows;
  } catch (err) {
    console.error('Błąd w selectShelterProfileById:', err);
    throw err;
  }
};

/**
 * Sprawdza, czy dany user_id ma już przypisany profil usera
 */
const selectUserProfileById = async (user_id) => {
  const query = `SELECT user_id FROM user_profiles WHERE user_id = ?`;
  try {
    const [result] = await pool.query(query, [user_id]);
    return result;
  } catch (err) {
    console.error('error', err);
    throw err;
  }
};

/**
 * Wstawia obrazek do schroniska (jeśli masz taką tabelę)
 */
const insertShelterImg = async (shelter_profile_id, url) => {
  console.log('inserting shelter img')
  const query = `INSERT INTO shelter_images (owner_id, img_url) VALUES (?, ?)`;
  try {
    const [imageResult] = await pool.query(query, [shelter_profile_id, url]);
    return imageResult;
  } catch (err) {
    console.error('error inserting shelter image', err);
    throw err;
  }
};

module.exports = {
  insertUserProfile,
  selectUserProfileById,
  insertShelterProfile,
  insertShelterImg,
  selectShelterProfileById
};
