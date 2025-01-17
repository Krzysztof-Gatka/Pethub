const jwt = require('jsonwebtoken')
const { selectUserWalks, deleteWalk } = require('../repositories/walkRepository')
const { addNotification } = require('./notificationController');
const { pool } = require('../config/db');
const { get } = require('../routes/walkRoutes');

const getWalks = async (req, res) => {
    console.log('Fetching walks for user');
    try {
      const token = req.cookies['jwt'];
      const user = jwt.decode(token);
      const user_id = user.userId;
  
      const walks = await selectUserWalks(user_id);
  
      // Powiadomienia o spacerach na dziś/jutro
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split('T')[0];
  
      for (const walk of walks) {
        if ([today, tomorrow].includes(walk.date)) {
          await addNotification(
            user_id,
            'walk_reminder',
            `Przypomnienie: Spacer z ${walk.animal_name} zaplanowany na ${walk.date} o godzinie ${walk.time_slot}.`
          );
        }
      }
  
      console.log('Fetched walks:', walks);
      res.status(201).json({ walks });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  const removeWalk = async (req, res) => {
    const walkId = req.params.id;
    console.log(`Attempting to delete walk with ID: ${walkId}`);
    try {
        const [walkDetails] = await pool.query('SELECT user_id, animal_id FROM walks WHERE id = ?', [walkId]); // Nie potrzeba .promise()

        if (walkDetails.length === 0) {
            return res.status(404).json({ error: 'Walk not found' });
        }

        const { user_id, animal_id } = walkDetails[0];
        console.log('Attempting to delete walk with ID:', walkId);
        await deleteWalk(walkId);
        console.log('Walk deleted successfully');

        await addNotification(
            user_id,
            'walk_cancelled',
            `Spacer z zwierzęciem ID: ${animal_id} został anulowany.`
        );

        res.status(201).json({ msg: 'Successfully canceled walk' });
    } catch (err) {
        console.error('Error removing walk:', err.message);
        res.status(500).json({ error: err.message });
    }
};


const getShelterWalks = async (req, res) => {
  const { shelterId } = req.params; // Odczytujemy ID schroniska z URL

  if (!shelterId || isNaN(shelterId)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Valid shelter ID is required' 
    });
  }

  try {
    const query = `
        SELECT 
          w.id, 
          w.date, 
          w.time_slot, 
          a.name AS animal_name, 
          i.img_url, 
          s.name AS shelter_name, 
          s.city AS shelter_city 
        FROM walks w
        JOIN animals a ON w.animal_id = a.id
        LEFT JOIN images i ON a.id = i.owner_id
        JOIN shelter_profiles s ON a.shelter_id = s.id
        WHERE a.shelter_id = ?;

    `;

    const [rows] = await pool.query(query, [shelterId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No walks found for the given shelter'
      });
    }

    res.status(200).json({ 
      success: true, 
      data: rows, 
      error: null 
    });
  } catch (error) {
    console.error('Error fetching walks for shelter:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
};


const getWalksForAnimal = async (req, res) => {
  const { animalId } = req.params;

  try {
    const query = `
      SELECT id, date, time_slot
      FROM walks
      WHERE animal_id = ?;
    `;
    const [rows] = await pool.query(query, [animalId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No walks found for this animal.' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching walks:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};




module.exports = {
    getWalks,
    removeWalk,
    getShelterWalks,
    getWalksForAnimal
    
}