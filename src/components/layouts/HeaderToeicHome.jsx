import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import ExamDropdownToeicHome from "./ExamDropdownToeicHome";
import StartModal from "../common/StartModal";
import AvatarMenu from "../common/AvatarMenu";

// Các mục trong dropdown "Luyện tập"
const practiceLinks = [
  { href: "/toeic-home/test-online", label: "🎯 Luyện đề" },
  { href: "/toeic-home/writing-test", label: "✍️ Luyện Viết" },
  { href: "/toeic-home/vocabulary", label: "📖 Học từ vựng" },
  { href: "/toeic-home/my-vocabulary", label: "⭐ Từ vựng của tôi" },
  { href: "/toeic-home/news-portal", label: "📰 Luyện đọc qua báo" },
];

// Các mục hiển thị trực tiếp trên navbar
const mainLinks = [
  { href: "/toeic-home", label: "Xây dựng lộ trình" },
  { href: "/toeic-home/free-entry-test", label: "Kiểm tra đầu vào" },
  { href: "/toeic-home/opening-schedule", label: "Lịch khai giảng" },
  { href: "/toeic-home/all-course", label: "Tất cả khóa học" },
  { href: "/toeic-home/assurance", label: "Cam kết đầu ra" },
];

const HeaderToeicHome = () => {
  const [openModal, setOpenModal] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPracticeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isPracticeActive = practiceLinks.some(
    (l) =>
      location.pathname === l.href ||
      location.pathname.startsWith(l.href + "/"),
  );

  return (
    <>
      <div className="max-w-screen-3xl mx-auto w-full px-2 py-2 md:px-4 lg:py-3 2xl:px-5 2xl:py-4">
        <div className="relative flex items-center justify-between gap-4">
          {/* ── Left: Logo + Exam dropdown ── */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <a href="/toeic-home">
              <div className="relative rounded-[140px] bg-white px-3 py-2.5 shadow-sm hover:shadow-md transition">
                <img
                  src="../../../public/Superman_shield.svg.png"
                  alt="Logo DTT"
                  className="h-8 w-auto md:h-12 lg:h-14 2xl:h-16 object-contain"
                />
              </div>
            </a>
            <ExamDropdownToeicHome />
          </div>

          {/* ── Center: Nav links + Luyện tập dropdown ── */}
          {/* NOTE: Dùng flex trực tiếp, KHÔNG bọc overflow-x-auto để dropdown không bị clip */}
          <div className="hidden lg:flex flex-1 mx-4 justify-center">
            <div className="flex items-center gap-1 bg-white rounded-full shadow-sm px-2 py-1">
              {/* Regular links */}
              {mainLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    location.pathname === link.href
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-blue-900"
                  }`}
                >
                  {link.label}
                </a>
              ))}

              {/* ── Luyện tập ── dropdown trigger nằm cùng cấp flex, NGOÀI bất kỳ overflow container nào */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setPracticeOpen((o) => !o)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    isPracticeActive || practiceOpen
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100 text-blue-900"
                  }`}
                >
                  Luyện tập
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      practiceOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown panel — renders bên dưới button, z-index cao */}
                {practiceOpen && (
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2"
                    style={{ zIndex: 9999 }}
                  >
                    {/* Mũi tên nhỏ trỏ lên */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 overflow-hidden">
                      <div className="w-3 h-3 bg-white border-l border-t border-gray-100 rotate-45 mx-auto translate-y-1 shadow-sm" />
                    </div>

                    {practiceLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setPracticeOpen(false)}
                        className={`flex items-center px-4 py-2.5 text-sm font-medium transition-all ${
                          location.pathname === link.href ||
                          location.pathname.startsWith(link.href + "/")
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Avatar ── */}
          <div className="flex items-center gap-3 md:gap-4">
            <AvatarMenu />
          </div>
        </div>
      </div>

      {/* Modal */}
      <StartModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default HeaderToeicHome;
