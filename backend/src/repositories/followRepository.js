const { pool } = require('../config/db');

const getUserShelterFollows = async (userId) => {
  const query = `SELECT s.id, s.organization_name, s.address
                 FROM follows_shelters fs
                 JOIN shelter_profiles s ON fs.shelter_id = s.id
                 WHERE fs.follower_id = ?`;

  try {
    const [rows] = await pool.query(query, [userId]);
    return rows;
  } catch (err) {
    console.error('Error fetching shelter follows:', err.message);
    throw err;
  }
};

const getUserAnimalFollows = async (userId) => {
  const query = `SELECT a.id, a.name, a.description, i.img_url
                 FROM follows_animals fa
                 JOIN animals a ON fa.animal_id = a.id
                 LEFT JOIN images i ON a.id = i.owner_id
                 WHERE fa.follower_id = ?`;

  try {
    const [rows] = await pool.query(query, [userId]);
    return rows;
  } catch (err) {
    console.error('Error fetching animal follows:', err.message);
    throw err;
  }
};

const addFollowToDb = async (userId, targetId, type) => {
  let query;

  if (type === 'animal') {
    query = `INSERT INTO follows_animals (follower_id, animal_id) VALUES (?, ?)`;
  } else if (type === 'shelter') {
    query = `INSERT INTO follows_shelters (follower_id, shelter_id) VALUES (?, ?)`;
  } else {
    throw new Error('Invalid follow type');
  }

  try {
    await pool.query(query, [userId, targetId]);
  } catch (err) {
    console.error('Error adding follow:', err.message);
    throw err;
  }
};

const deleteFollowFromDb = async (userId, targetId, type) => {
  let query;

  if (type === 'animal') {
    query = `DELETE FROM follows_animals WHERE follower_id = ? AND animal_id = ?`;
  } else if (type === 'shelter') {
    query = `DELETE FROM follows_shelters WHERE follower_id = ? AND shelter_id = ?`;
  } else {
    throw new Error('Invalid follow type');
  }

  try {
    await pool.query(query, [userId, targetId]);
  } catch (err) {
    console.error('Error removing follow:', err.message);
    throw err;
  }
};

module.exports = {
  getUserShelterFollows,
  getUserAnimalFollows,
  addFollowToDb,
  deleteFollowFromDb,
};
