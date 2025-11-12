import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routes from './routes/index.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedin-finder')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api', routes)

app.get('/', (req, res) => {
  res.json({ message: 'AI LinkedIn Finder API' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
