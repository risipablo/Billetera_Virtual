// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User')

exports.protect = (req, res, next) => {
    const token = req.cookies.token || '';
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token no válido' });
        }
        req.user = decoded;
        next();
    });
};


exports.isAdmin = (req, res, next) => {
    const { role, id } = req.user || {};

    // Asumimos que tienes acceso al modelo de usuario para validar el email
    UserModel.findById(id).then((user) => {
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificamos el email del usuario con el de ADMIN en el archivo de configuración
        if (user.email === process.env.USER_ADMIN) {
            return next(); // Si el email coincide, pasamos directamente como admin
        }

        // Si el email no coincide, revisamos el rol almacenado en la base de datos
        if (role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador.' });
        }

        next();
    }).catch((err) => {
        res.status(500).json({ error: 'Error al verificar el usuario.' });
    });
};
