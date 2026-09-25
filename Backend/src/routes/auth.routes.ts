import { Router } from 'express';
import * as authController from '../controllers/auth.controller'
import { protect } from '../middleware/authMiddleware';
import { EmailComment } from '../controllers/resend.controller';

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', protect, authController.verifyEmail);
router.post('/change-user', protect, authController.changeUserName);
router.post('/change-password', protect, authController.changePassword);
router.get('/name', protect, authController.userName);
router.post('/send-email', EmailComment);
router.delete('/delete-account', protect, authController.deleteAccount);

export default router;