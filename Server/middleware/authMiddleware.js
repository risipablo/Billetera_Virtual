
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); 

exports.protect = async (req, res, next) => {
    let token;

    if (req.cookies?.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
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

        
        if (decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({ error: 'Sesión cerrada. Volvé a iniciar sesión.' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
    }
};