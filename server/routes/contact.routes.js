import { crudRouter } from './crud.router.js'
import ctrl from '../controllers/contact.controller.js'
export default crudRouter(ctrl, { create: [] })
