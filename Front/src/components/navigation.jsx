import { Link } from "react-router-dom"

export function Navigation() {
  return (
    <header className="flex justify-between items-center py-4">
      <Link to="/" className="text-xl font-bold text-white flex items-center">
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
          className="mr-2 text-indigo-400"
        >
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
          <path d="M8.5 8.5v.01" />
          <path d="M16 15.5v.01" />
          <path d="M12 12v.01" />
          <path d="M11 17v.01" />
          <path d="M7 14v.01" />
        </svg>
        Unmask It
      </Link>

      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-indigo-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-indigo-400 transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link to="/supported" className="hover:text-indigo-400 transition-colors">
              Supported Software
            </Link>
          </li>
          <li>
            <Link to="/status" className="hover:text-indigo-400 transition-colors">
              Status
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}