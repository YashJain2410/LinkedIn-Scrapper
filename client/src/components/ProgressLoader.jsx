function ProgressLoader({ progress }) {
  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Processing...</span>
        <span className="text-sm font-medium text-indigo-600">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressLoader
