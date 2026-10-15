import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: 'Name is required' },
  email: { type: String, trim: true, unique: true, required: 'Email is required',
           match: [/.+@.+\..+/, 'Please fill a valid email address'] },
  hashed_password: { type: String, required: 'Password is required', select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: { createdAt: 'created', updatedAt: 'updated' } })

UserSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.hashed_password; delete ret.__v; return ret }
})
export default mongoose.model('User', UserSchema)
