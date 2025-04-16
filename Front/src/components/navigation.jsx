import { Link, useLocation } from "react-router-dom";
import "./navbar-anim.css";

import { useRef, useEffect, useState } from "react";

export function Navigation() {
  const location = useLocation();
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/supported", label: "Supported Software" },
    { to: "/status", label: "Status" },
  ];
  const linkRefs = useRef([]);
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const idx = hoveredIdx !== null ? hoveredIdx : navLinks.findIndex(l => l.to === location.pathname);
    const node = linkRefs.current[idx];
    if (node) {
      const { left, width } = node.getBoundingClientRect();
      const parentLeft = node.parentNode.parentNode.getBoundingClientRect().left;
      setSliderStyle({ left: left - parentLeft, width });
    }
  }, [location.pathname, hoveredIdx]);

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
        <div style={{ position: "relative" }}>
          <ul className="flex space-x-6 items-center h-[44px] relative">
            <div
              className="nav-slider-bg"
              style={{
                position: "absolute",
                top: 0,
                left: sliderStyle.left,
                width: sliderStyle.width,
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
    </header>
  );
}