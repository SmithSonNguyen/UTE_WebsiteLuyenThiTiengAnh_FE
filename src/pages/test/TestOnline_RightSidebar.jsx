import React from "react";

/**
 * Component: ToeicOnline_RightSidebar
 * Mô tả: Hiển thị thông tin người dùng, thống kê TOEIC, và các quảng cáo / tiện ích.
 *
 * @param {Object} props
 * @param {Object} props.currentUser - Thông tin user hiện tại (username, email, avatar, ...).
 * @param {number} [props.targetScore=600] - Điểm TOEIC mục tiêu của user.
 * @param {string} [props.examDate="-"] - Ngày thi dự kiến của user (VD: "2025-12-20").
 * @param {number} [props.daysUntilExam=0] - Số ngày còn lại tới kỳ thi.
 * @param {string} [props.avatarColor="#000000"] - Màu nền avatar (tùy chọn cho mỗi user).
 */

const ToeicOnline_RightSidebar = ({
  currentUser,
  targetScore = 600,
  examDate,
  daysUntilExam = 0,
  avatarColor = "#000000",
}) => {
  return (
    <aside className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Avatar and Username */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: avatarColor }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
              1.79-4 4 1.79 4 4 4zm0 2c-2.67 
              0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
          </div>

          <p className="font-medium text-gray-900 text-lg">
            {currentUser?.username || currentUser?.email || "User"}
          </p>
        </div>

        {/* TOEIC Info */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-600 mb-4 mx-auto w-fit">
            TOEIC
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ngày dự thi:</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-900">{examDate}</span>
                <button className="ml-2 p-1 text-gray-400 hover:text-blue-500 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 
                      2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 
                      3.732z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tới kỳ thi:</span>
              <span className="text-sm font-semibold text-gray-900">
                {daysUntilExam} ngày
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Điểm mục tiêu:</span>
              <span className="text-sm font-semibold text-gray-900">
                {targetScore}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Button */}
        <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center border border-blue-200">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 
              2v6a2 2 0 002 2h2a2 2 0 002-2zm0 
              0V9a2 2 0 012-2h2a2 2 0 012 
              2v10m-6 0a2 2 0 002 2h2a2 
              2 0 002-2m0 0V5a2 2 0 012-2h2a2 
              2 0 012 2v14a2 2 0 01-2 2h-2a2 
              2 0 01-2-2z"
            />
          </svg>
          Thống kê kết quả
        </button>
      </div>

      {/* Ads */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src="/api/placeholder/300/150"
            alt="IELTS Combo"
            className="w-full h-32 object-cover"
          />
          <div className="p-3">
            <p className="text-sm text-gray-600">
              IELTS Listening-Reading-Writing-Speaking Combo
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <img
            src="/api/placeholder/300/150"
            alt="TOEIC Calculator"
            className="w-full h-32 object-cover"
          />
          <div className="p-3">
            <p className="text-sm text-gray-600">Tính điểm thi TOEIC</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ToeicOnline_RightSidebar;
