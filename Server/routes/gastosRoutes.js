
const express = require('express');
const router = express.Router();
const { getGastos, addGasto, deleteGasto, editGasto } = require('../controllers/gastosController');

// Proteger rutas
const {protect} = require ('../middleware/authMiddleware')


router.get('/gasto',protect, getGastos);
router.post('/add-gasto', protect,addGasto);
router.delete('/delete-gasto/:id', protect, deleteGasto);
router.patch('/edit-gasto/:id', protect ,editGasto);

module.exports = router;
