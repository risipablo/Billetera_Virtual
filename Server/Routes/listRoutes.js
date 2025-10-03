const express = require('express')
const { getList, addList, deleteList, addNoteList, deleteIndexList, editListItem, toggleCompleteDescription, ListCompleted,  } = require('../Controllers/listController')
const { protect } = require('../Middleware/authMiddleware');
const router = express.Router()

router.get('/list', protect, getList);
router.post('/list', protect, addList);
router.put('/list/:id/add-list', protect, addNoteList)
router.put('/list/:id/edit-list/:idx', protect, editListItem)
router.patch('/list/:id/completed', protect,ListCompleted)
router.patch('/list/:id/toggle-complete/:idx', protect, toggleCompleteDescription);
router.delete('/list/:id/delete-list/:indexList', protect, deleteIndexList)
router.delete('/list/:id', protect, deleteList);


module.exports = router;