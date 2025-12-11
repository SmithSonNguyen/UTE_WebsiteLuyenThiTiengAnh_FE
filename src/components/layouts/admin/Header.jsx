// src/components/layouts/admin/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Bell, Search, ChevronDown, LogOut, User } from "lucide-react";
import { logoutUser } from "@/api/userApi";
import { logoutSuccess } from "@/redux/authSlice";
import ConfirmModal from "@/components/common/ConfirmModal";

// Map route → tên trang đẹp (có thể mở rộng dễ dàng)
const pageTitleMap = {
  "/admin/dashboard": "Main Dashboard",
  "/admin/users-management": "Users Management",
  "/admin/teachers-management": "Teachers Management",
  "/admin/courses-management": "Course Management",
  "/admin/tests-management": "Tests Management",
  "/admin/vocab-management": "Vocabulary Management",
};

// Hàm chuyển slug → Title đẹp (dự phòng nếu không có trong map)
const formatPageTitle = (pathname) => {
  if (pageTitleMap[pathname]) return pageTitleMap[pathname];

  return pathname
    .replace("/admin/", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.login?.currentUser);

  const currentPath = location.pathname;
  const pageTitle = formatPageTitle(currentPath);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setShowProfileDropdown(false);
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      dispatch(logoutSuccess());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn logout ở client nếu API lỗi
      dispatch(logoutSuccess());
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (currentUser?.profile?.firstname && currentUser?.profile?.lastname) {
      return (
        currentUser.profile.lastname.charAt(0).toUpperCase() +
        currentUser.profile.firstname.charAt(0).toUpperCase()
      );
    }
    return "AD";
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-4 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Breadcrumb + Title */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Page info */}
              <div>
                <p className="text-sm text-gray-500">
                  Pages /{" "}
                  <span className="text-gray-700 font-medium">{pageTitle}</span>
                </p>
                <h1 className="text-2xl font-bold text-gray-800 mt-1">
                  {pageTitle}
                </h1>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="bg-transparent border-none outline-none text-sm w-64"
                />
              </div>

              {/* Notification */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Profile Avatar with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {currentUser?.profile?.avatar ? (
                    <img
                      src={currentUser.profile.avatar}
                      alt="avatar"
                      className="w-9 h-9 rounded-xl object-cover shadow-md"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">
                        {getInitials()}
                      </span>
                    </div>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 hidden sm:block transition-transform ${
                      showProfileDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute top-14 right-0 bg-white shadow-lg rounded-lg border border-gray-200 min-w-[220px] overflow-hidden">
                    {/* User info */}
                    {currentUser?.profile && (
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <p className="font-semibold text-gray-800">
                          {currentUser.profile.lastname}{" "}
                          {currentUser.profile.firstname}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {currentUser.profile.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          Admin
                        </span>
                      </div>
                    )}

                    {/* Menu items */}

                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-200"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-red-600 font-medium">
                        Đăng xuất
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Confirm Logout Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        title="Xác nhận đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
        isLoading={isLoggingOut}
      />
    </>
  );
};

export default Header;
