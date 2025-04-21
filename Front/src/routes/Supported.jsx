import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion";

export default function SupportedPage() {
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
          <h1 className="text-3xl font-bold mb-8 text-white">Supported</h1>

          <div className="space-y-8">
            <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                <span className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 mr-3">
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
                </span>
                File Formats
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Windows Executables (EXE)", icon: "windows" },
                  { name: "Windows Dynamic Link Libraries (DLL)", icon: "windows" },
                  { name: ".NET Files (EXE, DLL)", icon: "hash" },
                  // { name: "Python Scripts (PY, PYC)", icon: "code" },
                  // { name: "JavaScript Files (EXE, JS)", icon: "code" },
                  // { name: "Go Files (EXE, GO)", icon: "code" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-zinc-700/20 p-4 rounded-xl flex items-center hover:bg-zinc-700/30 transition-colors"
                  >
                    <div className="mr-3 text-indigo-400 p-2 bg-indigo-500/10 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
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
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                <span className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 mr-3">
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
                    <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" />
                    <line x1="8" y1="16" x2="8.01" y2="16" />
                    <line x1="8" y1="20" x2="8.01" y2="20" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                    <line x1="12" y1="22" x2="12.01" y2="22" />
                    <line x1="16" y1="16" x2="16.01" y2="16" />
                    <line x1="16" y1="20" x2="16.01" y2="20" />
                  </svg>
                </span>
                Architectures
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "x86 (32-bit)",
                  "x86-64 (64-bit)",
                  ".NET IL",

                ].map((item, index) => (
                  <div key={index} className="bg-zinc-700/20 p-4 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                <span className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 mr-3">
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
                    <path d="m16 18 6-6-6-6" />
                    <path d="m8 6-6 6 6 6" />
                  </svg>
                </span>
                Decompilation Languages
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "C",
                  "C++",
                  "C#",
                  // "Python",
                  // "JavaScript",
                  // "Go (experimental)",
                ].map((item, index) => (
                  <div key={index} className="bg-zinc-700/20 p-4 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.main>

        <Footer />
      </div>
    </div>
  )
}
