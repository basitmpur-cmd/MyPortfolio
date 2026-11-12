import { crudRouter, PUBLIC, SIGNED_IN } from './crud.router.js'
import ctrl from '../controllers/contact.controller.js'
// Anyone can submit the contact form; signed-in users can view; only admins update or delete.
export default crudRouter(ctrl, { create: PUBLIC, list: SIGNED_IN, read: SIGNED_IN })
