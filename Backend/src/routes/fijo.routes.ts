import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getFijo,
  addFijo,
  editFijo,
  deleteFijo,
  deleteAllFijo
} from '../controllers/fijo.controller';

const router = Router();

router.get('/fijo', protect, getFijo);
router.post('/fijo', protect, addFijo);
router.patch('/fijo/:id', protect, editFijo);
router.delete('/fijo/:id', protect, deleteFijo);
router.delete('/fijo', protect, deleteAllFijo);

export default router;