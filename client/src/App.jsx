import { useState } from 'react'
import UploadPage from './pages/UploadPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  const [currentPage, setCurrentPage] = useState('upload')
  const [results, setResults] = useState([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">
            AI LinkedIn URL Finder
          </h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setCurrentPage('upload')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              currentPage === 'upload'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upload / Input
          </button>
          <button
            onClick={() => setCurrentPage('results')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              currentPage === 'results'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Results
          </button>
        </div>

        {currentPage === 'upload' ? (
          <UploadPage setResults={setResults} setCurrentPage={setCurrentPage} />
        ) : (
          <ResultsPage results={results} />
        )}
      </div>
    </div>
  )
}

export default App
