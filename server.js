import config from './config/config.js'
import mongoose from 'mongoose'
import app from './server/express.js'
// import dns from 'dns'; dns.setServers(['8.8.8.8'])  // only if you get a DNS error

mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to the database!'))
  .catch(err => console.error('Database connection error:', err.message))

app.listen(config.port, () => console.log(`App running in port ${config.port}`))