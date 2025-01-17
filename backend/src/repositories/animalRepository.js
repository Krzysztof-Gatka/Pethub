const { pool } = require('../config/db');
const { getRawAnimal } = require('../controllers/animalController');


const getAllAnimals = async (email) => {
    const query = `SELECT a.id, a.name, TIMESTAMPDIFF(YEAR, a.birth_date, CURDATE()) AS age, a.description,a.type, a.shelter_id, i.img_url
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
    const query = `
        SELECT 
            a.id AS animal_id, 
            a.name, 
            TIMESTAMPDIFF(YEAR, a.birth_date, CURDATE()) AS age, 
            a.description, 
            a.type, 
            a.breed, 
            a.shelter_id, 
            i.img_url 
        FROM animals a
        LEFT JOIN images i ON a.id = i.owner_id
        WHERE a.shelter_id = ?
    `;
    try {
        const [rows] = await pool.query(query, [shelter_id]);
        return rows.length > 0 ? rows : [];
    } catch (err) {
        console.error('Error selecting animals by given shelter id:', err);
        throw err;
    }
};

const selectRawAnimal = async (id) => {
    const query = `SELECT * FROM animals WHERE id = ?`
    try {
        const [rows] = await pool.query(query, [id])
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error selecting animal:', err);
        throw err;
    }
}


const getAnimalById = async (id) => {
    const query = `
        SELECT 
            a.id, 
            a.name, 
            TIMESTAMPDIFF(YEAR, a.birth_date, CURDATE()) AS age, 
            a.description,  
            a.breed, 
            DATE_FORMAT(a.date_joined, '%d-%m-%Y') AS date_joined, -- Formatowanie daty
            a.shelter_id, 
            s.name AS shelter_name, -- Dołączenie nazwy schroniska
            i.img_url
        FROM animals a
        LEFT JOIN images i ON a.id = i.owner_id
        LEFT JOIN shelter_profiles s ON a.shelter_id = s.id -- Dołączenie tabeli shelter_profiles
        WHERE a.id = ?;
    `;
    try {
        const [rows] = await pool.query(query, [id]);
        return rows.length > 0 ? rows[0] : null;
    } catch (err) {
        console.error('Error selecting animal:', err);
        throw err;
    }
};


const updateAnimal = async (animalId, name, birth_date, description, type, breed, date_joined, imageUrl) => {
    console.log('updateAnimal:', animalId, name, birth_date, description, type, breed, date_joined, imageUrl)
    const query = `
        UPDATE animals SET name = ?, birth_date = ?, description = ?, type = ?, breed = ?, date_joined = ?
        WHERE id = ?;
    `
    const [result] = await pool.query(query, [name, birth_date, description, type, breed, date_joined, animalId])
    if(imageUrl) await insertImg(animalId, imageUrl)
}

const insertAnimalData = async (name, birth_date, description, type, breed, shelter_id, date_joined, imageUrl) => {
    const query = `
        INSERT INTO animals (name, birth_date, description, type, breed, shelter_id, date_joined)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, birth_date, description, type, breed, shelter_id, date_joined];
    const [result] = await pool.query(query, values);
    const animal_id = result.insertId
    await insertImg(animal_id, imageUrl)
};



const insertImg = async (animalId, url) => {
    const query = `INSERT INTO images (owner_id, owner_type, img_url) VALUES (?, 'animal', ?)`
    try {
        const [imageResult] = await pool.query(query, [animalId, url])
        return imageResult
    } catch(err) {
        console.error("error inserting image", err)
    }
}

const updateImg = async (animalId, url) => {
    const query = `UPDATE images SET img_url = ? WHERE owner_id = ?`
    try {
        const [imageResult] = await pool.query(query, [url, Number(animalId)])
        return imageResult
    } catch(err) {
        console.error("error updating image", err)
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
    selectRawAnimal,
    updateAnimal,
    updateImg
}