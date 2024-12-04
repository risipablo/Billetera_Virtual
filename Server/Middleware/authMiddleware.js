
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
    const token = req.cookies.token || '';

    if (!token) {
        return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    }

    try {
        // Verificar el token y obtener la información del usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Almacenar la información del usuario en la solicitud
        next(); // Continuar con la siguiente función de middleware
    } catch (err) {
        // Manejar errores de verificación del token
        return res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
    }
};











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
