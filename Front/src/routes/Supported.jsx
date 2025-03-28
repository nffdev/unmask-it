import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function SupportedPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Navigation />

        <main className="mt-8 bg-zinc-900/60 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-white">Supported Software</h1>

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
                  { name: "Windows Executables (EXE, DLL)", icon: "windows" },
                  { name: "Linux Binaries (ELF)", icon: "linux" },
                  { name: "macOS Binaries (Mach-O)", icon: "apple" },
                  { name: "Java Files (JAR, CLASS)", icon: "coffee" },
                  { name: ".NET Files (EXE, DLL)", icon: "hash" },
                  { name: "Android (APK, DEX)", icon: "smartphone" },
                  { name: "iOS (IPA)", icon: "smartphone" },
                  { name: "WebAssembly (WASM)", icon: "globe" },
                  { name: "Python Scripts (PYC)", icon: "code" },
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
                  "ARM (32-bit)",
                  "ARM64 (64-bit)",
                  "MIPS",
                  "PowerPC",
                  "RISC-V",
                  "WebAssembly",
                  "JVM Bytecode",
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
                  "Java",
                  "C#",
                  "Python",
                  "JavaScript",
                  "Go",
                  "Swift",
                  "Rust (experimental)",
                  "Kotlin (experimental)",
                ].map((item, index) => (
                  <div key={index} className="bg-zinc-700/20 p-4 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
