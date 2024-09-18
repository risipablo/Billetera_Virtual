const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const GastosModel = require('./Models/Gastos');
require('dotenv').config();

const app = express();
app.use(express.json());

const corsOptions = {
    origin: ['http://localhost:5173', 'https://billetera-virtual-original.vercel.app', 'https://billetera-virtual.onrender.com'],
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Headers permitidos
};

app.use(cors(corsOptions));

mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log("Conexión exitosa"))
    .catch((err) => console.log("Error de conexión: " + err));

// Obtener gastos
app.get('/gasto', async (req, res) => {
    try {
        const gastos = await GastosModel.find();
        res.json(gastos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar gastos
app.post('/add-gasto', async (req, res) => {
    const { dia, mes, producto, metodo, condicion, monto } = req.body;
    if (!dia || !mes || !producto || !metodo || !condicion || !monto) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newGasto = new GastosModel({ dia, mes, producto, metodo, condicion, monto });
        const result = await newGasto.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar gastos
app.delete('/delete-gasto/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await GastosModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/edit-gasto/:id', (req,res) => {
    const {id} = req.params;
    const {dia, mes, producto, metodo, condicion, monto } = req.body;
    GastosModel.findByIdAndUpdate(id,{dia, mes, producto, metodo, condicion, monto },{new:true})
    .then(result => res.json(result))
    .catch(err => res.status(500).json({error: err.message}))
})

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal' });
});

app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});
