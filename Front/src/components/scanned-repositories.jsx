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
import { GitHubLogoIcon, ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

export const ScannedRepositories = forwardRef(function ScannedRepositories(props, ref) {
  const [repositories, setRepositories] = useState([])
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  const REPOS_PER_PAGE = 3;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(repositories.length / REPOS_PER_PAGE);
  const paginatedRepos = repositories.slice((page - 1) * REPOS_PER_PAGE, page * REPOS_PER_PAGE);

  async function fetchRepositories(silent = false) {
    try {
      const data = JSON.parse(localStorage.getItem('scannedRepositories') || '[]');
      
      const sortedData = data.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });
      
      setRepositories(sortedData);
      
      if (!silent && props.silent !== true && data.length > 0) {
        toast.info(`${data.length} repository scan(s) loaded`);
      }
      
      if (props.onRepositoriesChanged) {
        props.onRepositoriesChanged(sortedData);
      }
      
      return sortedData;
    } catch (e) {
      console.error('Failed to load scanned repositories:', e);
      setRepositories([]);
      toast.error('Failed to load repository scan history.');
      return [];
    }
  }

  useEffect(() => {
    fetchRepositories();
  }, []);
  
  useEffect(() => {
    if (page > 1 && (page - 1) * REPOS_PER_PAGE >= repositories.length) {
      setPage(1);
    }
  }, [repositories, page]);

  useImperativeHandle(ref, () => ({
    refresh: fetchRepositories,
    addRepository: (repo) => {
      const existingRepos = JSON.parse(localStorage.getItem('scannedRepositories') || '[]');
      const newRepos = [repo, ...existingRepos];
      localStorage.setItem('scannedRepositories', JSON.stringify(newRepos));
      fetchRepositories();
    }
  }));

  function getRepoNameFromUrl(url) {
    try {
      const parsedUrl = new URL(url);
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        return `${pathParts[0]}/${pathParts[1]}`;
      }
      return url;
    } catch {
      return url;
    }
  }

  return (
    <div className="bg-zinc-800 rounded-2xl p-6 border border-zinc-700/50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 mr-3">
            <GitHubLogoIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-white">Scanned Repositories</h2>
        </div>
        <span className="text-gray-400 bg-zinc-700/30 px-3 py-1 rounded-full text-sm">{repositories.length} repo(s)</span>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {repositories.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedRepos.map((repo) => (
                <DialogTrigger asChild key={repo.id}>
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-700/30 p-3 sm:p-4 rounded-xl hover:bg-zinc-700/40 transition-colors cursor-pointer gap-2 sm:gap-0"
                    onClick={() => { setSelectedRepo(repo); setDialogOpen(true); }}
                  >
                    <div className="flex items-center min-w-0">
                      <div className="mr-3 p-2 bg-zinc-700 rounded-lg">
                        <GitHubLogoIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{getRepoNameFromUrl(repo.repoUrl)}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(repo.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      {repo.status === "analyzing" && (
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">Analyzing</span>
                      )}
                      <div className="flex gap-2 items-center">
                        {repo.status === "failed" ? (
                          <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded-full">
                            Failed
                          </span>
                        ) : (
                          <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                            Completed
                          </span>
                        )}
                        {repo.status !== "failed" && (
                          <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                            Clean
                          </span>
                        )}
                      </div>
                      {repo.result === "suspicious" && (
                        <span className="px-2 py-1 bg-amber-600/20 text-amber-400 rounded-full text-xs">Suspicious</span>
                      )}
                      {repo.status === "failed" && (
                        <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs mr-2">Failed</span>
                      )}
                    </div>
                  </div>
                </DialogTrigger>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <PaginationItem key={p}>
                      <PaginationLink 
                        onClick={() => setPage(p)}
                        isActive={page === p}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="bg-zinc-700/30 inline-flex p-3 rounded-full mb-3">
              <GitHubLogoIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white">No repositories scanned yet</h3>
            <p className="text-gray-400 mt-1">Scanned repositories will appear here</p>
          </div>
        )}

        {selectedRepo && (
          <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <GitHubLogoIcon className="w-5 h-5" />
                Repository Scan Results
              </DialogTitle>
              <DialogDescription>
                Details for {getRepoNameFromUrl(selectedRepo.repoUrl)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Repository URL</h4>
                <p className="text-white break-all">{selectedRepo.repoUrl}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Scan Date</h4>
                <p className="text-white">{new Date(selectedRepo.date).toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Scan Result</h4>
                <div className="flex items-center gap-2">
                  {selectedRepo.status === "failed" ? (
                    <>
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                      <span className="text-red-400">Scan failed</span>
                    </>
                  ) : selectedRepo.result === "suspicious" ? (
                    <>
                      <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                      <span className="text-amber-400">Suspicious patterns detected</span>
                    </>
                  ) : (
                    <>
                      <CheckCircledIcon className="w-5 h-5 text-green-500" />
                      <span className="text-green-400">No suspicious patterns detected</span>
                    </>
                  )}
                </div>
              </div>
              
              {selectedRepo.matchesFound && Object.keys(selectedRepo.matchesFound).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Suspicious Files</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(selectedRepo.matchesFound).map(([filePath, matches]) => (
                      <div key={filePath} className="bg-zinc-800 p-3 rounded-lg">
                        <p className="text-sm font-medium text-white break-all">{filePath}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Matched patterns: {matches.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedRepo.error && (
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Error</h4>
                  <p className="text-red-400">{selectedRepo.error}</p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
});
