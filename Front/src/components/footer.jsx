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
          href="https://github.com/nffdev/unmask-it"
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
            width="20" 
            height="20"
            viewBox="0 -28.5 256 256"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
              <g>
                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="currentColor" fill-rule="nonzero" />
              </g>
          </svg>
        </a>
      </div>
    </footer>
  )
}