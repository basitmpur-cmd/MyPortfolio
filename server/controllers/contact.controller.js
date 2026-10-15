import Contact from '../models/contact.model.js'
import { makeCrud } from './crud.factory.js'
export default makeCrud(Contact, ['firstName', 'lastName', 'email', 'phone', 'message'], 'Contact')
