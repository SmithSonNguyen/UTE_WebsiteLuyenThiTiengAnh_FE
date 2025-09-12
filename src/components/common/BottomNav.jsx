import React from "react";

const TABS = ["Home", "Learn", "Practice", "Profile"];

import { useState, useRef, useEffect } from "react";

export default function BottomNav({ value, onChange, avatar }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

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
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl grid grid-cols-4">
        {TABS.map((t, idx) =>
          t !== "Profile" ? (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`py-3 text-sm ${
                value === t ? "font-semibold" : "text-gray-600"
              }`}
            >
              {t}
            </button>
          ) : (
            <div key={t} className="relative flex items-center justify-center">
              <button
                onClick={() => setOpen((o) => !o)}
                className="py-2 flex items-center justify-center"
                style={{ background: "none", border: "none" }}
              >
                <img
                  src={avatar || "https://i.pravatar.cc/40"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
              </button>
              {open && (
                <div
                  ref={menuRef}
                  className="absolute bottom-12 right-0 bg-white shadow-lg rounded-md py-2 px-4 min-w-[120px] text-left"
                >
                  <button
                    className="block w-full text-left py-1 hover:bg-gray-100"
                    onClick={() => onChange("Profile")}
                  >
                    Trang cá nhân
                  </button>
                  <button
                    className="block w-full text-left py-1 hover:bg-gray-100"
                    onClick={() => onChange("Logout")}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
