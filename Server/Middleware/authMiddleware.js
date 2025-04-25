
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User'); 

exports.protect = async (req, res, next) => {
    let token;
  
    // 1. Buscar token en headers (Bearer)
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Buscar token en cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }
  
    if (!token) {
      return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado.' });
      }
  
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
    }
  };
