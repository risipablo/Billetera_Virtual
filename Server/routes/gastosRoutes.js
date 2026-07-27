
const express = require('express');
const router = express.Router();
const { getGastos, addGasto, deleteGasto, editGasto } = require('../controllers/gastosController');

// Proteger rutas
const {protect} = require ('../middleware/authMiddleware')


router.get('/bills',protect, getGastos);
router.post('/bills', protect,addGasto);
router.delete('/bills/:id', protect, deleteGasto);
router.patch('/bills/:id', protect ,editGasto);

module.exports = router;
