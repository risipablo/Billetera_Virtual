import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { protect } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validate';
import { EmailComment } from '../controllers/resend.controller';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changeNameSchema,
  changePasswordSchema
} from '../validators/auth.schema';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.registerUser);
router.post('/login', validateBody(loginSchema), authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/forgot-password', validateBody(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), authController.resetPassword);
router.post('/verify-email', protect, validateBody(verifyEmailSchema), authController.verifyEmail);
router.post('/change-user', protect, validateBody(changeNameSchema), authController.changeUserName);
router.post('/change-password', protect, validateBody(changePasswordSchema), authController.changePassword);
router.get('/name', protect, authController.userName);
router.delete('/delete-account', protect, authController.deleteAccount);
router.post('/send-email', EmailComment);

router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

export default router;