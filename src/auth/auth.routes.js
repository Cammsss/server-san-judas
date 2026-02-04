import { Router } from 'express';
import { initVerification, verifyCode, register, login } from './auth.controller.js';
import { uploadProfilePicture } from '../../middlewares/multer-uploads.js';

const router = Router();

router.post('/init-verification', initVerification);
router.post('/verify-code', verifyCode);
router.post('/register', uploadProfilePicture, register);
router.post('/login', login);

export default router;
