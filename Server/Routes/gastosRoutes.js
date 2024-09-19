const express = require('express');
const router = express.Router();
const gastoController = require('../Controllers/gastosController');

router.get('/gasto', gastoController.getGastos);
router.post('/add-gasto', gastoController.addGasto);
router.delete('/delete-gasto/:id', gastoController.deleteGasto);
router.patch('/edit-gasto/:id', gastoController.editGasto);

module.exports = router;
