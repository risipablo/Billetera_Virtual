
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addNoteItem,
    deleteNoteItem,
    editNoteItem,
    toggleCompleteItem,
    deleteNote,
    editNote,
    toggleCompleteNote,
    getNotes,
    addNotes,
    deleteAllCuotas
} = require('../controllers/cuotaController');


router.get('/note', protect, getNotes);
router.post('/note', protect, addNotes);
router.delete('/note/:id', protect, deleteNote);
router.delete('/note', protect, deleteAllCuotas);
router.patch('/note/:id', protect, editNote);
router.patch('/note/:id/toggle', protect, toggleCompleteNote);


router.post('/note/:id/item', protect, addNoteItem);
router.patch('/note/:id/item/:idx', protect, editNoteItem);
router.patch('/note/:id/item/:idx/toggle', protect, toggleCompleteItem);
router.delete('/note/:id/item/:idx', protect, deleteNoteItem);

module.exports = router;