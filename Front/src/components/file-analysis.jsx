import { useState } from "react"

export function FileAnalysis() {
    return (
      <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
        <div className="flex items-center mb-6">
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
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">File Analysis</h2>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Total Size:</p>
            <p className="text-xl font-medium text-white">0.00 MB</p>
          </div>
  
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Average Size:</p>
            <p className="text-xl font-medium text-white">0.00 MB</p>
          </div>
  
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Largest File:</p>
            <p className="text-xl font-medium text-white">N/A (0.00 MB)</p>
          </div>
  
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Smallest File:</p>
            <p className="text-xl font-medium text-white">N/A (Infinity MB)</p>
          </div>
        </div>
      </div>
    )
}