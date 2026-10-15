import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { wrap } from './crud.factory.js'

const checkPassword = p => (!p || p.length < 6) ? 'Password must be at least 6 characters' : null

const list = wrap(async (req, res) => res.json(await User.find().sort({ created: -1 })))

const read = wrap(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

const create = wrap(async (req, res) => {
  const { name, email, password } = req.body
  const err = checkPassword(password)
  if (err) return res.status(400).json({ error: err })
  const user = await User.create({ name, email, hashed_password: await bcrypt.hash(password, 10) })
  res.status(201).json(user)
})

const update = wrap(async (req, res) => {
  const changes = {}
  if (req.body.name !== undefined) changes.name = req.body.name
  if (req.body.email !== undefined) changes.email = req.body.email
  if (req.body.password !== undefined) {
    const err = checkPassword(req.body.password)
    if (err) return res.status(400).json({ error: err })
    changes.hashed_password = await bcrypt.hash(req.body.password, 10)
  }
  const user = await User.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

const remove = wrap(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ message: 'User deleted', deleted: user })
})

const removeAll = wrap(async (req, res) => {
  if (process.env.NODE_ENV === 'production')
    return res.status(403).json({ error: 'Disabled in production' })
  const r = await User.deleteMany({ _id: { $ne: req.auth._id } })
  res.json({ message: 'Users deleted', count: r.deletedCount })
})

export default { list, read, create, update, remove, removeAll }
