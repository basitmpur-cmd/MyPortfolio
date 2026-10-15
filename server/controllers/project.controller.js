import Project from '../models/project.model.js'
import { makeCrud } from './crud.factory.js'
export default makeCrud(Project, ['title', 'completion', 'description'], 'Project')
