import express from 'express'
import ctrl from '../controllers/user.controller.js'
import { validId } from '../controllers/crud.factory.js'
import { requireSignin, isAdmin, isSelfOrAdmin } from '../middleware/auth.js'

const router = express.Router()
router.param('id', validId)
router.route('/')
  .get(requireSignin, ctrl.list)
  .post(ctrl.create)
  .delete(requireSignin, isAdmin, ctrl.removeAll)
router.route('/:id')
  .get(requireSignin, ctrl.read)
  .put(requireSignin, isSelfOrAdmin, ctrl.update)
  .delete(requireSignin, isSelfOrAdmin, ctrl.remove)
export default router
