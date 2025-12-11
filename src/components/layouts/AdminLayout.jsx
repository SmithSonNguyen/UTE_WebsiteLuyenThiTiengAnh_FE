// src/components/layouts/admin/AdminLayout.jsx
import React, { useState } from "react";
import Sidebar from "@/components/layouts/admin/Sidebar";
import Header from "@/components/layouts/admin/Header";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - ẩn trên mobile, hiện khi click */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <Header onMenuClick={toggleSidebar} />

        {/* Main Content - scroll độc lập */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay khi sidebar mở trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
