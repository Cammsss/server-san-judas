import { Router } from 'express';
import { saveDog, getDogs } from './dog.controller.js';
import { createDogValidator } from '../../middlewares/dog-validator.js';
import { uploadDog } from '../../middlewares/multer-uploads.js';

const router = Router();

router.get('/', getDogs);
router.post('/', uploadDog, createDogValidator, saveDog);

export default router;
