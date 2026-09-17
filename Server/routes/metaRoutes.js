const express = require('express');
const router = express.Router();
const metaController = require('../controllers/metaController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, metaController.crearMeta);
router.get('/', protect, metaController.listarMetas);
router.delete('/', protect, metaController.deleteAllMetas);
router.get('/:id', protect, metaController.obtenerMeta);
router.patch('/:id', protect, metaController.editarMeta);
router.delete('/filtered', protect, metaController.deleteFilterCuotas);
router.delete('/:id', protect, metaController.eliminarMeta);


router.post('/:id/aportes', protect, metaController.agregarAporte);
router.delete('/:id/aportes/:aporteId', protect, metaController.eliminarAporte);

module.exports = router;