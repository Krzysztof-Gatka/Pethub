const jwt = require('jsonwebtoken')

const verifyGoogleToken = (idToken) => {
    const decoded = jwt.decode(idToken);
    return {
        googleId: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        photo: decoded.picture,
    };
};

const generateToken = (user) => {
    return jwt.sign(
        { ...user }, // Payload
        process.env.JWT_SECRET,            // Secret key
        { expiresIn: '1h' }                // Token expiration
    );
};

module.exports = {
    verifyGoogleToken,
    generateToken
}