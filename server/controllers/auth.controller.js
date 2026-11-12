import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import config from '../../config/config.js'
import { wrap } from './crud.factory.js'

const issueToken = user => jwt.sign(
  { _id: user._id, name: user.name, email: user.email, role: user.role },
  config.jwtSecret, { expiresIn: '1h' })

// New accounts are always regular users; the role cannot be set by the client.
const signup = wrap(async (req, res) => {
  const { name, email, password } = req.body
  if (!password || password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  const user = await User.create({ name, email, hashed_password: await bcrypt.hash(password, 10), role: 'user' })
  res.status(201).json({ message: 'Successfully signed up!', token: issueToken(user), user })
})

const signin = wrap(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  const user = await User.findOne({ email }).select('+hashed_password')
  if (!user || !(await bcrypt.compare(password, user.hashed_password)))
    return res.status(401).json({ error: 'Email and password do not match' })
  res.json({ token: issueToken(user), user })
})

// Stateless JWT: the server keeps no session, so sign-out means the client deletes its token.
const signout = (req, res) => res.json({ message: 'Signed out. Delete the token on the client.' })

// Returns the current user for a valid token (used by the React app on page load).
const me = wrap(async (req, res) => {
  const user = await User.findById(req.auth._id)
  if (!user) return res.status(401).json({ error: 'User no longer exists' })
  res.json({ user })
})

export default { signup, signin, signout, me }
