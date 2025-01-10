const jwt = require('jsonwebtoken')
const { selectUserWalks, deleteWalk } = require('../repositories/walkRepository')
const { addNotification } = require('./notificationController');

const { pool } = require('../config/db');




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


module.exports = {
    getWalks,
    removeWalk
}