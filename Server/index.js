const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GastosModel = require('./Models/Gastos');
require('dotenv').config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:5173', 'https://billetera-virtual-original.vercel.app'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Conexiones a la base de datos
const crudConnection = process.env.MONGODB_CRUD;  // Usuario con permisos CRUD
const readConnection = process.env.MONGODB_READ;  // Usuario con permisos de lectura

// Helper function para conectar a la base de datos con permisos de lectura
async function connectToReadDb() {
    try {
        await mongoose.connect(readConnection);
        console.log("Conectado con permisos de solo lectura");
    } catch (err) {
        console.log("Error de conexión: " + err);
    }
}

// Helper function para conectar a la base de datos con permisos CRUD
async function connectToCrudDb() {
    try {
        await mongoose.connect(crudConnection);
        console.log("Conectado con permisos CRUD");
    } catch (err) {
        console.log("Error de conexión: " + err);
    }
}

// Obtener gastos (solo lectura)
app.get('/gasto', async (req, res) => {
    try {
        await connectToReadDb();  // Conectar con permisos de solo lectura
        const gastos = await GastosModel.find();
        res.json(gastos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar gastos (requiere permisos CRUD)
app.post('/add-gasto', async (req, res) => {
    const { dia, mes, producto, metodo, condicion, monto } = req.body;
    if (!dia || !mes || !producto || !metodo || !condicion || !monto) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        await connectToCrudDb();  // Conectar con permisos CRUD
        const newGasto = new GastosModel({ dia, mes, producto, metodo, condicion, monto });
        const result = await newGasto.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar gastos (requiere permisos CRUD)
app.delete('/delete-gasto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await connectToCrudDb();  // Conectar con permisos CRUD
        const result = await GastosModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Editar gastos (requiere permisos CRUD)
app.patch('/edit-gasto/:id', async (req, res) => {
    const { id } = req.params;
    const { dia, mes, producto, metodo, condicion, monto } = req.body;
    
    try {
        await connectToCrudDb();  // Conectar con permisos CRUD
        const result = await GastosModel.findByIdAndUpdate(id, {
            dia, mes, producto, metodo, condicion, monto
        }, { new: true });
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
