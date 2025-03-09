


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



// exports.verifyToken = (req,res,next) => {
//     const token = req.headers['authorization']

//     if(!token){
//         return res.status(403).json({message: 'Sin acceso al token'})
//     }

//     jwt.verify(token.split('')[1], process.env.JWT_SECRET, (err,decoded) => {
//         if (err) {
//             return res.status(500).json({message: 'Acceso denagado de token'})
//         }

//         req.userId = decoded.id
//         next();
//     })
// }