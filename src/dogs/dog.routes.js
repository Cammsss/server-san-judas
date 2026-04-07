import { Router } from 'express';
import { saveDog, getDogs } from './dog.controller.js';
import { createDogValidator } from '../../middlewares/dog-validator.js';
import { uploadDog } from '../../middlewares/multer-uploads.js';
import { publicLimiter } from '../../middlewares/request-limit.js';

const router = Router();

router.get('/', publicLimiter, getDogs);
router.post('/', publicLimiter, uploadDog, createDogValidator, saveDog);

export default router;
