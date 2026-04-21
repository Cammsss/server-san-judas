import { Router } from 'express';
import { saveDog, getDogs } from './dog.controller.js';
import { createDogValidator } from '../../middlewares/dog-validator.js';
import { uploadDog } from '../../middlewares/multer-uploads.js';
import { publicLimiter, authtenticatedLimiter } from '../../middlewares/request-limit.js';
import { validateJWT } from '../../middlewares/jwt-verify.js';

const router = Router();

router.get('/', publicLimiter, getDogs);
router.post('/', [validateJWT, authtenticatedLimiter, uploadDog, createDogValidator], saveDog);

export default router;

