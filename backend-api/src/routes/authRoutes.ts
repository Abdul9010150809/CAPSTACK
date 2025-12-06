import { Router } from 'express';
import { login, register, verify, requestPasswordReset, resetPassword } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', verify);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;