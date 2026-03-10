import { Router } from 'express';
import { saveAdoption, getAdoptions } from './adoption.controller.js';

const router = Router();

router.get('/', getAdoptions);
router.post('/', saveAdoption);

export default router;
