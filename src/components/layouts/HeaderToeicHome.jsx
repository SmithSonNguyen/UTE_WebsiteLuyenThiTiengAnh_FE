import React, { useState } from "react";
import ExamDropdownToeicHome from "./ExamDropdownToeicHome";
import StartModal from "../common/StartModal";
import AvatarMenu from "../common/AvatarMenu";

const HeaderToeicHome = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="max-w-screen-3xl mx-auto w-full px-2 py-2 md:px-4 lg:py-3 2xl:px-5 2xl:py-4">
        <div className="relative flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <a href="/vi/">
              <div className="relative rounded-[140px] bg-white px-3 py-2.5 shadow-sm hover:shadow-md transition">
                <img
                  src="../../../public/Superman_shield.svg.png"
                  alt="Logo DTT"
                  className="h-10 w-auto md:h-12 lg:h-14 2xl:h-16 object-contain"
                />
              </div>
            </a>

            {/* Dropdown */}
            <ExamDropdownToeicHome />

            {/* Menu */}
            <div className="font-svn-poppins hidden items-center rounded-[317px] bg-white px-1 py-0.5 font-semibold text-blue-900 lg:flex lg:gap-x-1 lg:max-2xl:text-xs 2xl:gap-x-2.5 shadow-sm">
              <a
                href="/toeic-home"
                className="rounded-[317px] bg-blue-100 text-blue-500 px-3 py-3 text-base font-semibold"
              >
                Xây dựng lộ trình
              </a>
              <a
                href="/toeic-home/free-entry-test"
                className="rounded-[317px] hover:bg-gray-100 px-3 py-3 text-base font-semibold"
              >
                Kiểm tra đầu vào
              </a>
              <a
                href="/vi/toeic/test-practice"
                className="rounded-[317px] hover:bg-gray-100 px-3 py-3 text-base font-semibold"
              >
                Luyện đề
              </a>
              <a
                href="/vi/toeic/score-guarantee-programme"
                className="rounded-[317px] hover:bg-gray-100 px-3 py-3 text-base font-semibold "
              >
                Cam kết đầu ra
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex 2xl:hidden px-4 py-2.5 text-sm font-semibold tracking-[0.08px] text-white bg-blue-500 hover:bg-blue-600 rounded-[32px] focus:ring-2 focus:ring-blue-300 transition text-base font-semibold"
            >
              Bắt đầu
            </button>

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
