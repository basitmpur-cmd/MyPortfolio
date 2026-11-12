import express from 'express'
import { validId } from '../controllers/crud.factory.js'
import { requireSignin, isAdmin } from '../middleware/auth.js'

// Guard presets
export const PUBLIC = []
export const SIGNED_IN = [requireSignin]
export const ADMIN = [requireSignin, isAdmin]

// Builds CRUD routes. Every action defaults to ADMIN unless a route file opens it up.
export const crudRouter = (ctrl, auth = {}) => {
  const a = k => auth[k] || ADMIN
  const router = express.Router()
  router.param('id', validId)
  router.route('/')
    .get(...a('list'), ctrl.list)
    .post(...a('create'), ctrl.create)
    .delete(...ADMIN, ctrl.removeAll)
  router.route('/:id')
    .get(...a('read'), ctrl.read)
    .put(...a('update'), ctrl.update)
    .delete(...a('remove'), ctrl.remove)
  return router
}
