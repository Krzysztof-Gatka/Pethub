const jwt = require('jsonwebtoken');
const {pool} = require('../config/db');


const createShelterProfile = async (req, res) => {
    try {
        const token = req.cookies['jwt'];
        const user = jwt.decode(token);
        const shelter_id = user.userId;
        
        const { name, address, city, street, postal_code, building, description, phone_number } = req.body;
        
        const [result] = await pool.execute(
            'INSERT INTO shelter_profiles (shelter_id, name, address, city, street, postal_code, building, description, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [shelter_id, name, address, city, street, postal_code, building, description, phone_number]
        );
        
        res.status(201).json({ 
            message: 'Shelter profile created successfully',
            profileId: result.insertId 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateShelterProfile = async (req, res) => {
    try {
        const token = req.cookies['jwt'];
        const user = jwt.decode(token);
        const shelter_id = user.userId;
        
        const { name, address, city, street, postal_code, building, description, phone_number } = req.body;
        
        const [result] = await pool.execute(
            `UPDATE shelter_profiles 
             SET name = ?, address = ?, city = ?, street = ?, postal_code = ?, 
                 building = ?, description = ?, phone_number = ?
             WHERE shelter_id = ?`,
            [name, address, city, street, postal_code, building, description, phone_number, shelter_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Shelter profile not found' });
        }
        
        res.status(200).json({ message: 'Shelter profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteShelterProfile = async (req, res) => {
    try {
        const token = req.cookies['jwt'];
        const user = jwt.decode(token);
        const shelter_id = user.userId;
        
        const [result] = await pool.execute(
            'DELETE FROM shelter_profiles WHERE shelter_id = ?',
            [shelter_id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Shelter profile not found' });
        }
        
        res.status(200).json({ message: 'Shelter profile deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getShelterProfile = async (req, res) => {
    const {id} = req.query

    try {
        
        const [rows] = await pool.execute(
            `SELECT u.email, s.name, s.city, s.street, s.postal_code, s.building, s.description, s.phone_number FROM shelter_profiles s 
LEFT JOIN users u
ON s.shelter_id = u.id
WHERE shelter_id = ?;`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Shelter profile not found' });
        }
        
        res.status(200).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getShelterProfiles = async (req, res) => {
    try {
        const [rows] = await pool.execute(
            `SELECT s.shelter_id, u.email, s.name, s.city, s.street, s.postal_code, s.building, s.description, s.phone_number FROM shelter_profiles s
            LEFT JOIN users u
            ON s.shelter_id = u.id;`,
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Shelter profile not found' });
        }
        
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createShelterProfile,
    updateShelterProfile,
    deleteShelterProfile,
    getShelterProfile,
    getShelterProfiles
};