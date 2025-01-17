const { pool } = require('../config/db');

const insertAdoption = async (user_id, animal_id, shelter_id) => {
  try {
    console.log('Inserting adoption:', { user_id, animal_id, shelter_id });
    const query = `
      INSERT INTO adoptions (user_id, animal_id, shelter_id, status)
      VALUES (?, ?, ?, 'pending')
    `;
    const [result] = await pool.query(query, [user_id, animal_id, shelter_id]);
    console.log('Adoption inserted:', result);
    return { id: result.insertId, user_id, animal_id, shelter_id, status: 'pending' };
  } catch (error) {
    console.error('Error inserting adoption:', error);
    throw error;
  }
};


// Pobieranie adopcji użytkownika
const selectAdoptionsByUser = async (user_id) => {
  const query = `
    SELECT 
      a.id AS adoption_id,
      an.name AS animal_name,
      s.name AS shelter_name,
      a.status,
      DATE_FORMAT(a.created_at, '%Y-%m-%d') AS date,
      i.img_url
    FROM adoptions a
    JOIN animals an ON a.animal_id = an.id
    JOIN shelter_profiles s ON a.shelter_id = s.id
    LEFT JOIN images i ON an.id = i.owner_id
    WHERE a.user_id = ?
  `;
  const [rows] = await pool.query(query, [user_id]);
  return rows;
};


// Pobieranie adopcji dla schroniska
const selectAdoptionsByShelter = async (shelter_id) => {
  const query = `
    SELECT 
      a.id AS id, -- Alias zmieniony na "id"
      an.name AS animal_name,
      u.email AS user_email,
      a.status,
      DATE_FORMAT(a.created_at, '%Y-%m-%d') AS date,
      i.img_url
    FROM adoptions a
    JOIN animals an ON a.animal_id = an.id
    JOIN users u ON a.user_id = u.id
    LEFT JOIN images i ON an.id = i.owner_id
    WHERE a.shelter_id = ?
  `;
  const [rows] = await pool.query(query, [shelter_id]);
  return rows;
};


// Aktualizowanie statusu adopcji
const updateAdoptionStatus = async (adoption_id, status) => {
  try {
    const query = `
      UPDATE adoptions
      SET status = ?
      WHERE id = ?
    `;

    const [result] = await pool.query(query, [status, adoption_id]);

    if (result.affectedRows === 0) {
      return null; // Zwróć null, jeśli nie znaleziono adopcji do aktualizacji
    }

    return { id: adoption_id, status };
  } catch (error) {
    console.error('Error updating adoption status:', error);
    throw error;
  }
};

const deleteAdoptionById = async (adoption_id) => {
  try {
    const query = `
      DELETE FROM adoptions
      WHERE id = ?
    `;
    await pool.query(query, [adoption_id]);
  } catch (error) {
    console.error('Error deleting adoption:', error);
    throw error;
  }
};

const getShelterAdoptions = async (shelterId) => {
  const query = `
      SELECT ad.id, ad.date, ad.status, a.name AS animal_name
      FROM adoptions ad
      JOIN animals a ON ad.animal_id = a.id
      WHERE a.shelter_id = ?;
  `;
  try {
      const [rows] = await pool.query(query, [shelterId]);
      return rows;
  } catch (error) {
      console.error('Error fetching adoptions:', error);
      throw error;
  }
};


module.exports = {
  insertAdoption,
  selectAdoptionsByUser,
  selectAdoptionsByShelter,
  updateAdoptionStatus,
  deleteAdoptionById,
  getShelterAdoptions
};
