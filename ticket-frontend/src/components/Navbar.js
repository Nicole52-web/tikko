import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-5">

        {/* Logo */}
        <div className="text-2xl font-extrabold tracking-wide text-blue">
          <Link to="/">Tikko</Link>
        </div>

        {/* Nav links */}
        <ul className="hidden md:flex items-center space-x-10 text-blue font-medium">
          <li>
            <Link to="/" className="px-8 hover:text-blue-200">Events</Link>
          </li>
          <li>
            <Link to="/faqs" className="px-8 hover:text-blue-200">FAQs</Link>
          </li>
          <li>
            <Link 
              to="/signin" 
              className="px-8 py-2 border border-white rounded-lg hover:bg-blue hover:text-blue-600 transition"
            >
              Sign In
            </Link>
          </li>
          <li>
            <Link 
              to="/signup" 
              className="px-8 py-2 border border-blue rounded-lg hover:bg-blue hover:text-blue-600 transition"
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="px-5 py-2 bg-blue-500 text-blue rounded-lg hover:bg-blue-600 transition"
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
