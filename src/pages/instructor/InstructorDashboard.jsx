import React, { useState } from "react";
import HeaderToeicHome from "../../components/layouts/HeaderToeicHome";
import ClassesOverview from "../../components/instructor/ClassesOverview";
import AttendanceManagement from "../../components/instructor/AttendanceManagement";
import InstructorProfile from "../../components/instructor/InstructorProfile";

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("classes");

  const tabs = [
    { id: "classes", label: "Thông tin lớp học", icon: "📚" },
    { id: "attendance", label: "Điểm danh", icon: "✅" },
    { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "classes":
        return <ClassesOverview />;
      case "attendance":
        return <AttendanceManagement />;
      case "profile":
        return <InstructorProfile />;
      default:
        return <ClassesOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Instructor Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-screen-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-left mb-4">
            <a href="/instructor">
              <div className="relative rounded-[140px] bg-white px-3 py-2.5 shadow-sm hover:shadow-md transition">
                <img
                  src="../../../public/Superman_shield.svg.png"
                  alt="Logo DTT"
                  className="h-2 w-auto md:h-6 lg:h-7 2xl:h-8 object-contain"
                />
              </div>
            </a>
            <h1 className="text-2xl font-bold text-gray-900 ml-4">
              Bảng điều khiển của giảng viên
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-3xl mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default InstructorDashboard;
