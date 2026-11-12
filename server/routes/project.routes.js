import { crudRouter, PUBLIC } from './crud.router.js'
import ctrl from '../controllers/project.controller.js'
// Anyone can view; only admins create, update or delete.
export default crudRouter(ctrl, { list: PUBLIC, read: PUBLIC })
