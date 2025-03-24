import { useState } from "react"

export function UploadedFiles() {
  const [files, setFiles] = useState([])

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">Uploaded Files</h2>
        </div>
        <span className="text-gray-400 bg-zinc-700/30 px-3 py-1 rounded-full text-sm">{files.length} file(s)</span>
      </div>

      {files.length > 0 ? (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-zinc-700/30 p-4 rounded-xl hover:bg-zinc-700/40 transition-colors"
            >
              <div className="flex items-center">
                <div className="mr-3 p-2 bg-zinc-700 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {file.size} • {file.type}
                  </p>
                </div>
              </div>
              <div>
                {file.status === "analyzing" && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Analyzing</span>
                )}
                {file.status === "completed" && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Completed</span>
                )}
                {file.status === "failed" && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Failed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-zinc-700/20 rounded-xl">
          <div className="inline-flex p-4 bg-zinc-700/30 rounded-full text-gray-400 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-gray-400">No files uploaded yet</p>
          <p className="text-gray-500 text-sm mt-2">Upload files to start analysis</p>
        </div>
      )}
    </div>
  )
}
