import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  getList,
  addList,
  deleteList,
  addNoteList,
  deleteIndexList,
  editListItem,
  toggleCompleteDescription,
  ListCompleted,
  DeleteAll
} from '../controllers/listado.controller';

const router = Router();

router.get('/list', protect, getList);
router.post('/list', protect, addList);
router.delete('/list', protect, DeleteAll);
router.delete('/list/:id', protect, deleteList);

router.post('/list/:id/item', protect, addNoteList);
router.patch('/list/:id/item/:idx', protect, editListItem);
router.patch('/list/:id/item/:idx/toggle', protect, toggleCompleteDescription);
router.delete('/list/:id/item/:idx', protect, deleteIndexList);

router.patch('/list/:id/toggle', protect, ListCompleted);

export default router;

