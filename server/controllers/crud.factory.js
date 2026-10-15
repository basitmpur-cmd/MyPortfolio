import mongoose from 'mongoose'

export const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

export const makeCrud = (Model, fields, label) => {
  const pick = body => Object.fromEntries(
    fields.filter(f => body[f] !== undefined).map(f => [f, body[f]]))

  return {
    list: wrap(async (req, res) => res.json(await Model.find().sort({ createdAt: -1 }))),

    read: wrap(async (req, res) => {
      const doc = await Model.findById(req.params.id)
      if (!doc) return res.status(404).json({ error: `${label} not found` })
      res.json(doc)
    }),

    create: wrap(async (req, res) => {
      const doc = await Model.create(pick(req.body))
      res.status(201).json(doc)
    }),

    update: wrap(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(
        req.params.id, pick(req.body), { new: true, runValidators: true })
      if (!doc) return res.status(404).json({ error: `${label} not found` })
      res.json(doc)
    }),

    remove: wrap(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id)
      if (!doc) return res.status(404).json({ error: `${label} not found` })
      res.json({ message: `${label} deleted`, deleted: doc })
    }),

    removeAll: wrap(async (req, res) => {
      if (process.env.NODE_ENV === 'production')
        return res.status(403).json({ error: 'Disabled in production' })
      const r = await Model.deleteMany({})
      res.json({ message: `All ${label} records deleted`, count: r.deletedCount })
    })
  }
}

export const validId = (req, res, next, id) =>
  mongoose.isValidObjectId(id) ? next() : res.status(400).json({ error: 'Invalid id' })
