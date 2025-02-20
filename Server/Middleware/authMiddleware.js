


const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User'); 

exports.protect = async (req, res, next) => {
    let token;

    // 1. Leer el token del encabezado "Authorization" (no de las cookies)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Formato: "Bearer <token>"
    }

    if (!token) {
        return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    }

    try {
        // 2. Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Verificar si el usuario existe en la base de datos
        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado.' });
        }

        // 4. Adjuntar el usuario a la solicitud (req.user)
        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
    }
};


// // middleware/authMiddleware.js
// const jwt = require('jsonwebtoken');

// exports.protect = async (req, res, next) => {
//     const token = req.cookies.token || '';

//     if (!token) {
//         return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
//     }

//     try {
//         // Verificar el token y obtener la información del usuario
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // Almacenar la información del usuario en la solicitud
//         next(); // Continuar con la siguiente función de middleware
//     } catch (err) {
//         // Manejar errores de verificación del token
//         return res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
//     }
// };











// exports.isAdmin = async (req, res, next) => {
//     try {
//         const { role, id } = req.user;

//         // Busca el usuario en la base de datos
//         const user = await UserModel.findById(id);

//         if (!user) {
//             return res.status(403).json({ error: 'Acceso denegado: usuario no encontrado' });
//         }

//         // Verifica si el usuario es el admin configurado o tiene el rol de admin
//         if (user.email === process.env.USER_ADMIN || role === 'admin') {
//             return next(); // El usuario es admin, continuar
//         }

//         return res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador' });
//     } catch (error) {
//         res.status(500).json({ error: 'Error al verificar los permisos de administrador' });
//     }
