import { Upload } from "@/components/upload"
import { FileAnalysis } from "@/components/file-analysis"
import { UploadedFiles } from "@/components/uploaded-files"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { GitHubScanner } from "@/components/github-scanner"
import { useRef, useState } from "react"
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function validateAllowedUrl(url) {
  try {
    const parsed = new URL(url);
    const allowedDomains = [
      "gofile.io",
      "github.com",
      "raw.githubusercontent.com",
      "cdn.discordapp.com",
      "discord.com",
    ];
    return allowedDomains.some(domain => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

export default function Home() {
  const uploadedFilesRef = useRef();
  const uploadRef = useRef();
  const [downloading, setDownloading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");

  const manageUrlChange = (e) => {
    setUrl(e.target.value);
    setUrlError("");
  };

  const manageUrlUpload = async () => {
    if (!url || !uploadRef.current) return;
    if (!validateAllowedUrl(url)) {
      setUrlError("Only gofile, github, or discord links are allowed.");
      return;
    }
    setDownloading(true);
    try {
      await uploadRef.current.uploadFromUrl(url);
      uploadedFilesRef.current?.refresh();
      setRefresh(r => r + 1);
    } catch (error) {
      console.error("Error uploading from URL:", error);
    } finally {
      setDownloading(false);
      setUrl("");
    }
  };

  const [activeTab, setActiveTab] = useState("file");

  const manageTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Navigation />

        <motion.main
          className="mt-8 bg-zinc-900/60 rounded-2xl p-8 shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Dashboard</h1>

          <Tabs defaultValue="file" className="w-full" onValueChange={manageTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="file">File Scanner</TabsTrigger>
              <TabsTrigger value="github">GitHub Scanner</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file" className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={manageUrlChange}
                  placeholder="Enter download link (GitHub/GoFile/Discord)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 px-4 pr-12 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                {urlError && (
                  <div className="text-red-500 text-xs mt-1">{urlError}</div>
                )}
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 hover:text-indigo-400 transition-colors disabled:opacity-60"
                  disabled={!!urlError || !url}
                  onClick={manageUrlUpload}
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
              
              <div className="mt-8 space-y-6">
                <FileAnalysis refresh={refresh} />
                <UploadedFiles 
                  ref={uploadedFilesRef} 
                  onFilesChanged={() => setRefresh(r => r + 1)} 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="github" className="space-y-6">
              <GitHubScanner onScanSuccess={() => {
                setRefresh(r => r + 1);
              }} />
            </TabsContent>
          </Tabs>
        </motion.main>

        <Footer />
      </div>
    </div>
  )
}
