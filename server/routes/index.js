import express from 'express'
import multer from 'multer'
import { uploadCSV, processManual, getResults } from '../controllers/controller.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

router.post('/upload', upload.single('file'), uploadCSV)
router.post('/manual', processManual)
router.get('/results', getResults)

export default router
