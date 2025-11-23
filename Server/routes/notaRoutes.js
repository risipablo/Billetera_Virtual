const express = require('express');
const router = express.Router()
const { getNotas, addNota, deleteNota, editNota } = require('../Controllers/notaController');

const {protect} = require('../Middleware/authMiddleware')


router.get('/notas',protect, getNotas);
router.post('/notas',protect, addNota);
router.delete('/notas/:id', protect, deleteNota);
router.patch('/notas/:id', protect, editNota);

module.exports = router;