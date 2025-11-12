import { useState } from 'react'
import CSVUpload from '../components/CSVUpload'
import ManualInput from '../components/ManualInput'

function UploadPage({ setResults, setCurrentPage }) {
  const [mode, setMode] = useState('csv')

  return (
    <div className="bg-white rounded-lg shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Find LinkedIn Profiles
      </h2>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMode('csv')}
          className={`flex-1 py-3 rounded-lg font-medium transition ${
            mode === 'csv'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upload CSV
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-3 rounded-lg font-medium transition ${
            mode === 'manual'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {mode === 'csv' ? (
        <CSVUpload setResults={setResults} setCurrentPage={setCurrentPage} />
      ) : (
        <ManualInput setResults={setResults} setCurrentPage={setCurrentPage} />
      )}
    </div>
  )
}

export default UploadPage
