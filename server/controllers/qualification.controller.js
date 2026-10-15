import Qualification from '../models/qualification.model.js'
import { makeCrud } from './crud.factory.js'
export default makeCrud(Qualification, ['title', 'completion', 'description'], 'Qualification')
