import { crudRouter } from './crud.router.js'
import ctrl from '../controllers/qualification.controller.js'
export default crudRouter(ctrl, { list: [], read: [] })
