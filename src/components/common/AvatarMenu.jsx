import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ConfirmModal from "./ConfirmModal";
import { logoutUser } from "@/api/userApi";
import { logoutSuccess } from "@/redux/authSlice";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const avatar = useSelector((state) => state.auth.login?.currentUser?.avatar);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      dispatch(logoutSuccess());
      navigate("/toeic-home");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn logout ở client nếu API lỗi
      dispatch(logoutSuccess());
      navigate("/toeic-home");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div className="relative flex items-center justify-center">
        <button
          onClick={() => setOpen((o) => !o)}
          className="px-2 py-1.5 flex items-center justify-center bg-transparent border-none"
          style={{ background: "none", border: "none" }}
        >
          <img
            src={avatar || "/src/assets/defaultavatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full border object-cover"
          />
        </button>
        {open && (
          <div
            ref={menuRef}
            className="absolute top-12 right-0 bg-white shadow-lg rounded-md text-left min-w-[200px] overflow-hidden"
          >
            {avatar ? (
              <>
                <button
                  className="block w-full text-left hover:bg-gray-100 whitespace-nowrap px-4 py-2 rounded-t-md"
                  onClick={() => {
                    setOpen(false); // Đóng menu
                    navigate("/profile"); // Chuyển sang trang cá nhân
                  }}
                >
                  Trang cá nhân
                </button>
                <button
                  className="block w-full text-left hover:bg-gray-100 whitespace-nowrap px-4 py-2 rounded-t-md"
                  onClick={() => {
                    setOpen(false); // Đóng menu
                    navigate("/my-schedule"); // Chuyển sang trang lịch học của tôi
                  }}
                >
                  Lịch học của tôi
                </button>
                <button
                  className="block w-full text-left hover:bg-gray-100 whitespace-nowrap px-4 py-2 rounded-t-md"
                  onClick={() => {
                    setOpen(false);
                    navigate("/my-enrolled-courses"); // Chuyển sang trang khoá học của tôi
                  }}
                >
                  Khoá học của tôi
                </button>
                <button
                  className="block w-full text-left hover:bg-gray-100 whitespace-nowrap px-4 py-2 rounded-b-md"
                  onClick={handleLogoutClick}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button
                  className="block w-full text-left hover:bg-gray-100 whitespace-nowrap px-4 py-2 rounded-md"
                  onClick={() => {
                    setOpen(false); // Đóng menu
                    navigate("/login"); // Chuyển sang trang đăng nhập
                  }}
                >
                  Đăng nhập
                </button>
                <button
                  className="block w-full text-left hover:bg-gray-100 whitespace-nowrap px-4 py-2 rounded-md"
                  onClick={() => {
                    setOpen(false); // Đóng menu
                    navigate("/register"); // Chuyển sang trang đăng ký
                  }}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
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
}
