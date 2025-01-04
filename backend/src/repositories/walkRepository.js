const { pool } = require('../config/db')



const selectUserWalks = async (id) => {
    // const query = `SELECT * FROM walks WHERE user_id = ?`
    const query = `
        SELECT 
    walks.id AS walk_id,
    walks.animal_id, 
    walks.date, 
    walks.time_slot, 
    animals.id AS animal_id, 
    animals.name, 
    animals.shelter_id, 
    images.img_url
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
WHERE 
    walks.user_id = ?;
    `
    try {
        const [walks] = await pool.query(query, [id])
        return walks
    } catch(err) {
        console.error('error selecting user walks', err)
    }

}

const deleteWalk = async (walk_id) => {
    const query = 'DELETE FROM walks WHERE id = ?'
    try {
        await pool.query(query, [walk_id])
    }  catch(err) {
        console.error('error selecting user walks', err)
    }
}



module.exports = {
    selectUserWalks,
    deleteWalk
}