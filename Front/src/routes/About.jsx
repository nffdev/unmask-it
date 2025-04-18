import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion";

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-8 text-white">About</h1>

          <div className="space-y-8">
            <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
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
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </span>
                Our Mission
              </h2>
              <p className="text-gray-300 leading-relaxed">
                <span className="font-bold">Unmask It</span> is a platform dedicated to software analysis and reverse engineering. Our goal is to provide
                security researchers, developers, and students with powerful tools to understand the internal workings
                of applications.
              </p>
            </section>

            <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
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
                    <path d="M12.9 7.1C12.9 4.8 11 3 8.7 3H2v15h6.7c2.3 0 4.2-1.8 4.2-4.1V7.1z" />
                    <path d="M22 3h-6.7C13 3 11.1 4.8 11.1 7.1v6.8c0 2.3 1.9 4.1 4.2 4.1H22V3z" />
                  </svg>
                </span>
                Features
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {[
                  "Disassembly of binaries for multiple architectures (x86, x64, .NET IL)",
                  "Decompilation to high-level languages (C, C++, ...)",
                  "Static and dynamic code analysis",
                  "Vulnerability and code pattern detection",
                  "Control flow graph visualization",
                  "Support for multiple executable file formats",
                ].map((item, index) => (
                  <li key={index} className="flex items-start bg-zinc-700/20 p-3 rounded-xl hover:bg-zinc-700/30 transition-colors">
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
                      className="mr-2 text-indigo-400 mt-0.5"
                    >
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </span>
                Ethical Usage
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Our tools are designed for legitimate research, education, and software development. We encourage
                ethical and responsible use of our platform. Analyzing copyrighted software without permission may be
                illegal in some jurisdictions. Please use these tools in accordance with applicable laws.
              </p>
            </section>
          </div>
        </motion.main>

        <Footer />
      </div>
    </div>
  )
}
