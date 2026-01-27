import { Router } from 'express';
import { initVerification, verifyCode } from './auth.controller.js';

const router = Router();

router.post('/init-verification', initVerification);
router.post('/verify-code', verifyCode);

export default router;
