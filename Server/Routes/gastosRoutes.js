const express = require('express');
const router = express.Router();
const { getGastos, addGasto, deleteGasto, editGasto } = require('../Controllers/gastosController');

// Proteger rutas
const {protect} = require ('../Middleware/authMiddleware')

<<<<<<< HEAD
router.get('/gasto', protect, getGastos);
router.post('/add-gasto', protect,addGasto);
router.delete('/delete-gasto/:id', protect, deleteGasto);
router.patch('/edit-gasto/:id', protect ,editGasto);
=======
router.get('/gasto', getGastos);
router.post('/add-gasto', isAdmin,addGasto);
router.delete('/delete-gasto/:id', protect, isAdmin, deleteGasto);
router.patch('/edit-gasto/:id',protect,isAdmin,editGasto);
>>>>>>> 3f296b9d713bdbecb56fb70ff17172e24783b095

module.exports = router;
