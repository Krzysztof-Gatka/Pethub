const { pool } = require('../config/db')

const insertEmailUser = async (email, password, role) => {
    const query = `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`;
    try {
        const [result] = await pool.query(query, [email, password, role]);
        return result.insertId;
    } catch (err) {
        console.error('Error inserting user:', err);
    }
}   

const selectUserPassword = async (email) => {
    const query = `SELECT id, role, password_hash FROM users WHERE email = ?`;
    try {
        const [result] = await pool.query(query, [email])
        return (result.length > 0) ? result[0] : {id: -1, role:'', password_hash:''}
    } catch (err) {
        console.error('error signin', err)
    }
}


module.exports = {
    insertEmailUser,
    selectUserPassword
}