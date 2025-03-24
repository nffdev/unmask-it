import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="mt-12 py-6 border-t border-zinc-800">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
        <Link
          to="/tools/disassembler"
          className="px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
        >
          Disassembler
        </Link>
        <Link
          to="/tools/decompiler"
          className="px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
        >
          Decompiler
        </Link>
        <Link
          to="/tools/debugger"
          className="px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
        >
          Debugger
        </Link>
        <Link
          to="/donate"
          className="px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-indigo-500/10 hover:text-indigo-400 transition-all"
        >
          Donate
        </Link>
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-zinc-800 rounded-full text-gray-400 hover:text-indigo-400 hover:bg-zinc-700 transition-all"
        >
          <span className="sr-only">GitHub</span>
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
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        </a>
        <a
          href="https://discord.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-zinc-800 rounded-full text-gray-400 hover:text-indigo-400 hover:bg-zinc-700 transition-all"
        >
          <span className="sr-only">Discord</span>
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
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-zinc-800 rounded-full text-gray-400 hover:text-indigo-400 hover:bg-zinc-700 transition-all"
        >
          <span className="sr-only">Twitter</span>
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
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
          </svg>
        </a>
      </div>
    </footer>
  )
}