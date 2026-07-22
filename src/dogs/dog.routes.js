import { Router } from 'express';
import { saveDog, getDogs, getDogById, updateDog, patchDog } from './dog.controller.js';
import { createDogValidator, updateDogValidator } from '../../middlewares/dog-validator.js';
import { uploadDog } from '../../middlewares/multer-uploads.js';
import { publicLimiter, authtenticatedLimiter } from '../../middlewares/request-limit.js';
import { validateJWT } from '../../middlewares/jwt-verify.js';

const router = Router();

router.get('/', publicLimiter, getDogs);
router.get('/:id', publicLimiter, getDogById);
router.post('/', [validateJWT, authtenticatedLimiter, uploadDog, createDogValidator], saveDog);
router.put('/:id', [validateJWT, authtenticatedLimiter, uploadDog, updateDogValidator], updateDog);
router.patch('/:id', [validateJWT, authtenticatedLimiter, uploadDog, updateDogValidator], patchDog);

export default router;

