import React from 'react'
import { Outlet } from 'react-router-dom';

import LargeSidebar from '../components/shared/LargeSidebar';
import DashboardNavbar from '../components/shared/DashboardNavbar';


const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <LargeSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout