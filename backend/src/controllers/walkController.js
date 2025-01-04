const jwt = require('jsonwebtoken')
const { selectUserWalks, deleteWalk } = require('../repositories/walkRepository')



const getWalks = async (req, res) => {
    console.log('getwalks')
    try {
        const token = req.cookies['jwt']
        const user = jwt.decode(token)
        const user_id = user.userId
        const walks = await selectUserWalks(user_id)
        console.log(walks)
        res.status(201).json({walks})
    } catch (err) {
        res.status(500).json({error:err.message})
    }
}

const removeWalk = async (req, res) => {
    const walkId = req.params.id;
    console.log(walkId)
    try {
        await deleteWalk(walkId)
        res.status(201).json({msg: 'sucessfully canceled walk'})
    } catch(err) {
        res.status(500).json({error:err.message})

    }
}


module.exports = {
    getWalks,
    removeWalk
}