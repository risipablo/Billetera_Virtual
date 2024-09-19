const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GastosModel = require('./Models/Gastos');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config();

const app = express();
app.use(express.json());


const JWT_SECRET = process.env.JWT_SECRET 

// Configuración de CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'https://billetera-virtual-lilac.vercel.app', 'https://billetera-virtual.onrender.com'],
    optionsSuccessStatus: 200,
    methods: ['GET'],  // Métodos permitidos
};

app.use(cors(corsOptions));

// Conexión para CRUD completo 
const dbCreatorConnection = mongoose.createConnection(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Conexión solo para lectura (usuarios externos)
const dbVisitorConnection = mongoose.createConnection(process.env.MONGODB_READ, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const GastosCRUD = dbCreatorConnection.model('Gastos', GastosModel.schema);
const GastosVisitor = dbVisitorConnection.model('Gastos', GastosModel.schema);

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
};

// Ruta de login (solo tú como creador)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Autenticación básica (esto debería ser más robusto en producción)
    if (username === process.env.APP_OWNER_USERNAME && password === process.env.APP_OWNER_PASSWORD) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

// Obtener gastos (accesible para visitantes, usando conexión de solo lectura)
app.get('/gasto', async (req, res) => {
    try {
        const gastos = await GastosVisitor.find(); 
        res.json(gastos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar gastos (solo tú como creador, usando conexión CRUD)
app.post('/add-gasto', verifyToken , async (req, res) => {
    const { dia, mes, producto, metodo, condicion, monto } = req.body;
    if (!dia || !mes || !producto || !metodo || !condicion || !monto) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newGasto = new GastosCRUD({ dia, mes, producto, metodo, condicion, monto });
        const result = await newGasto.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar gastos (solo tú como creador, usando conexión CRUD)
app.delete('/delete-gasto/:id', verifyToken , async (req, res) => {
    const { id } = req.params;
    try {
        const result = await GastosCRUD.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Editar gastos (solo tú como creador, usando conexión CRUD)
app.patch('/edit-gasto/:id', verifyToken , async (req, res) => {
    const { id } = req.params;
    const { dia, mes, producto, metodo, condicion, monto } = req.body;
    try {
        const result = await GastosCRUD.findByIdAndUpdate(id, { dia, mes, producto, metodo, condicion, monto }, { new: true });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
});

// Iniciar el servidor
app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});
