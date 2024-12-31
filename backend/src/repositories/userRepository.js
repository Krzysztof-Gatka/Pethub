const { pool } = require('../config/db')

const insertUser = async (googleId, email) => {
    const query = `INSERT INTO users (google_id, email) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [googleId, email]);
        return result;
    } catch (err) {
        console.error('Error inserting user:', err);
        throw err;
    }
};

const getUserIdByGoogleId = async (googleId) => {
    const query = `SELECT user_id FROM users WHERE google_id = ?`;
    try {
        const [rows] = await pool.query(query, [googleId]);
        return rows.length > 0 ? rows[0].user_id : null;
    } catch (err) {
        console.error('Error selecting user:', err);
        throw err;
    }
};

module.exports = {
    insertUser,
    getUserIdByGoogleId,
};