import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Navigation />

        <main className="mt-8 bg-zinc-900/60 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold mb-8 text-white">System Status</h1>

          <div className="space-y-6">
            <div className="flex items-center justify-between bg-green-500/10 text-green-400 p-4 rounded-xl">
              <div className="flex items-center">
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
                  className="mr-2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="font-medium">All systems operational</span>
              </div>
              <span className="text-sm">Updated 5 minutes ago</span>
            </div>

            <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50">
              <div className="p-4 border-b border-zinc-700">
                <h2 className="text-xl font-semibold text-white">Services</h2>
              </div>
              <div className="divide-y divide-zinc-700">
                {[
                  { name: "Analysis API", status: "Operational", uptime: "99.98%" },
                  { name: "Disassembler", status: "Operational", uptime: "99.95%" },
                  { name: "Decompiler", status: "Operational", uptime: "99.92%" },
                  { name: "Database", status: "Operational", uptime: "100%" },
                  { name: "File Storage", status: "Operational", uptime: "99.99%" },
                ].map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-zinc-700/20 transition-colors"
                  >
                    <span>{service.name}</span>
                    <div className="flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                      <span className="text-green-400 mr-4">{service.status}</span>
                      <span className="text-gray-400">{service.uptime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50">
              <div className="p-4 border-b border-zinc-700">
                <h2 className="text-xl font-semibold text-white">Recent Incidents</h2>
              </div>
              <div className="p-6 text-center text-gray-400">
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
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <p>No recent incidents to report</p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700/50">
              <div className="p-4 border-b border-zinc-700">
                <h2 className="text-xl font-semibold text-white">Usage Statistics</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-zinc-700/20 p-4 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    <p className="text-gray-400 text-sm mb-1">Files analyzed today</p>
                    <p className="text-2xl font-semibold text-white">1,245</p>
                  </div>
                  <div className="bg-zinc-700/20 p-4 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    <p className="text-gray-400 text-sm mb-1">Average response time</p>
                    <p className="text-2xl font-semibold text-white">1.2s</p>
                  </div>
                  <div className="bg-zinc-700/20 p-4 rounded-xl hover:bg-zinc-700/30 transition-colors">
                    <p className="text-gray-400 text-sm mb-1">Active users</p>
                    <p className="text-2xl font-semibold text-white">328</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
