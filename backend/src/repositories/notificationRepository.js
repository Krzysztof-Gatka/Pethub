const { pool } = require('../config/db');

// Dodawanie powiadomienia do bazy danych
const addNotificationToDb = async (ownerId, type, description) => {
  const query = `
    INSERT INTO notifications (owner_id, date, type, description)
    VALUES (?, NOW(), ?, ?)
  `;
  await pool.query(query, [ownerId, type, description]);
};

// Pobieranie nieprzeczytanych powiadomień użytkownika
const getUnreadNotifications = async (userId) => {
  const query = `
    SELECT * FROM notifications
    WHERE owner_id = ? AND status = 0
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows;
};

module.exports = {
  addNotificationToDb,
  getUnreadNotifications,
};
