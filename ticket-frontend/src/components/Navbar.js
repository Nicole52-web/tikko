import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClassName = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary text-white"
            style={{ width: 36, height: 36 }}
          >
            T
          </span>
          Tikko
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen ? "true" : "false"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${mobileOpen ? " show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <NavLink to="/events" className={navLinkClassName} onClick={() => setMobileOpen(false)}>
                Events
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/faqs" className={navLinkClassName} onClick={() => setMobileOpen(false)}>
                FAQs
              </NavLink>
            </li>
          </ul>

          <div className="d-flex gap-2">
            {!user ? (
              <>
                <Link to="/signin" className="btn btn-outline-primary" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
