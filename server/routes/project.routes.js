import { crudRouter } from './crud.router.js'
import ctrl from '../controllers/project.controller.js'
export default crudRouter(ctrl, { list: [], read: [] })
