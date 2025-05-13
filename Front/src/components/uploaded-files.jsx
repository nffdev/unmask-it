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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export const UploadedFiles = forwardRef(function UploadedFiles(props, ref) {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const FILES_PER_PAGE = 3;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(files.length / FILES_PER_PAGE);
  const paginatedFiles = files.slice((page - 1) * FILES_PER_PAGE, page * FILES_PER_PAGE);

  async function fetchFiles(silent = false) {
    try {
      const data = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
      
      const sortedData = data.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });
      
      setFiles(sortedData);
      
      if (!silent && props.silent !== true && data.length > 0) {
        toast.info(`${data.length} file(s) loaded`);
      }
      
      if (props.onFilesChanged) {
        props.onFilesChanged(sortedData);
      }
      
      return sortedData;
    } catch (e) {
      console.error('Failed to load uploaded files:', e);
      setFiles([]);
      toast.error('Failed to load uploaded files.');
      return [];
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);
  
  useEffect(() => {
    if (page > 1 && (page - 1) * FILES_PER_PAGE >= files.length) {
      setPage(1);
    }
  }, [files, page]);

  useImperativeHandle(ref, () => ({
    refresh: fetchFiles
  }));

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
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
          <>
            <div className="space-y-3">
              {paginatedFiles.map((file) => (
                <DialogTrigger asChild key={file.id}>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-700/30 p-3 sm:p-4 rounded-xl hover:bg-zinc-700/40 transition-colors cursor-pointer gap-2 sm:gap-0"
                    onClick={() => { setSelectedFile(file); setDialogOpen(true); }}
                  >
                    <div className="flex items-center min-w-0">
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
                        <p className="font-medium text-white">{file.name || 'Unknown file'}</p>
                        <p className="text-sm text-gray-400">
                          {file.size || '0 KB'} • {file.type ? (file.type.includes('/') ? file.type.split('/').pop() : file.type) : 'exe'}
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
                      {file.result === "clean" && (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">Clean</span>
                      )}
                      {file.result === "malicious" && (
                        <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded-full text-xs">Malicious</span>
                      )}
                      {file.status === "failed" && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs mr-2">Failed</span>
                      )}
                    </div>
                  </div>
                </DialogTrigger>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); setPage(pageNum); }}
                          isActive={page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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
        <DialogContent className="bg-zinc-900 max-w-lg">
          <button onClick={() => setDialogOpen(false)} className="absolute right-4 top-4 rounded-sm text-gray-400 hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          {selectedFile && (
            <div className="pt-2">
              <div className="flex items-center gap-3 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                <h2 className="text-white text-xl font-medium">File Scan Results</h2>
              </div>
              
              <div className="text-gray-400 mb-6 pl-9">
                Details for {selectedFile.name || 'unknown file'}
              </div>
              
              <div className="mb-5">
                <div className="text-xs text-gray-500 mb-1">File Name</div>
                <div className="text-gray-100">{selectedFile.name || 'Unknown'}</div>
              </div>
              
              <div className="mb-5">
                <div className="text-xs text-gray-500 mb-1">Scan Date</div>
                <div className="text-gray-100">{selectedFile.date ? new Date(selectedFile.date).toLocaleString() : 'Unknown'}</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-500 mb-1">Scan Result</div>
                {selectedFile.result ? (
                  <div className="flex items-center gap-2">
                    {selectedFile.result === "clean" || (typeof selectedFile.result === 'string' && selectedFile.result.toLowerCase().includes('no suspicious')) ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                        <span className="text-green-400 font-medium">No suspicious patterns detected</span>
                      </>
                    ) : selectedFile.result === "malicious" || selectedFile.status === "failed" ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        <span className="text-red-400 font-medium">Malicious patterns detected</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                        <span className="text-yellow-400 font-medium">{typeof selectedFile.result === 'string' ? selectedFile.result : JSON.stringify(selectedFile.result, null, 2)}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">No scan result available</span>
                )}
              </div>
              
              <div className="mt-6 pt-5 border-t border-zinc-700">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Size</div>
                    <div className="text-gray-300">{typeof selectedFile.size === 'number' ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : selectedFile.size || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Type</div>
                    <div className="text-gray-300">{selectedFile.type || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className="text-gray-300">{selectedFile.status || 'Unknown'}</div>
                  </div>
                  {selectedFile.hash && (
                    <div className="w-full">
                      <div className="text-xs text-gray-500 mb-1">SHA256</div>
                      <div className="text-gray-300 break-all text-xs font-mono">{selectedFile.hash}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
})
