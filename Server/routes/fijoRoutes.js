const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getFijo, addFijo, editFijo, deleteFijo, deleteAllFijo } = require('../controllers/fijoControllers');
const router = express.Router();


router.get('/fijo', protect,getFijo)
router.post('/fijo', protect, addFijo)
router.patch('/fijo/:id',protect, editFijo)
router.delete('/fijo/:id', protect, deleteFijo)
router.delete('/fijo', protect, deleteAllFijo)


module.exports = router;