const express = require('express');
const {
  getUserNotifications,
  checkWalksForNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const router = express.Router();

// Pobieranie powiadomień użytkownika
router.get('/', getUserNotifications);

// Sprawdzanie spacerów na dziś i jutro
router.get('/check-walks', async (req, res) => {
  try {
    await checkWalksForNotifications();
    res.status(200).json({ message: 'Walk notifications checked' });
  } catch (err) {
    res.status(500).json({ error: 'Error checking walks for notifications' });
  }
});

// Oznaczanie powiadomienia jako przeczytane
router.post('/read', markNotificationAsRead);
router.get('/check-walks', checkWalksForNotifications);


router.delete('/', deleteNotification);


module.exports = router;
