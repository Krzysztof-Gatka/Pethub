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

const selectAnimalsByShelterId = async (shelter_id) => {
    const query = `SELECT * FROM animals WHERE shelter_id = ?`
    try {
        const [rows] = await pool.query(query, [shelter_id])
        return rows.length > 0 ? rows : [];
    } catch (err) {
        console.error('Error selecting animals by given shelter id')
    }
}

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

const getBookedSlots = async(animalId, date) => {
    const query = `SELECT time_slot FROM walks WHERE animal_id = ? AND date = ?`
    try {
        const [bookedSlots] = await pool.query(query, [animalId, date])
        return bookedSlots
    } catch(err) {
        console.error("error selecting slots", err)
    }
}

const selectAnimalBookedWalks = async(animalId, date) => {
    const query = `SELECT * FROM walks WHERE animal_id = ? AND date = ?`
    try {
        const [bookedWalks] = await pool.query(query, [animalId, date])
        return bookedWalks
    } catch(err) {
        console.error("error selecting wallks", err)
    }

}


const insertBookedSlot = async(animalId, userId, date, timeSlot) => {
    const query = `INSERT INTO walks (animal_id, user_id, date, time_slot) VALUES (?, ?, ?, ?)`
    try {
        const inserted = await pool.query(query, [animalId, userId, date, timeSlot])
        return inserted
    } catch(err) {
        console.error("error booking walk", err)
    }
}

const selectUserWalks = async(userId) => {
    const query = `SELECT * FROM walks WHERE user_id = ?`
    try {
        const [walks] = await pool.query(query, [userId])
        return walks
    } catch(err) {
        console.error("error selecting user slots", err)
    }
}

const selectAnimalWalks = async(animalId) => {
    const query = `SELECT * FROM walks WHERE animal_id = ?`
    try {
        const [walks] = await pool.query(query, [animalId])
        return walks
    } catch(err) {
        console.error("error selecting user slots", err)
    }

}


module.exports = {
    getAllAnimals,
    getAnimalById,
    insertAnimalData,
    insertImg,
    getBookedSlots,
    insertBookedSlot,
    selectUserWalks,
    selectAnimalWalks,
    selectAnimalBookedWalks,
    selectAnimalsByShelterId,
}