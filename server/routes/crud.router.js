import express from 'express'
import { validId } from '../controllers/crud.factory.js'
import { requireSignin, isAdmin } from '../middleware/auth.js'

export const crudRouter = (ctrl, auth = {}) => {
  const a = k => auth[k] || [requireSignin]
  const router = express.Router()
  router.param('id', validId)
  router.route('/')
    .get(...a('list'), ctrl.list)
    .post(...a('create'), ctrl.create)
    .delete(requireSignin, isAdmin, ctrl.removeAll)
  router.route('/:id')
    .get(...a('read'), ctrl.read)
    .put(...a('update'), ctrl.update)
    .delete(...a('remove'), ctrl.remove)
  return router
}
