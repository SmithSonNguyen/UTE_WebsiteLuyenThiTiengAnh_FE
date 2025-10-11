import React from "react";

const CourseCard = ({ course, onViewDetail }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-3 text-white flex justify-between items-center">
        <h3 className="text-lg font-semibold">{course.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full bg-white bg-opacity-20 ${
            course.type === "pre-recorded" ? "text-yellow-100" : "text-red-100"
          }`}
        >
          {course.type === "pre-recorded" ? "Video" : "Live"}
        </span>
      </div>
      <div className="p-4">
        <p className="text-lg font-bold text-gray-800 mb-2">
          {course.subtitle}
        </p>
        <div className="text-orange-500 mb-2 flex items-center">
          ★★★★☆ {course.rating.average} ({course.rating.reviewsCount} đánh giá){" "}
          {course.studentsCount} học viên
        </div>
        <p className="text-xl font-bold text-green-500 mb-2">
          {course.discountPrice.toLocaleString()}đ{" "}
          <span className="text-sm text-gray-500 line-through">
            {course.price.toLocaleString()}đ
          </span>{" "}
          -{course.discountPercent}%
        </p>
        <p className="text-sm text-gray-600 mb-4">{course.description}</p>
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
