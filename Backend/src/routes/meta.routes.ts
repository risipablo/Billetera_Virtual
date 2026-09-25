import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  crearMeta,
  listarMetas,
  obtenerMeta,
  editarMeta,
  eliminarMeta,
  agregarAporte,
  eliminarAporte,
  deleteAllMetas,
  deleteFilterCuotas
} from '../controllers/meta.controller';

const router = Router();

router.post('/', protect, crearMeta);
router.get('/', protect, listarMetas);
router.delete('/', protect, deleteAllMetas);
router.delete('/filtered', protect, deleteFilterCuotas);
router.get('/:id', protect, obtenerMeta);
router.patch('/:id', protect, editarMeta);
router.delete('/:id', protect, eliminarMeta);

router.post('/:id/aportes', protect, agregarAporte);
router.delete('/:id/aportes/:aporteId', protect, eliminarAporte);

export default router;