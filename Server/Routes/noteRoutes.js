const express = require('express');
const router = express.Router()
const { getNotes, addNotes, deleteNote, editNote } = require('../Controllers/noteController');
const {protect} = require('../Middleware/authMiddleware')



router.get('/note',protect, getNotes);
router.post('/note',protect, addNotes);
router.delete('/note/:id', protect, deleteNote)
router.patch('/note/:id', protect, editNote)

module.exports = router;