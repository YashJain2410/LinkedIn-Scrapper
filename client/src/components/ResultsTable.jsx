import { useState } from 'react'

function ResultsTable({ results }) {
  const [expandedRow, setExpandedRow] = useState(null)

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100'
    if (score >= 0.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LinkedIn URL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result, index) => (
            <>
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.name || <span className="text-gray-400 italic">Multiple people</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.company}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.designation}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600">
                  {result.linkedin_url ? (
                    <a
                      href={result.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      View Profile
                    </a>
                  ) : (
                    <span className="text-gray-400">Not found</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full font-medium ${getConfidenceColor(result.confidence_score)}`}>
                    {(result.confidence_score * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {expandedRow === index ? 'Hide' : 'Details'}
                  </button>
                </td>
              </tr>
              {expandedRow === index && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 bg-gray-50">
                    <div className="text-sm">
                      <p className="font-medium text-gray-700 mb-2">Search Query:</p>
                      <p className="text-gray-600 mb-4">{result.generated_query}</p>
                      
                      {result.all_urls && result.all_urls.length > 0 && (
                        <>
                          <p className="font-medium text-gray-700 mb-2">
                            {result.search_type === 'role_based' 
                              ? `Found ${result.all_urls.length} LinkedIn Profiles:` 
                              : 'All Found URLs:'}
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {result.all_urls.map((url, i) => (
                              <li key={i}>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {url}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultsTable
