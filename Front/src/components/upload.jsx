import { useState } from "react"

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

export function Upload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)

  const onUploadSuccess = typeof window !== 'undefined' && window.onUploadSuccess ? window.onUploadSuccess : () => {};

  async function handleUpload(files) {
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', files[0]); 
      const res = await fetch('http://localhost:8080/api/scan', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Error uploading file.');
      const data = await res.json();
      setUploadSuccess('File uploaded and scanned !');
      const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      uploadedFiles.unshift({
        id: data.id,
        name: files[0].name,
        size: files[0].size + ' bytes',
        type: files[0].type,
        status: data.result || 'completed',
        date: new Date().toISOString()
      });
      localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
      onUploadSuccess(data);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleUpload(files);
    }
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
        <input
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={async (e) => {
            if (e.target.files && e.target.files.length > 0) {
              await handleUpload(e.target.files);
            }
          }}
        />
      </div>
    </div>
  )
}
