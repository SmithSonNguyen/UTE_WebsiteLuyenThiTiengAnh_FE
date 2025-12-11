import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ExamDropdownToeicHome from "./ExamDropdownToeicHome";
import StartModal from "../common/StartModal";
import AvatarMenu from "../common/AvatarMenu";

const HeaderToeicHome = () => {
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();

  // top-level menu (hiển thị trực tiếp)
  const mainLinks = [
    { href: "/toeic-home", label: "Xây dựng lộ trình" },
    { href: "/toeic-home/free-entry-test", label: "Kiểm tra đầu vào" },
    { href: "/toeic-home/opening-schedule", label: "Lịch khai giảng" },
    { href: "/toeic-home/all-course", label: "Tất cả khóa học" },
    { href: "/toeic-home/test-online", label: "Luyện đề" },
    { href: "/toeic-home/vocabulary", label: "Học từ vựng" },
    { href: "/toeic-home/my-vocabulary", label: "Từ vựng của tôi" },
    { href: "/toeic-home/news-portal", label: "Luyện đọc qua báo" },
    { href: "/toeic-home/assurance", label: "Cam kết đầu ra" },
  ];

  // menu phụ → dropdown
  const secondaryLinks = [
    { href: "/toeic-home/my-vocabulary", label: "Từ vựng của tôi" },
    { href: "/toeic-home/news-portal", label: "Reading qua báo" },
    { href: "/toeic-home/free-entry-test", label: "Kiểm tra đầu vào" },
    { href: "/toeic-home/assurance", label: "Cam kết đầu ra" },
  ];

  return (
    <>
      <div className="max-w-screen-3xl mx-auto w-full px-2 py-2 md:px-4 lg:py-3 2xl:px-5 2xl:py-4">
        <div className="relative flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Logo */}
            <a href="/toeic-home">
              <div className="relative rounded-[140px] bg-white px-3 py-2.5 shadow-sm hover:shadow-md transition">
                <img
                  src="../../../public/Superman_shield.svg.png"
                  alt="Logo DTT"
                  className="h-8 w-auto md:h-12 lg:h-14 2xl:h-16 object-contain"
                />
              </div>
            </a>
            {/* Dropdown */}
            <ExamDropdownToeicHome />
          </div>

          {/* Menu - Scrollable horizontally */}
          <div className="hidden lg:flex flex-1 mx-4">
            <div className="scrollbar-hide flex items-center gap-1 bg-white rounded-full shadow-sm px-2 py-1 overflow-x-auto">
              {mainLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
          ${
            location.pathname === link.href
              ? "bg-blue-100 text-blue-600"
              : "hover:bg-gray-100 text-blue-900"
          }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* <button
              onClick={() => setOpenModal(true)}
              className="inline-flex 2xl:hidden px-4 py-2.5 text-sm font-semibold tracking-[0.08px] text-white bg-blue-500 hover:bg-blue-600 rounded-[32px] focus:ring-2 focus:ring-blue-300 transition"
            >
              Bắt đầu
            </button> */}

            <AvatarMenu />
          </div>
        </div>
      </div>

      {/* Add custom CSS to hide scrollbar but keep functionality */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Modal */}
      <StartModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default HeaderToeicHome;
