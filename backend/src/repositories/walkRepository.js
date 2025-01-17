const { pool } = require('../config/db');




const selectUserWalks = async (id) => {
    const query = `
        SELECT 
            walks.id AS walk_id,
            walks.animal_id, 
            walks.date, 
            walks.time_slot, 
            animals.id AS animal_id, 
            animals.name AS animal_name, 
            animals.shelter_id, 
            images.img_url,
            shelters.name AS shelter_name, 
            shelters.city AS shelter_city, 
            shelters.phone_number AS shelter_phone
        FROM 
            walks
        INNER JOIN 
            animals 
        ON 
            animals.id = walks.animal_id
        LEFT JOIN 
            images 
        ON 
            animals.id = images.owner_id
        LEFT JOIN 
            shelter_profiles AS shelters
        ON 
            animals.shelter_id = shelters.id
        WHERE 
            walks.user_id = ?;
    `;

    try {
        const [walks] = await pool.query(query, [id]);
        return walks;
    } catch (err) {
        console.error('Error selecting user walks:', err.message);
        throw err;
    }
};



const deleteWalk = async (walk_id) => {
    const query = 'DELETE FROM walks WHERE id = ?';
    try {
        console.log('Attempting to delete walk with ID:', walk_id); // Debugowanie
        const [result] = await pool.query(query, [walk_id]);
        console.log('Walk deleted successfully.');
    } catch (err) {
        console.error('Error removing walk:', err.message);
        throw err;
    }
};




module.exports = {
    selectUserWalks,
    deleteWalk,
    
}