import { Router } from 'express';
import { saveDog } from './dog.controller.js';
import { createDogValidator } from '../../middlewares/dog-validator.js';
import { uploadDog } from '../../middlewares/multer-uploads.js';

const router = Router();

// POST /api/dogs (Base path defined in app.js)
// 1. uploadDog: Handles file upload (multipart/form-data)
// 2. createDogValidator: Validates body fields and checks if file exists
// 3. saveDog: Controller logic
router.post('/', uploadDog, createDogValidator, saveDog);

export default router;
