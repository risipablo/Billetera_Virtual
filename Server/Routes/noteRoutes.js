const express = require('express');
const router = express.Router()
const { getNotes, addNotes, deleteNote, editNote, addMoreNotes, deleteIndividualNote, addMoreDates, deleteIndividualDate, editItem, addMorePrecios } = require('../Controllers/noteController');
const {protect} = require('../Middleware/authMiddleware')



router.get('/note',protect, getNotes);
router.post('/note',protect, addNotes);
router.put('/note/:id/add-note', protect, addMoreNotes)
router.put('/note/:id/add-date', protect, addMoreDates)
router.put('/note/:id/add-price', protect, addMorePrecios)
router.delete('/note/:id', protect, deleteNote)
router.delete('/note/:id/delete-note/:noteIndex', protect, deleteIndividualNote)
router.delete('/note/:id/delete-date/:dateIndex', protect, deleteIndividualDate)
router.put('/note/:id/edit-note/:idx', protect, editItem)
router.patch('/note/:id', protect, editNote)

module.exports = router;