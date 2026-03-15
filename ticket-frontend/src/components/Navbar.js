import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide text-black-600">
          <Link to="/">Tikko</Link>
        </div>

        {/* Nav links */}
        <ul className="hidden md:flex items-center space-x-6 text-black-600 font-medium">
          <li>
            <Link
              to="/"
              className="px-4 py-2 hover:text-blue-600 transition"
            >
              Events
            </Link>
          </li>
          <li>
            <Link
              to="/faqs"
              className="px-4 py-2 hover:text-blue-600 transition"
            >
              FAQs
            </Link>
          </li>
          <li className="px-4">
            <Link
              to="/signin"
              className="px-5 py-2 border border-black-200 rounded-lg hover:bg-blue-700 hover:text-white transition"
            >
              Sign In
            </Link>
          </li>
          <li className="px-4">
            <Link
              to="/signup"
              className="px-5 py-2 border border-black-200 rounded-lg hover:bg-blue-700 hover:text-white transition"
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              to={user ? "/dashboard" : "/signin"}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;