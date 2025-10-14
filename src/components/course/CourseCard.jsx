import React from "react";

const CourseCard = ({ course, onViewDetail }) => {
  // Helper function để format giá tiền an toàn
  const formatPrice = (price) => {
    if (typeof price === "number") {
      return price.toLocaleString();
    }
    return "0";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-3 text-white flex justify-between items-center">
        <h3 className="text-lg font-semibold">{course?.title || "Khóa học"}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-20 ${
            course?.type === "pre-recorded" ? "text-yellow-100" : "text-red-100"
          }`}
        >
          {course?.type === "pre-recorded" ? "Tự học" : "Live"}
        </span>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-gray-800 mb-2">
          {`Từ ${course?.targetScoreRange?.min || 0} đến ${
            course?.targetScoreRange?.max || 0
          }+`}
        </p>
        {course?.discountPrice > 0 && course?.discountPercent > 0 ? (
          <>
            <div className="text-orange-500 mb-2 flex items-center">
              ★★★★☆ {course?.rating?.average || 0} (
              {course?.rating?.reviewsCount || 0} đánh giá){" "}
              {course?.studentsCount || 0} học viên
            </div>
            <p className="text-xl font-bold text-green-500 mb-2">
              {formatPrice(course?.discountPrice)}đ{" "}
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(course?.price)}đ
              </span>{" "}
              -{course?.discountPercent || 0}%
            </p>
          </>
        ) : (
          <>
            <div className="text-orange-500 mb-2 flex items-center">
              ★★★★☆ {course?.rating?.average || 0} (
              {course?.rating?.reviewsCount || 0} đánh giá){" "}
              {course?.studentsCount || 0} học viên
            </div>
            <p className="text-xl font-bold text-gray-800 mb-2">
              {formatPrice(course?.price)}đ
            </p>
          </>
        )}
        <p className="text-sm text-gray-600 mb-4">
          {course?.description || ""}
        </p>
        <button
          onClick={() => onViewDetail(course)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Xem Chi Tiết
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
