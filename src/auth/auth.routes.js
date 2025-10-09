import { Router } from "express";
import { login, register } from './auth.controller.js'
import { uploadProfilePicture } from "../../middlewares/file-uploader.js";
import { registerValidator, loginValidator } from "../../middlewares/auth-validator.js";

const router = Router()

router.post('/register',
    uploadProfilePicture.single('profilePicture'),
    registerValidator,
    register
)

router.post('/login', loginValidator, login)

export default router
