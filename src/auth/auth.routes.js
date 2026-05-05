import { Router } from 'express';
import { initVerification, verifyCode, register, login } from './auth.controller.js';
import { uploadProfilePicture } from '../../middlewares/multer-uploads.js';
import { publicLimiter, loginLimiter } from '../../middlewares/request-limit.js';

const router = Router();

router.post('/init-verification', publicLimiter, initVerification);
router.post('/verify-code', publicLimiter, verifyCode);
router.post('/register', publicLimiter, uploadProfilePicture, register);
router.post('/login', loginLimiter, login);

export default router;
