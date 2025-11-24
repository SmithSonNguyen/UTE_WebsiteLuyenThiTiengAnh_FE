import React, { useState, useEffect } from "react";
import { getAllCourses } from "@/api/courseApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import bannerImage from "@/assets/banner.png";

const AllCourse = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  // Filters
  const [filters, setFilters] = useState({
    type: "",
    level: "",
    page: 1,
    limit: 1000, // Lấy hết, số lớn đủ để lấy tất cả
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses(filters);
        setCourses(data.courses || []);
        setPagination(data.pagination || {});
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Không thể tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
      page: 1, // Reset to page 1 when filter changes
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Get level label
  const getLevelLabel = (level) => {
    const labels = {
      beginner: "Cơ bản",
      intermediate: "Trung cấp",
      advanced: "Nâng cao",
    };
    return labels[level] || level;
  };

  // Get level color
  const getLevelColor = (level) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  // Get type label
  const getTypeLabel = (type) => {
    return type === "pre-recorded" ? "Tự học" : "Học trực tuyến";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt="TOEIC Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 text-center max-w-7xl relative z-10">
          <h1 className="text-4xl md:text-4xl font-bold mb-10 ">
            Khóa học TOEIC tại DTT English
          </h1>
          <h2 className="text-2xl md:text-2xl font-semibold mb-4">
            Khám phá và tìm kiếm khóa học phù hợp với bạn, bắt đầu hành trình
            chinh phục mức điểm mơ ước!
          </h2>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Bộ lọc</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại khóa học
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="pre-recorded">Tự học</option>
                <option value="live-meet">Học trực tuyến</option>
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trình độ
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.level}
                onChange={(e) => handleFilterChange("level", e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Tìm thấy{" "}
            <span className="font-semibold">{pagination.totalItems}</span> khóa
            học
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc để xem thêm khóa học khác
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col h-full"
                  onClick={() => navigate(`/toeic-home/course/${course._id}`)}
                >
                  {/* Course Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-white text-xs font-semibold rounded-full shadow-lg">
                        {getTypeLabel(course.type)}
                      </span>
                    </div>

                    {/* Discount Badge */}
                    {course.discountPercent && course.discountPercent > 0 && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                          -{course.discountPercent}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Level Badge */}
                    <div className="mb-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                          course.level
                        )}`}
                      >
                        {getLevelLabel(course.level)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition min-h-[3.5rem]">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                      {course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 min-h-[1.5rem]">
                      {/* Rating */}
                      {course.rating && course.rating.average > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">
                            {course.rating.average.toFixed(1)}
                          </span>
                          <span className="text-xs">
                            ({course.rating.reviewsCount})
                          </span>
                        </div>
                      )}

                      {/* Students */}
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsCount || 0}</span>
                      </div>

                      {/* Duration */}
                      {course.courseStructure && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.courseStructure.totalHours}h</span>
                        </div>
                      )}
                    </div>

                    {/* Target Score */}
                    <div className="mb-4 text-sm min-h-[1.5rem]">
                      {course.targetScoreRange && (
                        <>
                          <span className="text-gray-600">Mục tiêu: </span>
                          <span className="font-semibold text-blue-600">
                            {course.targetScoreRange.min} -{" "}
                            {course.targetScoreRange.max} điểm
                          </span>
                        </>
                      )}
                    </div>

                    {/* Spacer to push price to bottom */}
                    <div className="flex-grow"></div>

                    {/* Price */}
                    <div className="border-t pt-4 mt-auto">
                      {course.discountPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(course.discountPrice)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(course.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-blue-600">
                          {formatPrice(course.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`p-2 rounded-md ${
                    pagination.hasPrevPage
                      ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-600"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNumber === 1 ||
                      pageNumber === pagination.totalPages ||
                      Math.abs(pageNumber - pagination.currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-md font-medium transition ${
                            pageNumber === pagination.currentPage
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === pagination.currentPage - 2 ||
                      pageNumber === pagination.currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="px-2 py-2 text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`p-2 rounded-md ${
                    pagination.hasNextPage
                      ? "bg-white text-blue-600 hover:bg-blue-50 border border-blue-600"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  } transition`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllCourse;
