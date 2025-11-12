import fs from 'fs'
import csv from 'csv-parser'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import Result from '../models/Result.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const callPython = (data) => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, '../../python/main.py')
    const python = spawn('python', [pythonPath, JSON.stringify(data)])
    
    let output = ''
    let error = ''

    python.stdout.on('data', (data) => {
      output += data.toString()
    })

    python.stderr.on('data', (data) => {
      error += data.toString()
    })

    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(error || 'Python script failed'))
      } else {
        try {
          resolve(JSON.parse(output))
        } catch (e) {
          reject(new Error('Invalid JSON from Python: ' + output))
        }
      }
    })
  })
}

export const uploadCSV = async (req, res) => {
  try {
    const results = []
    const entries = []

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        entries.push({
          name: row.Name || row.name || '',  // Default to empty string
          company: row.Company || row.company || '',
          designation: row.Designation || row.designation || ''
        })
      })
      .on('end', async () => {
        fs.unlinkSync(req.file.path)

        for (const entry of entries) {
          try {
            const pythonResult = await callPython(entry)
            const result = await Result.create({
              ...entry,
              ...pythonResult
            })
            results.push(result)
          } catch (error) {
            console.error('Error processing entry:', error)
            results.push({
              ...entry,
              linkedin_url: null,
              confidence_score: 0,
              error: error.message
            })
          }
        }

        res.json({ results })
      })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const processManual = async (req, res) => {
  try {
    const { entries } = req.body
    const results = []

    console.log('Processing entries:', entries)

    for (const entry of entries) {
      try {
        console.log('Processing entry:', entry)
        const pythonResult = await callPython(entry)
        console.log('Python result:', pythonResult)
        
        const result = await Result.create({
          ...entry,
          ...pythonResult
        })
        results.push(result)
      } catch (error) {
        console.error('Error processing entry:', error)
        console.error('Error stack:', error.stack)
        results.push({
          ...entry,
          linkedin_url: null,
          confidence_score: 0,
          search_type: 'error',
          error: error.message
        })
      }
    }

    res.json({ results })
  } catch (error) {
    console.error('Error in processManual:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getResults = async (req, res) => {
  try {
    const results = await Result.find().sort({ timestamp: -1 }).limit(100)
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
