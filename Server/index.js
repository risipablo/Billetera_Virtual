const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GastosModel = require('./Models/Gastos');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuración de CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'https://billetera-virtual-lilac.vercel.app', 'https://billetera-virtual.onrender.com'],
    optionsSuccessStatus: 200,
    methods: ['GET'],  // Métodos permitidos
};

app.use(cors(corsOptions));

// Conexión para CRUD completo (tú como creador)
const dbCreatorConnection = mongoose.createConnection(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Conexión solo para lectura (visitantes)
const dbVisitorConnection = mongoose.createConnection(process.env.MONGODB_READ, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const GastosCRUD = dbCreatorConnection.model('Gastos', GastosModel.schema);
const GastosVisitor = dbVisitorConnection.model('Gastos', GastosModel.schema);

// Obtener gastos (accesible para visitantes, usando conexión de solo lectura)
app.get('/gasto', async (req, res) => {
    try {
        const gastos = await GastosVisitor.find(); // Uso correcto del modelo para lectura
        res.json(gastos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar gastos (solo tú como creador, usando conexión CRUD)
app.post('/add-gasto', async (req, res) => {
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
app.delete('/delete-gasto/:id', async (req, res) => {
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
app.patch('/edit-gasto/:id', async (req, res) => {
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
