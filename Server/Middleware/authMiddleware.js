
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User'); 

exports.protect = async (req, res, next) => {
    let token;

    // Leer el token del encabezado "Authorization"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    }

    try {
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario en la base de datos
        const user = await UserModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado.' });
        }

        // Adjuntar el usuario a la solicitud
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
    }
};

