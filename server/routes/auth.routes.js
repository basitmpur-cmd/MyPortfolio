import express from 'express'
import ctrl from '../controllers/auth.controller.js'
import { requireSignin } from '../middleware/auth.js'
const router = express.Router()
router.post('/signup', ctrl.signup)
router.post('/signin', ctrl.signin)
router.get('/signout', ctrl.signout)
router.get('/me', requireSignin, ctrl.me)
export default router
