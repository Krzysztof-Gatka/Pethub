const { pool } = require('../config/db'); // Import konfiguracji bazy danych
const { deleteAdoptionById } = require('../repositories/adoptionRepository');
const { addNotification } = require('./notificationController');

const {
  insertAdoption,
  selectAdoptionsByUser,
  selectAdoptionsByShelter,
  updateAdoptionStatus,
} = require('../repositories/adoptionRepository');

const createNewAdoption = async (req, res) => {
  try {
    const { user_id, animal_id, adoptionData } = req.body;

    console.log('Received data for adoption:', req.body);

    if (!user_id || !animal_id) {
      return res.status(400).json({ error: 'User ID and Animal ID are required' });
    }

    const [shelterResult] = await pool.query('SELECT shelter_id FROM animals WHERE id = ?', [animal_id]);
    if (shelterResult.length === 0) {
      return res.status(404).json({ error: 'Shelter not found for the specified animal' });
    }

    const shelter_id = shelterResult[0].shelter_id;
    const adoption = await insertAdoption(user_id, animal_id, shelter_id);

    console.log('Adoption created, adding notifications');

    // Powiadomienia
    await addNotification(
      user_id,
      'adoption_request',
      `Wniosek o adopcję zwierzęcia ID: ${animal_id} został złożony.`
    );
    await addNotification(
      shelter_id,
      'adoption_request',
      `Otrzymano nowy wniosek adopcyjny dla zwierzęcia ID: ${animal_id}.`
    );

    console.log('Notifications added successfully');
    return res.status(201).json({ message: 'Adoption request created', adoption });
  } catch (error) {
    console.error('Error creating adoption:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const getAdoptionsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adoptions = await selectAdoptionsByUser(userId);
    res.status(200).json({ adoptions });
  } catch (error) {
    console.error('Error fetching user adoptions:', error.message);
    res.status(500).json({ error: 'Failed to fetch user adoptions' });
  }
};

const getAdoptionsForShelter = async (req, res) => {
  const { shelterId } = req.params; // zamiast req.query
  const adoptions = await selectAdoptionsByShelter(shelterId);
  res.status(200).json({ adoptions });
};


const updateAdoption = async (req, res) => {
  try {
    const { adoptionId } = req.params;
    const { status } = req.body;

    if (!adoptionId || !status) {
      return res.status(400).json({ error: 'Adoption ID and status are required' });
    }

    const updatedAdoption = await updateAdoptionStatus(adoptionId, status);
    if (!updatedAdoption) {
      return res.status(404).json({ error: 'Adoption not found' });
    }

    // Pobierz dane adopcji dla powiadomienia
    const [adoptionDetails] = await pool.query('SELECT user_id, animal_id FROM adoptions WHERE id = ?', [adoptionId]);
    if (adoptionDetails.length === 0) {
      return res.status(404).json({ error: 'Adoption details not found' });
    }

    const { user_id, animal_id } = adoptionDetails[0];

    if (status === 'approved') {
      await addNotification(
        user_id,
        'adoption_approved',
        `Twój wniosek o adopcję zwierzęcia o ID ${animal_id} został zaakceptowany.`
      );
    } else if (status === 'rejected') {
      await addNotification(
        user_id,
        'adoption_rejected',
        `Twój wniosek o adopcję zwierzęcia o ID ${animal_id} został odrzucony.`
      );
    }

    return res.status(200).json({
      message: 'Adoption status updated successfully',
      updatedAdoption,
    });
  } catch (error) {
    console.error('Error updating adoption:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAdoption = async (req, res) => {
  try {
    const { adoptionId } = req.params;

    if (!adoptionId) {
      return res.status(400).json({ error: 'Adoption ID is required' });
    }

    const [adoptionDetails] = await pool.query('SELECT user_id, animal_id FROM adoptions WHERE id = ?', [adoptionId]);

    if (adoptionDetails.length === 0) {
      return res.status(404).json({ error: 'Adoption not found' });
    }

    const { user_id, animal_id } = adoptionDetails[0];
    console.log('Deleting adoption:', { adoptionId, user_id, animal_id });

    await deleteAdoptionById(adoptionId);

    console.log('Adoption deleted, adding cancellation notification');

    await addNotification(
      user_id,
      'adoption_cancelled',
      `Wniosek o adopcję zwierzęcia ID: ${animal_id} został anulowany.`
    );

    console.log('Notification for cancelled adoption added successfully');
    return res.status(200).json({ message: 'Adoption deleted successfully' });
  } catch (error) {
    console.error('Error deleting adoption:', error);
    return res.status(500).json({ error: 'Failed to delete adoption' });
  }
};


const getAdoptionsByShelter = async (req, res) => {
    const { shelterId } = req.query;
    try {
        const adoptions = await getShelterAdoptions(shelterId);
        res.json(adoptions);
    } catch (error) {
        console.error('Error fetching adoptions by shelter:', error);
        res.status(500).json({ error: 'Error fetching adoptions.' });
    }
};


const getAdoptionFormDetails = async (req, res) => {
  const { adoptionId } = req.params;

  try {
    const query = `
      SELECT 
        a.id AS adoption_id,
        an.name AS animal_name,
        a.adoptionData AS answers,
        u.email AS user_email,
        CONCAT(up.first_name, ' ', up.second_name) AS user_name,
        a.status,
        DATE_FORMAT(a.created_at, '%Y-%m-%d') AS date
      FROM adoptions a
      JOIN animals an ON a.animal_id = an.id
      JOIN users u ON a.user_id = u.id
      JOIN user_profiles up ON u.id = up.user_id
      WHERE a.id = ?;
    `;

    const [rows] = await pool.query(query, [adoptionId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Adoption not found' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching adoption form details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAdoptionsForAnimal = async (req, res) => {
  const { id } = req.params; // Odczytujemy `id` zwierzęcia z parametrów trasy

  try {
    const query = `
      SELECT 
        a.id AS adoption_id,
        u.email AS user_email,
        a.created_at AS date, 
        a.status,
        an.name AS animal_name
      FROM adoptions a
      JOIN animals an ON a.animal_id = an.id
      JOIN users u ON a.user_id = u.id
      WHERE a.animal_id = ?;
    `;

    const [rows] = await pool.query(query, [id]); // Użycie `pool.query` do wykonania zapytania
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No adoptions found for this animal.' });
    }

    res.status(200).json(rows); // Zwracamy wyniki zapytania
  } catch (error) {
    console.error('Error fetching adoptions for animal:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}



module.exports = {
  createNewAdoption,
  getAdoptionsForUser,
  getAdoptionsForShelter,
  updateAdoption,
  deleteAdoption,
  getAdoptionsByShelter,
  getAdoptionFormDetails,
  getAdoptionsForAnimal,
};
