import { Upload } from "@/components/upload"
import { FileAnalysis } from "@/components/file-analysis"
import { UploadedFiles } from "@/components/uploaded-files"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useRef, useState } from "react"

export default function Home() {
  const uploadedFilesRef = useRef();
  const uploadRef = useRef();
  const [urlDownloadLink, setUrlDownloadLink] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const handleUrlUpload = async () => {
    if (!urlDownloadLink || !uploadRef.current) return;
    setDownloading(true);
    try {
      await uploadRef.current.uploadFromUrl(urlDownloadLink);
      uploadedFilesRef.current?.refresh();
      setRefresh(r => r + 1);
    } catch (error) {
      console.error("Error uploading from URL:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Navigation />

        <main className="mt-8 bg-zinc-900/60 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Dashboard</h1>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={urlDownloadLink}
                onChange={e => setUrlDownloadLink(e.target.value)}
                placeholder="Enter download link (GitHub/GoFile/Discord)"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 hover:text-indigo-400 transition-colors disabled:opacity-60"
                disabled={!urlDownloadLink || downloading}
                onClick={handleUrlUpload}
              >
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
                  className="lucide lucide-arrow-right"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>

            <Upload ref={uploadRef} onUploadSuccess={() => { 
              uploadedFilesRef.current?.refresh(true); 
              setRefresh(r => r + 1); 
            }} />
            <FileAnalysis refresh={refresh} />
            <UploadedFiles 
              ref={uploadedFilesRef} 
              onFilesChanged={() => setRefresh(r => r + 1)} 
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
