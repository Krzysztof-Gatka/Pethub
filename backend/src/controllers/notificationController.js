const { pool } = require('../config/db');

// Funkcja do uzyskania daty w formacie SQL
const getCurrentSqlDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// Pobieranie powiadomień użytkownika
const getUserNotifications = async (req, res) => {
  const { userId } = req.query;

  try {
    console.log(`Fetching notifications for user ID: ${userId}`);
    const query = `SELECT * FROM notifications WHERE owner_id = ? AND status = 0`;
    const [rows] = await pool.query(query, [userId]);
    console.log('Fetched notifications:', rows);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

const addNotification = async (ownerId, type, description, targetId = null, ownerType = null) => {
  try {
    // Logowanie wartości wstawianych do bazy
    console.log('Adding notification:', { ownerId, type, description, targetId, ownerType });

    const query = `
      INSERT INTO notifications (owner_id, date, type, description, target_id, owner_type)
      VALUES (?, NOW(), ?, ?, ?, ?)
    `;
    
    console.log('Executing query:', query, [ownerId, type, description, targetId, ownerType]);

    // Wstawianie powiadomienia
    const [result] = await pool.query(query, [ownerId, type, description, targetId, ownerType]);
    console.log('Notification added successfully:', result);

    // Sprawdzanie, czy coś zostało wstawione
    if (result.affectedRows === 0) {
      throw new Error('No rows were inserted');
    }
  } catch (err) {
    console.error('Error adding notification:', err.message);
    throw new Error('Error adding notification');
  }
};




// Sprawdzanie spacerów użytkownika dla przypomnień
const checkWalksForNotifications = async (req, res) => {
  const { userId } = req.query;

  try {
    const today = getCurrentSqlDate();
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split('T')[0];

    const query = `
      SELECT w.id, w.date, w.time_slot, a.name AS animal_name
      FROM walks w
      JOIN animals a ON w.animal_id = a.id
      WHERE w.user_id = ? AND (w.date = ? OR w.date = ?)
    `;
    const [rows] = await pool.query(query, [userId, today, tomorrow]);

    for (const walk of rows) {
      await addNotification(
        userId,
        'walk_reminder',
        `Przypomnienie: Spacer z ${walk.animal_name} zaplanowany na ${walk.date} o godzinie ${walk.time_slot}.`
      );
    }

    res.status(200).json({ message: 'Notifications checked and updated.' });
  } catch (err) {
    console.error('Error checking walks for notifications:', err.message);
    res.status(500).json({ error: 'Error checking walks for notifications' });
  }
};

// Oznaczanie powiadomienia jako przeczytanego
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.body;

  try {
    const query = `UPDATE notifications SET status = 1 WHERE id = ?`;
    const [result] = await pool.query(query, [notificationId]);
    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Notification marked as read' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (err) {
    console.error('Error marking notification as read:', err.message);
    res.status(500).json({ error: 'Error marking notification as read' });
  }
};

// Usuwanie powiadomienia
const deleteNotification = async (req, res) => {
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
};

module.exports = {
  getUserNotifications,
  addNotification,
  checkWalksForNotifications,
  markNotificationAsRead,
  deleteNotification,
};
