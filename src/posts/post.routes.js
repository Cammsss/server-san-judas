import { Router } from 'express'
import { createPost, getAllPosts, getPostById } from './post.controller.js'

const router = Router()

router.post('/', createPost)

router.get('/', getAllPosts)

router.get('/:id', getPostById)

export default router
