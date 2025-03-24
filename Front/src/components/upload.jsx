import { useState } from "react"

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export function Upload() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  return (
    <div
      className={cn(
        "bg-zinc-800 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300",
        isDragging
          ? "border-indigo-500 bg-zinc-800/80 shadow-lg shadow-indigo-900/20"
          : "border-zinc-700 hover:border-indigo-500/50",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mb-4 p-4 bg-indigo-500/10 rounded-full text-indigo-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-white mb-2">Upload Files</h3>
        <p className="text-gray-400">Drag & drop or click to select</p>
        <input id="file-upload" type="file" className="hidden" multiple />
      </div>
    </div>
  )
}
