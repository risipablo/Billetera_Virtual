// controllers/authController.js
const UserModel = require('../Models/User')
const jwt = require('jsonwebtoken')
require('dotenv').config();


exports.registerUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const newUser = new UserModel({ email, password });

        // Condicional para asignar rol de admin o usuario
        if (email === process.env.USER_ADMIN) {
            newUser.role = 'admin';  // Asignar rol de admin a un email específico
        } else {
            newUser.role = 'user';  // Otros usuarios serán 'user'
        }

        const result = await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.json({ message: 'Inicio de sesión exitoso', token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};