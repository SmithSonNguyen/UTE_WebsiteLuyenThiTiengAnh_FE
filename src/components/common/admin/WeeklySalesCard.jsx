import React from "react";
import { TrendingUp, Users, DollarSign } from "lucide-react";

const TopCoursesCard = ({ data }) => {
  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get top courses from data
  const topCourses = data?.top_courses || [];

  // Calculate total sales from all top courses
  const totalTopCourseSales = topCourses.reduce(
    (sum, course) => sum + course.total_sales,
    0
  );

  if (topCourses.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h3 className="text-lg font-bold">Top Courses</h3>
        </div>
        <p className="text-sm text-blue-100">No course data available</p>
      </div>
    );
  }

  // Get the highest selling course
  const topCourse = topCourses[0];

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          <h3 className="text-lg font-bold">Top Courses</h3>
        </div>
        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
          Best Sellers
        </span>
      </div>

      {/* Total Sales */}
      <div className="mb-6">
        <p className="text-sm text-blue-100 mb-1">Total Top Course Sales</p>
        <p className="text-3xl font-bold">
          {formatCurrency(totalTopCourseSales)}
        </p>
      </div>

      {/* Course List */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
        {topCourses.map((course, index) => {
          const salesPercentage =
            (course.total_sales / totalTopCourseSales) * 100;

          return (
            <div
              key={course._id}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 hover:bg-opacity-20 transition-all duration-200"
            >
              {/* Course Info */}
              <div className="flex items-start gap-3 mb-3">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-400 text-yellow-900"
                        : index === 1
                        ? "bg-gray-300 text-gray-700"
                        : "bg-orange-400 text-orange-900"
                    }`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white">
                  <img
                    src={course.course_thumbnail}
                    alt={course.course_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/48?text=Course";
                    }}
                  />
                </div>

                {/* Course Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1 line-clamp-2">
                    {course.course_name}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-blue-100">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{course.enrollment_count} enrolled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span>{formatCurrency(course.course_price)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-100">Total Sales</span>
                  <span className="font-semibold">
                    {formatCurrency(course.total_sales)}
                  </span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
                  <div
                    className="bg-white h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${salesPercentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-blue-100">
                  {salesPercentage.toFixed(1)}% of top course sales
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default TopCoursesCard;
