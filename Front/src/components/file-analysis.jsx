import { useEffect, useState } from "react"

export function FileAnalysis() {
  const [stats, setStats] = useState({
    totalSize: 0,
    avgSize: 0,
    largest: null,
    smallest: null,
    count: 0
  });

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    if (!files.length) {
      setStats({ totalSize: 0, avgSize: 0, largest: null, smallest: null, count: 0 });
      return;
    }
    let total = 0;
    let largest = files[0];
    let smallest = files[0];
    for (const f of files) {
      const size = typeof f.size === 'number' ? f.size : parseInt((f.size || '').replace(/[^\d]/g, ''));
      if (!isNaN(size)) {
        total += size;
        if (size > (typeof largest.size === 'number' ? largest.size : parseInt((largest.size || '').replace(/[^\d]/g, '')))) largest = f;
        if (size < (typeof smallest.size === 'number' ? smallest.size : parseInt((smallest.size || '').replace(/[^\d]/g, '')))) smallest = f;
      }
    }
    setStats({
      totalSize: total,
      avgSize: total / files.length,
      largest,
      smallest,
      count: files.length
    });
  }, []);

  function formatSize(bytes) {
    if (!bytes || isNaN(bytes)) return '0.00 MB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

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
      {stats.count === 0 ? (
        <div className="text-gray-400 mt-4">No files uploaded yet. Upload files to see statistics here.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Total Files:</p>
            <p className="text-xl font-medium text-white">{stats.count}</p>
          </div>
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Total Size:</p>
            <p className="text-xl font-medium text-white">{formatSize(stats.totalSize)}</p>
          </div>
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Largest File:</p>
            {stats.largest ? (
              <p className="text-xl font-medium text-white">{stats.largest.name} ({formatSize(typeof stats.largest.size === 'number' ? stats.largest.size : parseInt((stats.largest.size || '').replace(/[^\d]/g, '')) )})</p>
            ) : <p className="text-xl font-medium text-white">N/A</p>}
          </div>
          <div className="bg-zinc-700/20 p-4 rounded-xl">
            <p className="text-gray-400 mb-1 text-sm">Smallest File:</p>
            {stats.smallest ? (
              <p className="text-xl font-medium text-white">{stats.smallest.name} ({formatSize(typeof stats.smallest.size === 'number' ? stats.smallest.size : parseInt((stats.smallest.size || '').replace(/[^\d]/g, '')) )})</p>
            ) : <p className="text-xl font-medium text-white">N/A</p>}
          </div>
        </div>
      )}
    </div>
  )
}