import { useState } from 'react'
import { uploadCSV } from '../services/api'
import ProgressLoader from './ProgressLoader'

function CSVUpload({ setResults, setCurrentPage }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a CSV file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setProgress(0)

    try {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const data = await uploadCSV(formData)
      
      clearInterval(interval)
      setProgress(100)
      
      setResults(data.results)
      setTimeout(() => {
        setCurrentPage('results')
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error processing CSV: ' + (error.response?.data?.error || error.message))
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-indigo-400 transition">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-lg font-medium text-gray-700">
            {file ? file.name : 'Click to upload CSV'}
          </span>
          <span className="text-sm text-gray-500 mt-2">
            Format: Name, Company, Designation
          </span>
        </label>
      </div>

      {loading && <ProgressLoader progress={progress} />}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Processing...' : 'Process CSV'}
      </button>
    </div>
  )
}

export default CSVUpload
