import { Router } from 'express';
import { saveAdoption, getAdoptions } from './adoption.controller.js';
import { publicLimiter, authtenticatedLimiter } from '../../middlewares/request-limit.js';
import { validateJWT } from '../../middlewares/jwt-verify.js';

const router = Router();

router.get('/', [validateJWT, authtenticatedLimiter], getAdoptions);
router.post('/', [validateJWT, authtenticatedLimiter], saveAdoption);

export default router;

