import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import config from '../config/config.js'
import authRoutes from './routes/auth.routes.js'
import contactRoutes from './routes/contact.routes.js'
import projectRoutes from './routes/project.routes.js'
import qualificationRoutes from './routes/qualification.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()
app.use(express.json())
app.use((req, res, next) => { req.body = req.body || {}; next() })
app.use(helmet())
app.use(cors({ origin: config.clientUrl }))

app.get('/', (req, res) => res.json({ message: 'Welcome to My Portfolio application.' }))

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/qualifications', qualificationRoutes)
app.use('/api/users', userRoutes)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' })
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: Object.values(err.errors).map(e => e.message).join(', ') })
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: `${Object.keys(err.keyValue)[0]} already exists` })
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id' })
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

export default app
