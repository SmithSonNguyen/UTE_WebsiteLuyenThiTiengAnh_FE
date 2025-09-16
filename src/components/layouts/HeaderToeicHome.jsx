import React from "react";
import ExamDropdownToeicHome from "./ExamDropdownToeicHome";

const HeaderToeicHome = () => {
  return (
    <div className="max-w-screen-3xl mx-auto w-full px-2 py-2 md:px-4 lg:py-3 2xl:px-5 2xl:py-4">
      <div className="relative flex items-center justify-between">
        {/* Left: Logo + Dropdown + Menu */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <a href="/vi/">
            <div className="relative rounded-[140px] bg-white px-3 py-2.5 md:px-5 md:py-3 lg:px-3 lg:py-2 2xl:px-5 2xl:py-3 shadow-sm hover:shadow-md transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="85"
                height="24"
                viewBox="0 0 85 24"
                fill="none"
                className="h-5 w-[71px] md:h-6 md:w-[85px] lg:h-5 lg:w-[71px] 2xl:h-6 2xl:w-[85px]"
              >
                {/* ... paths logo ... */}
              </svg>
            </div>
          </a>

          {/* Dropdown chọn kỳ thi */}
          <ExamDropdownToeicHome />

          {/* Menu desktop */}
          <div className="font-svn-poppins hidden items-center rounded-[317px] bg-white px-1 py-0.5 font-semibold text-blue-900 lg:flex lg:gap-x-1 lg:max-2xl:text-xs 2xl:gap-x-2.5 shadow-sm">
            <a
              href="/vi/toeic"
              className="rounded-[317px] lg:px-2 lg:py-2 2xl:px-3 2xl:py-3 bg-blue-100 text-blue-500 hover:cursor-default"
            >
              Xây dựng lộ trình
            </a>
            <a
              href="/vi/toeic/free-entry-test"
              className="rounded-[317px] hover:bg-gray-100 lg:px-2 lg:py-2 2xl:px-3 2xl:py-3"
            >
              Kiểm tra đầu vào
            </a>
            <a
              href="/vi/toeic/test-practice"
              className="rounded-[317px] hover:bg-gray-100 lg:px-2 lg:py-2 2xl:px-3 2xl:py-3"
            >
              Luyện đề
            </a>
            <a
              href="/vi/toeic/score-guarantee-programme"
              className="rounded-[317px] hover:bg-gray-100 lg:px-2 lg:py-2 2xl:px-3 2xl:py-3"
            >
              Cam kết đầu ra
            </a>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center gap-3 md:gap-4">
          <button className="hidden 2xl:flex px-5 py-3 text-md font-semibold tracking-[0.08px] text-white bg-blue-500 hover:bg-blue-600 rounded-[32px] focus:ring-2 focus:ring-blue-300 transition">
            Bắt đầu
          </button>
          <button className="inline-flex 2xl:hidden px-4 py-2.5 text-sm font-semibold tracking-[0.08px] text-white bg-blue-500 hover:bg-blue-600 rounded-[32px] focus:ring-2 focus:ring-blue-300 transition">
            Bắt đầu
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderToeicHome;
