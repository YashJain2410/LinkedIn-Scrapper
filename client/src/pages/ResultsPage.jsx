import { useState, useEffect } from 'react'
import { getResults } from '../services/api'
import ResultsTable from '../components/ResultsTable'

function ResultsPage({ results: propResults }) {
  const [results, setResults] = useState(propResults)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!propResults || propResults.length === 0) {
      loadResults()
    }
  }, [])

  const loadResults = async () => {
    setLoading(true)
    try {
      const data = await getResults()
      setResults(data)
    } catch (error) {
      console.error('Error loading results:', error)
    }
    setLoading(false)
  }

  const downloadCSV = () => {
    const headers = ['Name', 'Company', 'Designation', 'LinkedIn URL', 'Confidence Score']
    const rows = results.map(r => [
      r.name,
      r.company,
      r.designation,
      r.linkedin_url || 'Not found',
      r.confidence_score || 0
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `linkedin-results-${Date.now()}.csv`
    a.click()
  }

  if (loading) {
    return <div className="text-center py-12">Loading results...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Results ({results.length})
        </h2>
        {results.length > 0 && (
          <button
            onClick={downloadCSV}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Download CSV
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          No results yet. Upload a CSV or enter data manually.
        </p>
      ) : (
        <ResultsTable results={results} />
      )}
    </div>
  )
}

export default ResultsPage
