const { pool } = require('../config/db');

// Funkcje do obsługi dat w SQL
const getCurrentSqlDate = () => {
  const date = new Date();
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

const getTomorrowSqlDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

const getUserNotifications = async (req, res) => {
  const { userId } = req.query;

  try {
    const query = `SELECT * FROM notifications WHERE owner_id = ? AND status = 0`;
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ error: 'Error fetching notifications' });
  }
};

const addNotification = async (ownerId, type, description) => {
  try {
    const query = `
      INSERT INTO notifications (owner_id, date, type, description)
      SELECT ?, ?, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM notifications 
        WHERE owner_id = ? AND type = ? AND description = ? AND status = 0
      )
    `;
    const date = getCurrentSqlDate();
    await pool.query(query, [ownerId, date, type, description, ownerId, type, description]);
  } catch (err) {
    console.error('Error adding notification:', err.message);
    throw new Error('Error adding notification');
  }
};

const checkWalksForNotifications = async (req, res) => {
  const { userId } = req.query;

  try {
    const today = getCurrentSqlDate();
    const tomorrow = getTomorrowSqlDate();

    const query = `
      SELECT w.id, w.date, w.time_slot, a.name AS animal_name
      FROM walks w
      JOIN animals a ON w.animal_id = a.id
      WHERE w.user_id = ? AND (w.date = ? OR w.date = ?)
    `;
    const [rows] = await pool.query(query, [userId, today, tomorrow]);

    if (rows.length > 0) {
      for (const walk of rows) {
        await addNotification(
          userId,
          'Przypomnienie',
          `Masz zaplanowany spacer z ${walk.animal_name} dnia ${walk.date} o ${walk.time_slot}.`
        );
      }
    }

    res.status(200).json({ message: 'Notifications checked and updated.' });
  } catch (err) {
    console.error('Error checking walks for notifications:', err.message);
    res.status(500).json({ error: 'Error checking walks for notifications' });
  }
};

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

module.exports = {
  getUserNotifications,
  checkWalksForNotifications,
  addNotification,
  markNotificationAsRead,
};
