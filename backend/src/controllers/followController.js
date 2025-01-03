const {
    getUserShelterFollows,
    getUserAnimalFollows,
    addFollowToDb,
    deleteFollowFromDb,
  } = require('../repositories/followRepository');
  
  const getShelterFollows = async (req, res) => {
    try {
      const { userId } = req.query;
      const follows = await getUserShelterFollows(userId);
      res.json(follows);
    } catch (err) {
      console.error('Error fetching shelter follows:', err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
  const getAnimalFollows = async (req, res) => {
    try {
      const { userId } = req.query;
      const follows = await getUserAnimalFollows(userId);
      res.json(follows);
    } catch (err) {
      console.error('Error fetching animal follows:', err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
  const addFollow = async (req, res) => {
    try {
      const { userId, targetId, type } = req.body;
      await addFollowToDb(userId, targetId, type);
      res.status(201).json({ message: 'Follow added successfully' });
    } catch (err) {
      console.error('Error adding follow:', err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
  const deleteFollow = async (req, res) => {
    try {
      const { userId, targetId, type } = req.body;
      await deleteFollowFromDb(userId, targetId, type);
      res.status(200).json({ message: 'Follow removed successfully' });
    } catch (err) {
      console.error('Error removing follow:', err.message);
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = {
    getShelterFollows,
    getAnimalFollows,
    addFollow,
    deleteFollow,
  };
  