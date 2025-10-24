import React, { useState } from "react";

const ExamDropdownToeicHome = () => {
  const [open, setOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState("TOEIC"); // ✅ mặc định TOEIC

  const exams = [
    { name: "TOEIC", href: "/toeic-home" },
    { name: "IELTS", href: "/ielts" },
    { name: "HSK", href: "/hsk" },
  ];

  return (
    <div className="relative">
      {/* Nút bấm */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-2 rounded-[317px] px-4 py-2 font-semibold text-blue-900 hover:bg-blue-50"
      >
        <span>{selectedExam}</span> {/* ✅ hiển thị exam đang chọn */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3 transition-transform ${
            open ? "rotate-180 text-blue-500" : ""
          }`}
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8h256c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z"
          />
        </svg>
      </button>

      {/* Menu xổ xuống */}
      {open && (
        <div className="absolute left-0 mt-2 w-40 rounded-lg bg-white shadow-lg border border-gray-100 z-50">
          {exams.map((exam) => (
            <a
              key={exam.name}
              href={exam.href}
              onClick={() => {
                setSelectedExam(exam.name); // ✅ đổi exam khi chọn
                setOpen(false); // ✅ đóng menu sau khi chọn
              }}
              className="block px-4 py-2 text-sm text-blue-900 hover:bg-blue-100"
            >
              {exam.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamDropdownToeicHome;
