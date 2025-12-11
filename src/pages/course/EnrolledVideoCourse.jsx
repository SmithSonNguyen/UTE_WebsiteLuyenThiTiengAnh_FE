import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BookOpen, Clock, Users, Star, Award, Play, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyEnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy accessToken từ Redux store giống VocabTranslator
  const accessTokenFromStore = useSelector(
    (state) => state?.auth?.login?.accessToken
  );

  useEffect(() => {
    if (accessTokenFromStore) {
      fetchEnrolledCourses();
    } else {
      setError("Vui lòng đăng nhập để xem khóa học của bạn");
      setLoading(false);
    }
  }, [accessTokenFromStore]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/courses/my-enrolled-courses",
        {
          headers: {
            Authorization: `Bearer ${accessTokenFromStore}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        }
        throw new Error("Không thể tải khóa học");
      }

      const data = await response.json();
      setCourses(data.result.courses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (courseId) => {
    navigate(`/learning/${courseId}`);
  };

  const getLevelBadge = (level) => {
    const badges = {
      beginner: { label: "Cơ bản", color: "bg-green-100 text-green-700" },
      intermediate: {
        label: "Trung cấp",
        color: "bg-yellow-100 text-yellow-700",
      },
      advanced: { label: "Nâng cao", color: "bg-red-100 text-red-700" },
    };
    return badges[level] || badges.beginner;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Khóa học của tôi
              </h1>
              <p className="mt-2 text-gray-600">
                Quản lý và tiếp tục học tập các khóa học đã đăng ký
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Tổng khóa học</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {courses.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học của chúng
              tôi!
            </p>
            <button
              onClick={() => navigate("/toeic-home/all-course")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const levelBadge = getLevelBadge(course.level);
              const hasDiscount =
                course.discountPrice && course.discountPrice < course.price;

              return (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Course Thumbnail */}
                  <div
                    className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden cursor-pointer"
                    onClick={() => handleStartLearning(course._id)}
                  >
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-20 h-20 text-white opacity-50" />
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${levelBadge.color}`}
                      >
                        {levelBadge.label}
                      </span>
                      {course.type === "pre-recorded" && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white text-gray-700">
                          Tự học
                        </span>
                      )}
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Play
                            className="w-8 h-8 text-indigo-600 ml-1"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                        />
                        <span className="font-semibold text-gray-900">
                          {course.rating?.average?.toFixed(1) || "5.0"}
                        </span>
                        <span>({course.rating?.count || 0})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.studentsCount || 0}</span>
                      </div>
                      {course.preRecordedContent?.totalDuration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {Math.floor(
                              course.preRecordedContent.totalDuration / 60
                            )}
                            h
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Target Score */}
                    {course.targetScoreRange && (
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-gray-700">
                          Mục tiêu:{" "}
                          <span className="font-semibold">
                            {course.targetScoreRange.min} -{" "}
                            {course.targetScoreRange.max} điểm
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Enrollment Info */}
                    <div className="border-t pt-4 mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Đã thanh toán:</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(course.enrollmentInfo.paidAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Ngày đăng ký:</span>
                        <span className="text-gray-900">
                          {formatDate(course.enrollmentInfo.enrolledAt)}
                        </span>
                      </div>
                    </div>

                    {/* Access Duration */}
                    {course.enrollmentInfo.accessDuration && (
                      <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-indigo-700">
                          <Lock className="w-3 h-3 inline mr-1" />
                          Truy cập:{" "}
                          <span className="font-semibold">
                            {course.enrollmentInfo.accessDuration}{" "}
                            {course.enrollmentInfo.accessDurationUnit ===
                            "months"
                              ? "tháng"
                              : "ngày"}
                          </span>
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={() => handleStartLearning(course._id)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 group"
                    >
                      <span>Tiếp tục học</span>
                      <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
