const express = require('express');
const { authGuard } = require('../config/passport');
const { validateToken } = require('../controllers/authController');
const router = express.Router()

router.get('/validate-token', authGuard, validateToken)


module.exports = router;


