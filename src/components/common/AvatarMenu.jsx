import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

export default function AvatarMenu({ onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const avatar = useSelector((state) => state.auth.login?.currentUser?.avatar);

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

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-2 py-1.5 flex items-center justify-center bg-transparent border-none"
        style={{ background: "none", border: "none" }}
      >
        <img
          src={avatar || "https://i.pravatar.cc/40"}
          alt="avatar"
          className="w-8 h-8 rounded-full border object-cover"
        />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute top-12 right-0 bg-white shadow-lg rounded-md py-2 px-4 text-left min-w-[200px]"
        >
          <button
            className="block w-full text-left py-1 hover:bg-gray-100 white-space-nowrap"
            onClick={() => {
              setOpen(false); // Đóng menu
              onProfile(); // Chuyển sang trang cá nhân
            }}
          >
            Trang cá nhân
          </button>
          <button
            className="block w-full text-left py-1 hover:bg-gray-100"
            onClick={onLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
