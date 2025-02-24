const express = require('express');
const router = express.Router()
const { getNotes, addNote } = require('../Controllers/noteController');
const {protect} = require('../Middleware/authMiddleware')



router.get('/note',protect, getNotes);
router.post('/note',protect, addNote);

module.exports = router;