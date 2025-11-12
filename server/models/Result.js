import mongoose from 'mongoose'

const resultSchema = new mongoose.Schema({
  name: { type: String, required: false },  // Now optional
  company: { type: String, required: true },
  designation: { type: String, required: true },
  generated_query: { type: String },
  linkedin_url: { type: String },
  all_urls: [String],
  confidence_score: { type: Number, default: 0 },
  search_type: { type: String, enum: ['name_based', 'role_based'], default: 'name_based' },
  timestamp: { type: Date, default: Date.now }
})

export default mongoose.model('Result', resultSchema)
