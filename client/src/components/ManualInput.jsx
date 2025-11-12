import { useState } from 'react'
import { processManual } from '../services/api'
import ProgressLoader from './ProgressLoader'

function ManualInput({ setResults, setCurrentPage }) {
  const [entries, setEntries] = useState([
    { name: '', company: '', designation: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const addEntry = () => {
    setEntries([...entries, { name: '', company: '', designation: '' }])
  }

  const removeEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index))
  }

  const updateEntry = (index, field, value) => {
    const updated = [...entries]
    updated[index][field] = value
    setEntries(updated)
  }

  const handleSubmit = async () => {
    // Name is now optional - only company and designation are required
    const validEntries = entries.filter(e => e.company && e.designation)
    
    if (validEntries.length === 0) {
      alert('Please fill at least Company and Designation for each entry')
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      const data = await processManual({ entries: validEntries })
      
      clearInterval(interval)
      setProgress(100)
      
      setResults(data.results)
      setTimeout(() => {
        setCurrentPage('results')
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Processing error:', error)
      alert('Error processing entries: ' + (error.response?.data?.error || error.message))
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="flex gap-4 items-start">
            <input
              type="text"
              placeholder="Name (optional - leave blank to find multiple people)"
              value={entry.name}
              onChange={(e) => updateEntry(index, 'name', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Company *"
              value={entry.company}
              onChange={(e) => updateEntry(index, 'company', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Designation *"
              value={entry.designation}
              onChange={(e) => updateEntry(index, 'designation', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            {entries.length > 1 && (
              <button
                onClick={() => removeEntry(index)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addEntry}
        className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
      >
        + Add Another
      </button>

      {loading && <ProgressLoader progress={progress} />}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {loading ? 'Processing...' : 'Find LinkedIn Profiles'}
      </button>
    </div>
  )
}

export default ManualInput
