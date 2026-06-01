import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LogoTicket from "../assests/logoticket.png";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClassName = ({ isActive }) => `nav-link text-white${isActive ? " active" : ""}`;

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-blue-700 shadow-sm fixed-top">
      <div className="container-fluid px-3">
        <Link to="/" className="navbar-brand fw-bold text-white d-flex align-items-center gap-2">
          <img
            src={LogoTicket}
            alt="Tikko"
            className="navbar-logo d-inline-block object-contain"
          />
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

        <div className={`collapse navbar-collapse justify-content-end${mobileOpen ? " show" : ""}`}>
          <ul className="navbar-nav mb-2 mb-md-0">
            <li className="nav-item font-weight-bold">
              <NavLink to="/events" className={navLinkClassName} onClick={() => setMobileOpen(false)}>
                Events
              </NavLink>
            </li>
            <li className="nav-item font-weight-bold">
              <NavLink to="/faqs" className={navLinkClassName} onClick={() => setMobileOpen(false)}>
                FAQs
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 ms-md-3">
            {!user ? (
              <>
                <Link to="/signin" className="nav-link text-white px-2" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link to="/signup" className="nav-link text-white px-2" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
                <Link to="/contact-us" className="btn btn-secondary ms-2" onClick={() => setMobileOpen(false)}>
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/contact-us" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>
                  Contact Us
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
