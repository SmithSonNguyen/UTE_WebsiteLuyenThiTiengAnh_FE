// src/components/layouts/admin/Sidebar.jsx
import React from "react";
import {
  Home,
  User,
  GraduationCap,
  Library,
  TestTube2Icon,
  BookMarked,
  X,
  School,
} from "lucide-react";
import { NavLink } from "react-router-dom"; // QUAN TRỌNG: phải import cái này

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: "Main Dashboard", href: "/admin/dashboard" },
    { icon: User, label: "Users Management", href: "/admin/users-management" },
    {
      icon: GraduationCap,
      label: "Teachers Management",
      href: "/admin/teachers-management",
    },
    {
      icon: Library,
      label: "Course Management",
      href: "/admin/courses-management",
    },
    {
      icon: School,
      label: "Class Management",
      href: "/admin/classes-management",
    },
    {
      icon: TestTube2Icon,
      label: "Tests Management",
      href: "/admin/tests-management",
    },
    {
      icon: BookMarked,
      label: "Vocabulary Management",
      href: "/admin/vocab-management",
    },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col h-screen
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DTT ADMIN
            </h1>
            <button onClick={onClose} className="lg:hidden text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end // rất quan trọng với /admin/dashboard để không match con
                onClick={onClose} // đóng sidebar trên mobile khi click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
