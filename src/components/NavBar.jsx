import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/NavBar.css";

export default function NavBar() {
  // Theme toggle (persists + respects system)
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const preferred =
      localStorage.getItem("theme") ||
      (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    setTheme(preferred);
    document.documentElement.setAttribute("data-theme", preferred);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const linkClass = ({ isActive }) =>
    "nav__link" + (isActive ? " nav__link--active" : "");

  return (
    <header className="nav">
      <div className="nav__aurora" aria-hidden="true" />

      <div className="nav__inner">
        {/* Brand */}
        <NavLink to="/" className="nav__brand" aria-label="Go to home">
          <span className="nav__brandIcon" aria-hidden="true">🍿🎥</span>
          <span className="nav__brandText">Movie Search</span>
        </NavLink>

        {/* Mobile toggle */}
        <input id="nav-toggle" className="nav__toggle" type="checkbox" />
        <label className="nav__hamburger" htmlFor="nav-toggle" aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </label>

        {/* Links */}
        <nav className="nav__links" aria-label="Primary">
          <NavLink end to="/" className={linkClass}>
            <span>Home</span>
            <i className="nav__ink" aria-hidden="true" />
          </NavLink>
          <NavLink to="/favorites" className={linkClass}>
            <span>Favorites</span>
            <i className="nav__ink" aria-hidden="true" />
          </NavLink>
        </nav>

        {/* Theme button */}
        <button
          type="button"
          className="nav__themeBtn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title="Toggle theme"
        >Toggle Theme
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1zm0 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.636 6.05a1 1 0 0 1 1.414 0l1.06 1.06a1 1 0 1 1-1.414 1.415l-1.06-1.06a1 1 0 0 1 0-1.415zM4.5 12a1 1 0 0 1 1-1H7a1 1 0 1 1 0 2H5.5a1 1 0 0 1-1-1zm9.5 6.5a1 1 0 0 1 1-1H17a1 1 0 1 1 0 2h-1.5a1 1 0 0 1-1-1zM16.89 8.525a1 1 0 0 1 1.415-1.414l1.06 1.06a1 1 0 0 1-1.414 1.415l-1.06-1.06zM12 17a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V18a1 1 0 0 1 1-1z" fill="currentColor"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
