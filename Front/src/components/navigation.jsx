import { Link, useLocation } from "react-router-dom";
import "./navbar-anim.css";

import { useRef, useLayoutEffect, useEffect, useState } from "react";

export function Navigation() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/supported", label: "Supported" },
    { to: "/status", label: "Status" },
  ];
  const linkRefs = useRef([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useLayoutEffect(() => {
    function updateSlider() {
      const idx = hoveredIdx !== null ? hoveredIdx : navLinks.findIndex(l => l.to === location.pathname);
      const node = linkRefs.current[idx];
      if (node) {
        const { left, width } = node.getBoundingClientRect();
        const parentLeft = node.parentNode.parentNode.getBoundingClientRect().left;
        setSliderStyle({ left: left - parentLeft, width });
      }
    }
    updateSlider();
    window.addEventListener('resize', updateSlider);
    return () => window.removeEventListener('resize', updateSlider);
  }, [location.pathname, hoveredIdx, navLinks.length]);

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
      
      <button 
        className="md:hidden p-2 text-white focus:outline-none" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
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
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      <nav className="hidden md:block">
        <div style={{ position: "relative" }}>
          <ul className="flex space-x-6 items-center h-[44px] relative">
            <div
              className="nav-slider-bg"
              style={{
                position: "absolute",
                top: 0,
                left: sliderStyle.left,
                width: sliderStyle.width, // 80px
                borderRadius: "8px",
                background: "#434a56",
                transition: "left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1)",
                zIndex: 0,
              }}
            />
            {navLinks.map((l, i) => (
              <li key={l.to} style={{ position: "relative", zIndex: 1 }}>
                <Link
                  to={l.to}
                  className={`nav-link${location.pathname === l.to ? " active" : ""}`}
                  ref={el => (linkRefs.current[i] = el)}
                  style={{
                    padding: "0.25em 1em",
                    borderRadius: 8,
                    fontWeight: 500,
                    color: "#fff",
                    background: "none",
                    transition: "color 0.2s",
                    position: "relative",
                    zIndex: 1,
                  }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="text-white focus:outline-none"
            aria-label="Close menu"
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col space-y-4 p-4">
          {navLinks.map((l, i) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={`block py-2 px-4 rounded-lg ${location.pathname === l.to ? 'bg-zinc-800 text-indigo-400' : 'text-white hover:bg-zinc-800'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}