import jwt from 'jsonwebtoken'
import config from '../../config/config.js'

export const requireSignin = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Authentication required' })
  try {
    req.auth = jwt.verify(token, config.jwtSecret)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const isAdmin = (req, res, next) =>
  req.auth?.role === 'admin' ? next() : res.status(403).json({ error: 'Admin access required' })

export const isSelfOrAdmin = (req, res, next) =>
  (req.auth._id === req.params.id || req.auth.role === 'admin')
    ? next() : res.status(403).json({ error: 'User is not authorized' })
