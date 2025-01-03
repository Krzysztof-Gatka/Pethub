const { pool } = require('../config/db');



const insertShelterProfile = async (user_id, name, adress, description, phone_number) => {
    console.log('insertShelterProfile')
    console.log('address:', adress)
    console.log('phone_number:', phone_number)
    const query = `INSERT INTO shelter_profiles (shelter_id, name, address, description, phone_number) VALUES (?, ?, ?, ?, ?)`
    try {
        const [result] = await pool.query(query, [Number(user_id), name, adress, description, phone_number])
        return result.insertId
    } catch(err) {
        console.error('error',err)
    }
}

const insertUserProfile = async (user_id, first_name, second_name, age, sex, phone_number) => {
    const query = `INSERT INTO user_profiles (user_id, first_name, second_name, age, sex, phone_number) VALUES (?, ?, ?, ?, ?, ?)`
    try {
        const [result] = await pool.query(query, [Number(user_id), first_name, second_name, Number(age), sex, phone_number])
        return result.insertId;
    } catch (err) {
        console.error('Error',err)
    }
}

const selectUserProfileById = async(user_id) => {
    const query = `SELECT user_id FROM user_profiles WHERE user_id = ?`
    try {
        const [result] = await pool.query(query, [user_id])
        return result
    } catch (err) {
        console.error('error', err)
    }
}

const insertShelterImg = async (shelter_profile_id, url) => {
    console.log('inserting shelter img')
    const query = `INSERT INTO shelter_images (owner_id, img_url) VALUES (?, ?)`
    try {
        const [imageResult] = await pool.query(query, [shelter_profile_id, url])
        return imageResult
    } catch (err) {
        console.error('error inserting shelter image', err)
    }
}



module.exports = {
    insertUserProfile,
    selectUserProfileById,
    insertShelterProfile,
    insertShelterImg
}