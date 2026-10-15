import mongoose from 'mongoose'
const ContactSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, required: 'First name is required' },
  lastName: { type: String, trim: true, required: 'Last name is required' },
  email: { type: String, trim: true, required: 'Email is required',
           match: [/.+@.+\..+/, 'Please fill a valid email address'] },
  phone: { type: String, trim: true },
  message: { type: String, trim: true }
}, { timestamps: true })
export default mongoose.model('Contact', ContactSchema)
