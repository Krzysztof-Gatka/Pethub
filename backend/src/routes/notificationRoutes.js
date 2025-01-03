const express = require('express');
const { pool } = require('../config/db'); 
const {
  getUserNotifications,
  checkWalksForNotifications,
  markNotificationAsRead,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/', getUserNotifications);

router.get('/test-notifications', checkWalksForNotifications);

router.post('/read', markNotificationAsRead);

router.delete('/', async (req, res) => {
    const { notificationId } = req.body;
  
    try {
      const query = `DELETE FROM notifications WHERE id = ?`;
      const [result] = await pool.query(query, [notificationId]);
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Notification deleted successfully' });
      } else {
        res.status(404).json({ message: 'Notification not found' });
      }
    } catch (err) {
      console.error('Error deleting notification:', err.message);
      res.status(500).json({ error: 'Error deleting notification' });
    }
  });
  

module.exports = router;
