const express = require('express');
const router = express.Router();
const { getGastos, addGasto, deleteGasto, editGasto } = require('../Controllers/gastosController');

// Proteger rutas
const {protect, isAdmin} = require ('../Middleware/authMiddleware')

router.get('/gasto', getGastos);
router.post('/add-gasto', addGasto);
router.delete('/delete-gasto/:id', protect, isAdmin, deleteGasto);
router.patch('/edit-gasto/:id', protect, isAdmin, editGasto);

module.exports = router;
