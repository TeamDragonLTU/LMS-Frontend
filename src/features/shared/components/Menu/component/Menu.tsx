import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../css/Menu.css";
import { BookOpenCheck, LibraryBig, UserRoundCheck } from "lucide-react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  const closeOnNav = () => setOpen(false);

  return (
    <>
      {/* Hamburger (mobile only) */}
      <button
        className="hamburger-btn"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "✖" : "☰"}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav className="nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}
            onClick={closeOnNav}
          >
            <LibraryBig />Dashboard
          </NavLink>

          <NavLink
            to="/course"
            className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}
            onClick={closeOnNav}
          >
            <BookOpenCheck /> Min kurs
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) => "nav__link" + (isActive ? " is-active" : "")}
            onClick={closeOnNav}
          >
            <UserRoundCheck />Kursdeltagare
          </NavLink>
        </nav>
      </aside>

      {/* Backdrop when menu is open on mobile */}
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}
    </>
  );
}
