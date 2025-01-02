const { pool } = require('../config/db')


const getAllAnimals = async (email) => {
    const query = `SELECT a.id, a.name, a.age, a.description, a.shelter_id, i.img_url
            FROM animals a
            LEFT JOIN images i ON a.id = i.owner_id`;
    try {
        const [rows] = await pool.query(query);
        return rows.length > 0 ? rows : null;
    } catch (err) {
        console.error('Error selecting animals:', err);
        throw err;
    }
};

const getAnimalById = async (id) => {
    const query = `SELECT a.id, a.name, a.age, a.description, a.shelter_id, i.img_url
            FROM animals a
            LEFT JOIN images i ON a.id = i.owner_id
            WHERE a.id = ?`
    try {
        const [rows] = await pool.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error selecting animal:', err)
        throw err;
    }
}

const insertAnimalData = async (name, age, description, shelter_id) => {
    const query = `INSERT INTO animals (name, age, description, shelter_id) VALUES (?, ?, ?, ?)`
    try {
        const [animalResult] = await pool.query(query, [name, age, description, shelter_id])
        return animalResult.insertId
    } catch(err) {
        console.error('Error inserting animal', err)
    }
}

const insertImg = async (animalId, url) => {
    const query = `INSERT INTO images (owner_id, img_url) VALUES (?, ?)`
    try {
        const [imageResult] = await pool.query(query, [animalId, url])
        return imageResult
    } catch(err) {
        console.error("error inserting image", err)
    }
}


module.exports = {
    getAllAnimals,
    getAnimalById,
    insertAnimalData,
    insertImg,
}