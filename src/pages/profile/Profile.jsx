import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 max-w-4xl mx-auto shadow-md rounded-lg overflow-hidden">
      {/* Header with decorative shapes */}
      <div className="relative bg-gradient-to-r from-cyan-300 via-blue-500 to-orange-400 h-32 overflow-hidden">
        {/* Decorative geometric shapes */}
        <div className="absolute top-4 left-8 w-24 h-24 bg-orange-500 transform rotate-45 opacity-80"></div>
        <div className="absolute top-8 right-16 w-32 h-32 bg-blue-600 transform rotate-12 opacity-70"></div>
        <div className="absolute bottom-8 left-1/4 w-20 h-20 bg-cyan-400 transform -rotate-45 opacity-60"></div>
        <div className="absolute bottom-4 right-1/3 w-16 h-16 bg-purple-500 transform rotate-30 opacity-50"></div>
      </div>{" "}
      {/* User info section */}
      <div className="pt-8 pb-6 text-center">
        {/* Avatar with edit icon */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <img
              src={user?.avatar || "/src/assets/defaultavatar.png"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover bg-black"
            />
            {/* Edit icon */}
            <div
              className="absolute bottom-0 right-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => navigate("/edit-profile")}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 mb-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {user.lastname} {user.firstname}
          </h1>
        </div>
        <p className="text-black-500 text-sm">Email: {user.email}</p>
      </div>
      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("courses")}
            className={`pb-3 px-1 mr-8 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "courses"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Khoá học
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "results"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Kết quả luyện thi
          </button>
        </div>
      </div>
      {/* Content based on active tab */}
      <div className="px-6">
        {activeTab === "courses" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Các khoá học
            </h2>

            {/* Complete TOEIC Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-1/3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Complete TOEIC
                </h3>
                <span className="bg-orange-400 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Học thử
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-400 h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
              </div>

              {/* Course description */}
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Tiến tục bài học:</span> Từ vựng
                  TOEIC - List 20
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Kết quả luyện thi
            </h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <p className="text-gray-500">Chưa có kết quả luyện thi nào</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
