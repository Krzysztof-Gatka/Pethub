const { pool } = require('../config/db')

const insertUser = async (email, role) => {
    const query = `INSERT INTO users (email, role) VALUES (?, ?)`;
    try {
        const [result] = await pool.query(query, [email, role]);
        return result;
    } catch (err) {
        console.error('Error inserting user:', err);
        throw err;
    }
};

const getUserIdByEmail = async (email) => {
    const query = `SELECT id FROM users WHERE email = ?`;
    try {
        const [rows] = await pool.query(query, [email]);
        return rows.length > 0 ? rows[0].id : null;
    } catch (err) {
        console.error('Error selecting user:', err);
        throw err;
    }
};

const getUserRoleByEmail = async (email) => {
    const query = `SELECT role FROM users WHERE email = ?`;
    try {
        const [rows] = await pool.query(query, [email]);
        return rows.length > 0 ? rows[0].role : null;
    } catch (err) {
        console.error('Error selecting user:', err);
        throw err;
    }
};

module.exports = {
    insertUser,
    getUserIdByEmail,
    getUserRoleByEmail,
};