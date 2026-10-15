import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import config from '../../config/config.js'
import { wrap } from './crud.factory.js'

const signup = wrap(async (req, res) => {
  const { name, email, password } = req.body
  if (!password || password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  const user = await User.create({ name, email, hashed_password: await bcrypt.hash(password, 10) })
  res.status(201).json({ message: 'Successfully signed up!', user })
})

const signin = wrap(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  const user = await User.findOne({ email }).select('+hashed_password')
  if (!user || !(await bcrypt.compare(password, user.hashed_password)))
    return res.status(401).json({ error: 'Email and password do not match' })
  const token = jwt.sign({ _id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' })
  res.json({ token, user })
})

// Stateless JWT: signout = client deletes the token
const signout = (req, res) => res.json({ message: 'Signed out. Delete the token on the client.' })

export default { signup, signin, signout }
