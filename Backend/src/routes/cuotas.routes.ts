import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getNotes,
  addNotes,
  addNoteItem,
  editNoteItem,
  toggleCompleteItem,
  deleteNote,
  editNote,
  toggleCompleteNote,
  deleteNoteItem,
  deleteAllCuotas,
  deletecuotasFilter
} from '../controllers/cuotas.controller';

const router = Router();

router.get('/note', protect, getNotes);
router.post('/note', protect, addNotes);

router.delete('/note/filtered', protect, deletecuotasFilter);
router.delete('/note', protect, deleteAllCuotas);
router.patch('/note/:id', protect, editNote);
router.patch('/note/:id/toggle', protect, toggleCompleteNote);
router.delete('/note/:id', protect, deleteNote);

router.post('/note/:id/item', protect, addNoteItem);
router.patch('/note/:id/item/:idx', protect, editNoteItem);
router.patch('/note/:id/item/:idx/toggle', protect, toggleCompleteItem);
router.delete('/note/:id/item/:idx', protect, deleteNoteItem);

export default router;