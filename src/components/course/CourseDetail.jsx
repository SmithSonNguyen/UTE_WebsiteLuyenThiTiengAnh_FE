import React, { useState } from "react";
import FixedRegistrationCard from "./FixedRegistrationCard";

const CourseDetail = ({ course }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("muc-tieu");

  const features = course?.features || [
    "Đánh cơ bản về mục tiêu đạt điểm TOEIC Speaking - Writing tại mức đầu ra 240-300+",
    "Bài giảng hướng dẫn chi tiết làm đăng câu hỏi TOEIC Speaking- Writing",
    "Làm quen với cấu hình các hội, chủ đề trọng TOEIC Speaking- Writing với hàng trăm",
    "Bài thi mẫu trả lời- nghe- đọc am, đồng thời luyện nghe- viết câu trả lời cho",
    "Bổ sung cập nhật, làm mới nội dung, email, bài luận hiện tại",
  ];

  const tabs = [
    { id: "muc-tieu", label: "Mục tiêu khóa học" },
    { id: "thong-tin", label: "Thông tin khóa học" },
    { id: "chuong-trinh", label: "Chương trình học" },
    { id: "danh-gia", label: "Đánh giá (68)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Layout chính: Grid 2 cột cho lg+, sidebar cố định bên phải */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 px-4 lg:px-0">
        {/* Cột trái: Nội dung chính */}
        <div className="lg:col-span-1 space-y-0">
          {/* Header - Full width trong cột trái */}
          <div className="bg-black text-white py-8 px-4 lg:px-0 relative mb-0">
            <div className="max-w-full px-6">
              <span className="inline-block text-sm px-3 py-1 bg-blue-600 rounded-full mb-4">
                #Phần mềm online
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                [TOEIC SW] TOEIC Speaking và Writing [Tăng khóa TED Talks]
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center text-yellow-400 mr-4">
                  <span className="text-lg font-bold mr-1">4.9</span>
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <span key={star} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                    <span className="text-gray-600">☆</span> {/* 4.9 stars */}
                  </div>
                  <span className="text-white ml-2 text-sm">(68 Đánh giá)</span>
                </div>
                <span className="text-white text-sm">223 Học viên</span>
              </div>

              {/* Features - Bullet points */}
              <ul className="space-y-3 text-sm">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-400 font-bold mr-3 mt-1 flex-shrink-0">
                      ✓
                    </span>
                    <span className="text-gray-300 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tabs Navigation - Sticky top-0 */}
          <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
            <div className="px-4">
              <div className="flex space-x-8 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Nội dung Tabs */}
          <div className="py-8 space-y-6">
            {activeTab === "muc-tieu" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Mục tiêu khóa học</h3>
                <ul className="space-y-3">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 font-bold mr-3 mt-1">
                        ✓
                      </span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "thong-tin" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Thời lượng khóa học:</h4>
                    <p>50.0 giờ bài học video</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Số bài học:</h4>
                    <p>10 chủ đề, 54 bài học</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Bài tập thực hành:</h4>
                    <p>150 bài tập đa dạng</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "chuong-trinh" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Chương trình học</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold mb-1">
                      Chương 1: Giới thiệu TOEIC Speaking & Writing
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Tổng quan về cấu trúc bài thi
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold mb-1">
                      Chương 2: TOEIC Speaking Part 1-6
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Chiến lược và thực hành từng part
                    </p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold mb-1">
                      Chương 3: TOEIC Writing Part 1-3
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Kỹ năng viết email và essay
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "danh-gia" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Đánh giá từ học viên</h3>
                <div className="space-y-4">
                  <div className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="font-semibold mr-3">Nguyễn Văn A</div>
                      <div className="text-yellow-500">★★★★★</div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Khóa học rất hay, giảng viên nhiệt tình!
                    </p>
                  </div>
                  <div className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="font-semibold mr-3">Trần Thị B</div>
                      <div className="text-yellow-500">★★★★☆</div>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Nội dung phong phú, dễ hiểu.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Combo Deals - Giữ nguyên */}
            {course?.comboDeals && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold inline-block mb-2">
                    COMBO DEALS
                  </div>
                  <p className="text-red-700 font-bold text-sm mb-2">
                    (Giá {course.comboDeals.price.toLocaleString()}đ - giảm{" "}
                    {course.comboDeals.discount}%) {course.comboDeals.title}:
                  </p>
                  <ol className="list-decimal ml-6 mt-2 text-blue-600 text-sm">
                    {course.comboDeals.includedCourses.map((inc, idx) => (
                      <li key={idx}>{inc}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Sidebar cố định - Chỉ hiện lg+ */}
        <div className="hidden lg:block col-span-1">
          <div className="h-screen sticky top-0">
            {" "}
            {/* pt-4 để align với content */}
            <FixedRegistrationCard
              course={course}
              onRegister={() => setShowRegister(!showRegister)}
            />
          </div>
        </div>
      </div>

      {/* Mobile Registration - Sticky dưới tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 p-4">
        <button
          onClick={() => setShowRegister(!showRegister)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base hover:bg-blue-700 transition-colors"
        >
          ĐĂNG KÝ HỌC NGAY -{" "}
          {course?.discountPrice?.toLocaleString() || "989.000"}đ
        </button>
      </div>

      {/* Registration Modal - Giữ nguyên */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Đăng ký khóa học</h3>
              <button
                onClick={() => setShowRegister(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Gửi đăng ký
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
