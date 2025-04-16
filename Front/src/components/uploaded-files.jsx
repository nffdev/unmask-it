import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

export const UploadedFiles = forwardRef(function UploadedFiles(props, ref) {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  async function fetchFiles() {
    try {
      const data = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      setFiles(data);
      if (data.length > 0) {
        toast.info(`${data.length} file(s) loaded`);
      }
    } catch (e) {
      setFiles([]);
      toast.error('Failed to load uploaded files.');
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: fetchFiles
  }));

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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <DialogTrigger asChild key={file.id}>
                <div
                  className="flex items-center justify-between bg-zinc-700/30 p-4 rounded-xl hover:bg-zinc-700/40 transition-colors cursor-pointer"
                  onClick={() => { setSelectedFile(file); setDialogOpen(true); }}
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
                    {(file.status === "completed" || file.status === "clean") && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs mr-2">Completed</span>
                    )}
                    {file.status === "failed" && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs mr-2">Failed</span>
                    )}
                    {(file.status === "completed" || file.status === "clean") && (
                      <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">Clean</span>
                    )}
                    {file.status === "infected" && (
                      <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded-full text-xs">Infected</span>
                    )}
                  </div>
                </div>
              </DialogTrigger>
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
        <DialogContent className="bg-zinc-900">
          <DialogHeader>
            <DialogTitle className="text-white">File details</DialogTitle>
            <DialogDescription className="text-gray-300">
              {selectedFile ? (
                <div className="space-y-2 mt-2">
                  <div><span className="text-gray-400 font-semibold">Name:</span> <span className="text-gray-200">{selectedFile.name}</span></div>
                  <div><span className="text-gray-400 font-semibold">Type:</span> <span className="text-gray-200">{selectedFile.type}</span></div>
                  <div><span className="text-gray-400 font-semibold">Size:</span> <span className="text-gray-200">{selectedFile.size}</span></div>
                  <div><span className="text-gray-400 font-semibold">Status:</span> <span className="text-gray-200">{selectedFile.status}</span></div>
                  {selectedFile.date && (
                    <div><span className="text-gray-400 font-semibold">Date:</span> <span className="text-gray-200">{new Date(selectedFile.date).toLocaleString()}</span></div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400">No file selected.</span>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
})
