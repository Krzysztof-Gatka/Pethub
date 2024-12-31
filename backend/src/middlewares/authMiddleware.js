const jwt = require('jsonwebtoken')

const jwtAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  
    if(!token) {
      return res.status(401).json({message: 'Unauthorized: No token provided!'});
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({message: 'Forbidden: Invalid or expired token'});
    }
  }

  module.exports = { jwtAuth };