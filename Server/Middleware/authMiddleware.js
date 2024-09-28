// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

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
    const { role } = req.user || {};

    if (role !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador.' });
    }

    next();
};
