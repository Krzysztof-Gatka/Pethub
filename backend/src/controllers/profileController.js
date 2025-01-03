const cloudinary = require('cloudinary').v2
const axios = require('axios')
const jwt = require('jsonwebtoken');
const { insertUserProfile, selectUserProfileById, insertShelterProfile, insertShelterImg, selectShelterProfileById } = require('../repositories/profileRepository');
const { insertImg } = require('../repositories/animalRepository');



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const createUserProfile = async (req, res) => {
    try {
        const {userId, age, firstName, gender, lastName, phone} = req.body;
        const profileExists = await selectUserProfileById(userId);
        if(profileExists.length != 0) {
            console.log('profile already exists')
            return res.status(201).json({message: 'Profile already exists'})
        } 

        console.log('creating user profile...');
        const [result] = await insertUserProfile(userId, firstName, lastName, age, gender, phone)

        res.status(201).json({message: 'Sucessfully created profile'})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const createShelterProfile = async (req, res) => {
    console.log('creating shelter profile...');
    console.log(req.body)
    try {
        const {userId, name, address, description, phone} = req.body;
        console.log(userId)
        const profileExists = await selectShelterProfileById(userId);
        if(profileExists.length != 0) {
            console.log('profile already exists')
            return res.status(201).json({message: 'Profile already exists'})
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        const insertedId = await insertShelterProfile(userId, name, address, description, phone)
        const insertedImg = await insertShelterImg(insertedId, result.secure_url)
        console.log(req.body)
        res.status(201).json({message: 'Shelter profile created successfully'})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}


module.exports = {
    createUserProfile,
    createShelterProfile
}