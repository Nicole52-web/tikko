import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center bg-blue-600 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      {/* Welcome text */}
      <h1 className="text-lg md:text-xl font-semibold">
        Welcome,&nbsp;
        <span className="font-bold">{user?.firstname || "User"}</span>
      </h1>

      {/* Account dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
        >
          <FaCircleUser className="text-2xl" />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-100 animate-fadeIn">
            <Link
              to="/dashboard/profile"
              className="block px-4 py-2 hover:bg-blue-50 rounded-t-lg text-decoration-none"
              onClick={() => setOpen(false)}
            >
              Profile Settings
            </Link>
            <button
              onClick={() => {
                logout();
                setOpen(false);
                navigate("/signin");
              }}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-b-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;
