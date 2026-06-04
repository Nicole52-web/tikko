import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUser,
  FaGlassCheers
} from "react-icons/fa";
import { CgLogOut } from "react-icons/cg";
import { PiUserFill } from "react-icons/pi";
import { LuTicketCheck } from "react-icons/lu";
import { TbChecklist } from "react-icons/tb";
import { TbDeviceDesktopAnalytics } from "react-icons/tb";
import { RiFileHistoryFill, RiRefund2Line, RiFunctionAddFill } from "react-icons/ri";

const LargeSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const role = user?.role;

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <aside className="w-64 bg-white border-r border-blue-100 shadow-lg h-screen flex flex-col justify-between p-4">
      {/* Profile Section */}
      <div>
        <div className="flex flex-col items-center mt-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaUser className="text-blue-600 text-3xl" />
          </div>
          <p className="mt-2 text-lg font-semibold text-blue-700">
            {user?.firstname || "User"}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8 flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <PiUserFill className="text-xl" /> Profile
          </NavLink>


          {/* APPLICANT LINKS */}
  {role === "applicant" && (
    <>
      <NavLink
        to="/dashboard/book-ticket"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`
        }
      >
        <LuTicketCheck className="text-xl" /> Book Ticket
      </NavLink>

      <NavLink
        to="/dashboard/my-tickets"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`
        }
      >
        <TbChecklist className="text-xl" /> My Tickets
      </NavLink>

      <NavLink
        to="/dashboard/history"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`
        }
      >
        <RiFileHistoryFill className="text-xl" /> History
      </NavLink>

      <NavLink
        to="/dashboard/refund"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`
        }
      >
        <RiRefund2Line className="text-xl" /> Refund
      </NavLink>
    </>
  )}

  {/* ORGANIZER LINKS */}
  {role === "organizer" && (
    <>
    <NavLink to="/dashboard/analytics" className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
      }`
    }>
      <TbDeviceDesktopAnalytics className="text-xl" /> Analytics
    </NavLink>
      <NavLink
        to="/dashboard/post-event"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`
        }
      >
        <RiFunctionAddFill className="text-xl" /> Post Event
      </NavLink>

      <NavLink
        to="/dashboard/events"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
            isActive
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`
        }
      >
        <FaGlassCheers className="text-xl" /> My Events
      </NavLink>

      <NavLink to="/dashboard/booked-events" className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition text-decoration-none ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`
      }>
        <TbChecklist className="text-xl" /> Booked Events
      </NavLink>
    </>
  )}

          
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition font-medium"
      >
        <CgLogOut className="text-xl" /> Logout
      </button>
    </aside>
  );
};

export default LargeSidebar;
