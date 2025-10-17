import React from "react";

const FixedRegistrationCard = ({ onRegister, course }) => {
  // Tính discountAmount nếu chưa có
  const discountAmount = course?.price
    ? course.price - (course.discountPrice || 0)
    : 811000;

  return (
    <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-200 sticky top-32 z-50 max-w-md mx-auto lg:mx-0">
      {" "}
      {/* top-32 để dưới header + tabs */}
      {/* Course Image Placeholder - Giống ảnh: Gradient xanh, text TOEIC S&W */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4 text-white text-center mb-4">
        {" "}
        {/* Điều chỉnh gradient giống ảnh hơn */}
        <div className="text-xs bg-white bg-opacity-20 rounded px-2 py-1 inline-block mb-1">
          DTT Toeic
        </div>
        <div className="text-lg font-bold">
          {course?.title || "From 0 to 300+ TOEIC Speaking & Writing"}
        </div>
        <div className="text-xs">Reading & Listening</div>
        <div className="text-xs mt-1 opacity-90">
          {`Mục tiêu ${course?.targetScoreRange.min} - ${course?.targetScoreRange.max}`}
        </div>
      </div>
      {/* Special Offer - Giống ảnh: Ưu đãi tháng 10/2025 */}
      {course?.discountPrice > 0 && course?.discountPercent > 0 ? (
        <div className="text-center mb-4">
          <div className="text-red-600 font-bold text-base">
            Ưu đãi đặc biệt tháng 10/2025:
          </div>
          <div className="text-green-600 text-2xl font-bold mb-1">
            {course?.discountPrice?.toLocaleString() || "989.000"}đ
          </div>
          <div className="text-gray-500 line-through text-xs mb-1">
            Giá gốc: {course?.price?.toLocaleString() || "1.800.000"}đ
          </div>
          <div className="text-red-600 text-xs">
            Tiết kiệm: {discountAmount.toLocaleString()}đ (-
            {course?.discountPercent || "45"}%)
          </div>
        </div>
      ) : (
        <div className="text-center mb-4">
          <div className="text-green-600 text-2xl font-bold mb-1">
            {course?.price?.toLocaleString() || "989.000"}đ
          </div>
        </div>
      )}
      {/* Register Button - Nút lớn, xanh đậm */}
      <button
        onClick={onRegister}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-base mb-3 hover:bg-blue-700 transition-colors"
      >
        ĐĂNG KÝ HỌC NGAY
      </button>
      {/* Free Trial - Có thể ẩn nếu không cần, nhưng giữ theo code cũ */}
      <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm mb-4 hover:bg-gray-50 transition-colors">
        Học thử miễn phí
      </button>
      {/* Course Stats - Icon và số liệu giống ảnh */}
      <div className="space-y-2 text-xs text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="mr-2 text-yellow-400 text-base w-[17px]">★</span>
          <span>{`${course?.rating?.average || "4.9"} sao trên ${
            course?.rating?.reviewsCount || "70"
          } đánh giá`}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 w-[17px]">👥</span>
          <span>{`${course?.studentsCount || "100"} học viên`}</span>
        </div>

        {course.type === "live-meet" ? (
          <>
            <div className="flex items-center">
              <span className="mr-2 w-[17px]">⏱️</span>
              <span>{`${
                course?.courseStructure?.hoursPerSession || "36"
              } giờ/buổi, mỗi tuần ${
                course?.courseStructure?.totalSessions /
                  course?.courseStructure?.durationWeeks || "12"
              } buổi`}</span>
            </div>

            <div className="flex items-center">
              <span className="mr-2 w-[17px]">👨‍🏫</span>
              <span>{`Khóa học kéo dài trong ${
                course?.courseStructure?.durationWeeks || "4"
              } tuần`}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="mr-2">📖</span>
                <span>
                  {course.preRecordedContent?.totalTopics} chủ đề,{" "}
                  {course.preRecordedContent?.totalLessons} bài học
                </span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="mr-2">✏️</span>
                <span>
                  {course.preRecordedContent?.totalExercises || 0} bài tập thực
                  hành
                </span>
              </span>
            </div>
          </>
        )}
      </div>
      {/* Contact - Giống ảnh */}
      <div className="text-center text-xs border-t pt-2">
        <p className="mb-1">Chưa chắc chắn khóa học này dành cho bạn?</p>
        <a href="#" className="text-blue-600 hover:underline block">
          Liên hệ để nhận tư vấn miễn phí!
        </a>
      </div>
    </div>
  );
};

export default FixedRegistrationCard;
