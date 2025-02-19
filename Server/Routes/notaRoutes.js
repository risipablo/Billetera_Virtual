const express = require('express');
const router = express.Router();
const {protect} = require ('../Middleware/authMiddleware');
const { getNotas, addNota, deleteNota, editNota } = require('../Controllers/notaController');



router.get('/notas',protect, getNotas);
router.post('/notas', protect,addNota);
router.delete('/notas/:id', protect, deleteNota);
router.patch('/notas/:id', protect, editNota);

module.exports = router;