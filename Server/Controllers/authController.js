
const UserModel = require('../Models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    // Validar los campos requeridos
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar si el usuario ya existe
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        const newUser = new UserModel({ email, password, name });
        
        // Asignar rol de administrador si el correo coincide
        newUser.role = email === process.env.USER_ADMIN ? 'admin' : 'user';

        await newUser.save(); // Guardar el nuevo usuario
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor: ' + err.message });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password, name } = req.body;

    // Validar los campos requeridos
    if (!email || !password || !name) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar las credenciales del usuario
        const user = await UserModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Crear un token de acceso
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Establecer la cookie con el token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Solo en producción
            sameSite: 'none',   // Previene ataques CSRF
        });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        res.status(500).json({ error: 'Error en el servidor: ' + err.message });
    }
};

exports.logoutUser = (req, res) => {
    // Eliminar la cookie de sesión
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
    });
    res.json({ message: 'Cierre de sesión exitoso' });
};


// Logica de cambio de contraseña
const User = require('../Models/User')
const bcrypt = require('bcrypt')

exports.verifyEmail = async (req, res) => {
    const {email} = req.body

    try{
         // Verificar que el correo coincida con el del usuario logueado

        const user = await User.findOne({email, _id: req.user.id})
        if (!user){
            return res.status(404).json({message: 'Correo Incorrecto'})
        }
        res.status(200).json({message: 'Correo verificado', userId: user._id})
    } catch (error) {
        res.status(500).json({message: 'Error del servidor'})
    }
}

exports.changePassword = async (req,res) => {
    const { newPassword} = req.body

    try{
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'Correo Incorrecto'})
        }

        // Verificar que la contraseña nueva no sea igual a la actual
        const samePassword = await user.comparePassword(newPassword)
        if (samePassword) {
            return res.status(404).json({message: 'La nueva contraseña no puede ser igual a la contraseña actual'})
        }

        const salt = await bcrypt.genSalt(12)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()

        res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
}

