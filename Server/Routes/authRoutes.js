const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const { protect } = require('../Middleware/authMiddleware');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/verify-email', protect, authController.verifyEmail);
router.post('/change-password', protect, authController.changePassword);

module.exports = router;