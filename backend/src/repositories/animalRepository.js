const { pool } = require('../config/db')


const getAllAnimals = async (email) => {
    const query = `SELECT * FROM animals`;
    try {
        const [rows] = await pool.query(query);
        return rows.length > 0 ? rows : null;
    } catch (err) {
        console.error('Error selecting animals:', err);
        throw err;
    }
};

const getAnimalById = async (id) => {
    const query = `SELECT * FROM animals WHERE id = ?`
    try {
        const [rows] = await pool.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error selecting animal:', err)
        throw err;
    }
}


module.exports = {
    getAllAnimals,
    getAnimalById
}