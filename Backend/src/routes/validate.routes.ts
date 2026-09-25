import { Router } from 'express';
import { validateToken } from '../controllers/auth.controller';
import { authGuard } from '../config/passport';

const router = Router();

router.get('/validate-token', authGuard, validateToken);

export default router;