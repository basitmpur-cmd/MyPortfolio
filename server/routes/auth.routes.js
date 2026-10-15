import express from 'express'
import ctrl from '../controllers/auth.controller.js'
const router = express.Router()
router.post('/signup', ctrl.signup)
router.post('/signin', ctrl.signin)
router.get('/signout', ctrl.signout)
export default router
