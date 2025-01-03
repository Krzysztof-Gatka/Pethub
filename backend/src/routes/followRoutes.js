const express = require('express');
const {
  getShelterFollows,
  getAnimalFollows,
  addFollow,
  deleteFollow,
} = require('../controllers/followController');
const { pool } = require('../config/db');

const router = express.Router();

router.get('/shelters', getShelterFollows);

router.get('/animals', getAnimalFollows);

router.post('/follow/add', addFollow);

router.delete('/follow/delete', deleteFollow);

router.get('/animal/:animalId', async (req, res) => {
  const { userId } = req.query;
  const { animalId } = req.params;

  try {
    const query = `SELECT * FROM follows_animals WHERE follower_id = ? AND animal_id = ?`;
    const [rows] = await pool.query(query, [userId, animalId]);

    if (rows.length > 0) {
      res.json({ followed: true });
    } else {
      res.json({ followed: false });
    }
  } catch (err) {
    console.error('Error checking follow status:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Pobieranie wszystkich zaobserwowanych zwierząt dla użytkownika
router.get('/animals', async (req, res) => {
  const { userId } = req.query;

  try {
    const query = `
      SELECT a.id, a.name, a.age, a.description, i.img_url
      FROM follows_animals fa
      JOIN animals a ON fa.animal_id = a.id
      LEFT JOIN images i ON a.id = i.owner_id
      WHERE fa.follower_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching followed animals:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Pobieranie wszystkich zaobserwowanych schronisk dla użytkownika
router.get('/shelters', async (req, res) => {
  const { userId } = req.query;

  try {
    const query = `
      SELECT s.id, s.organization_name, s.address
      FROM follows_shelters fs
      JOIN shelter_profiles s ON fs.shelter_id = s.id
      WHERE fs.follower_id = ?
    `;
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching followed shelters:', err.message);
    res.status(500).json({ error: err.message });
  }
});


router.post('/animal/add', async (req, res) => {
  const { userId, targetId } = req.body;

  try {
    const query = `INSERT INTO follows_animals (follower_id, animal_id) VALUES (?, ?)`;
    await pool.query(query, [userId, targetId]);
    res.status(201).json({ message: 'Animal followed successfully' });
  } catch (err) {
    console.error('Error adding animal follow:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/animal/delete', async (req, res) => {
  const { userId, targetId } = req.body;

  try {
    const query = `DELETE FROM follows_animals WHERE follower_id = ? AND animal_id = ?`;
    const [result] = await pool.query(query, [userId, targetId]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Animal unfollowed successfully' });
    } else {
      res.status(404).json({ message: 'Follow not found' });
    }
  } catch (err) {
    console.error('Error removing animal follow:', err.message);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
