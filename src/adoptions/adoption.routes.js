import { Router } from 'express';
import { saveAdoption, getAdoptions } from './adoption.controller.js';
import { publicLimiter } from '../../middlewares/request-limit.js';

const router = Router();

router.get('/', publicLimiter, getAdoptions);
router.post('/', publicLimiter, saveAdoption);

export default router;
