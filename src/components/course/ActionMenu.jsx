import { useState, useRef, useEffect } from "react";
import { MoreVertical, LogIn, RefreshCw } from "lucide-react";

const ActionMenu = ({ session, onJoinClass, onRegisterMakeup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Tùy chọn"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[1000] animate-fadeIn">
          {/* Join Class Option */}
          <button
            onClick={() => {
              onJoinClass();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 group"
          >
            <LogIn className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Tham Gia Lớp Học
              </div>
              <div className="text-xs text-gray-500">
                Vào phòng học trực tuyến
              </div>
            </div>
          </button>

          {/* Makeup Option (if available) */}
          {session.showMakeupButton && (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  onRegisterMakeup();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 group"
              >
                <RefreshCw className="w-4 h-4 text-orange-600 group-hover:rotate-180 transition-transform duration-300" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Đăng Ký Học Bù
                  </div>
                  <div className="text-xs text-gray-500">
                    Buổi {session.sessionNumber}
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
