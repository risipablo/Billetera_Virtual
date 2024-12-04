
const express = require('express');
const router = express.Router();
const { getGastos, addGasto, deleteGasto, editGasto } = require('../Controllers/gastosController');

// Proteger rutas
const {protect} = require ('../Middleware/authMiddleware')


router.get('/gasto',protect, getGastos);
router.post('/add-gasto', protect,addGasto);
router.delete('/delete-gasto/:id', protect, deleteGasto);
router.patch('/edit-gasto/:id', protect ,editGasto);

module.exports = router;
