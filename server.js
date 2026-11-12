import config from './config/config.js'
import mongoose from 'mongoose'
import app from './server/express.js'
import { seedAdmin } from './server/seed.js'
// import dns from 'dns'; dns.setServers(['8.8.8.8'])  // only if you get a DNS error

if (!config.mongoUri || !config.jwtSecret) {
  console.error('Missing MONGODB_URI or JWT_SECRET. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

mongoose.connect(config.mongoUri)
  .then(async () => {
    console.log('Connected to the database!')
    await seedAdmin()
  })
  .catch(err => console.error('Database connection error:', err.message))

app.listen(config.port, () => console.log(`App running in port ${config.port}`))
