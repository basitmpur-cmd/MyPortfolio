import mongoose from 'mongoose'
const QualificationSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: 'Title is required' },
  completion: { type: Date, required: 'Completion date is required' },
  description: { type: String, trim: true, required: 'Description is required' }
}, { timestamps: true })
export default mongoose.model('Qualification', QualificationSchema)
