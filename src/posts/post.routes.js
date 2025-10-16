import { Router } from 'express'
import { createPost, getAllPosts, getPostById } from './post.controller.js'
import { createPostValidator } from '../../middlewares/post-validator.js'

const router = Router()

router.post('/', createPostValidator, createPost)

router.post('/', createPost)

router.get('/', getAllPosts)

router.get('/:id', getPostById)

export default router
