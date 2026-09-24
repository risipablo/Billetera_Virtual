const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { EmailComment } = require('../controllers/resendController');
const { authGuard } = require('../config/passport');

router.post('/register',authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout',authController.logoutUser);
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/verify-email', protect, authController.verifyEmail);
router.post('/change-user', protect, authController.changeUserName);
router.post('/change-password', protect, authController.changePassword); 
router.get('/name', protect, authController.userName);
router.post('/send-email',EmailComment)
router.delete('/delete-account', protect, authController.deleteAccount);

// google
router.get('/google', authController.googleLogin)
router.get('/google/callback', authController.googleCallback)

// uso de passport jwt
router.get('/profile', authGuard, (req, res) => {
    res.json({ user: req.user });
});


module.exports = router