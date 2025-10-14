import React, { useState, useEffect } from "react";
import FixedRegistrationCard from "./FixedRegistrationCard";
import { getCourseReviews } from "@/api/reviewApi";

const CourseDetail = ({ course, isLoading = false }) => {
  const [showRegister, setShowRegister] = useState(false);
  const [activeTab, setActiveTab] = useState("muc-tieu");
  const [expandedTopics, setExpandedTopics] = useState({});

  // Review states
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSort, setCurrentSort] = useState("newest");
  const [hasMore, setHasMore] = useState(true);
  const limit = 2; // Fixed limit per page

  // Fetch reviews function (generic, supports append for load more)
  const fetchReviews = async (
    courseId,
    sort = currentSort,
    page = currentPage,
    append = false
  ) => {
    setLoadingReviews(true);
    try {
      const res = await getCourseReviews(courseId, sort, page, limit);
      setAverageRating(res.average);
      setReviewsCount(res.reviewsCount);
      setRatingDistribution(res.ratingDistribution);
      setHasMore(res.hasMore);

      if (append) {
        // Append new reviews to existing
        setReviews((prev) => [...prev, ...res.reviews]);
      } else {
        // Reset reviews for new sort/page
        setReviews(res.reviews);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Initial fetch when course loads
  useEffect(() => {
    if (course?._id) {
      fetchReviews(course._id);
    }
  }, [course]);

  // Fetch when sort changes (reset page)
  const handleSortChange = (newSort) => {
    setCurrentSort(newSort);
    fetchReviews(course._id, newSort, 1, false); // Reset page, no append
  };

  // Load more handler
  const handleLoadMore = () => {
    if (hasMore && !loadingReviews) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchReviews(course._id, currentSort, nextPage, true); // Append
    }
  };

  // Update tabs label dynamically
  const tabs = [
    { id: "muc-tieu", label: "Mục tiêu khóa học" },
    { id: "thong-tin", label: "Thông tin khóa học" },
    { id: "chuong-trinh", label: "Chương trình học" },
    { id: "danh-gia", label: `Đánh giá (${reviewsCount})` },
  ];

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const features = course?.features || [
    "Đánh cơ bản về mục tiêu đạt điểm TOEIC Speaking - Writing tại mức đầu ra 240-300+",
    "Bài giảng hướng dẫn chi tiết làm đăng câu hỏi TOEIC Speaking- Writing",
    "Làm quen với cấu hình các hội, chủ đề trọng TOEIC Speaking- Writing với hàng trăm",
    "Bài thi mẫu trả lời- nghe- đọc am, đồng thời luyện nghe- viết câu trả lời cho",
    "Bổ sung cập nhật, làm mới nội dung, email, bài luận hiện tại",
  ];

  // Loading state đơn giản
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">
            Đang tải thông tin khóa học...
          </p>
        </div>
      </div>
    );
  }

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
                {course.type === "live-meet"
                  ? "Trực tiếp qua Google Meet"
                  : "Tự học trực tuyến"}
              </span>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                {course.title}
              </h1>

              {/* Rating - Use state values */}
              <div className="flex items-center mb-6">
                <div className="flex items-center text-yellow-400 mr-4">
                  <span className="text-lg font-bold mr-1">
                    {averageRating || course?.rating?.average || 0}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <=
                          Math.floor(
                            averageRating || course?.rating?.average || 0
                          )
                            ? "text-yellow-400"
                            : "text-gray-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white ml-2 text-sm">
                    {`(${
                      reviewsCount || course?.rating?.reviewsCount || 0
                    } Đánh giá)`}
                  </span>
                </div>
                <span className="text-white text-sm">
                  {course.studentsCount} Học viên
                </span>
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

            {activeTab === "thong-tin" &&
              (course.type === "pre-recorded" ? (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Thống kê chung */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          Tổng quan
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Số lượng học viên:
                            </span>
                            <span className="font-medium">
                              {course?.studentsCount || 0} học viên
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tổng chủ đề:</span>
                            <span className="font-medium">
                              {course?.stats?.totalTopics ||
                                course?.preRecordedContent?.totalTopics ||
                                0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tổng bài học:</span>
                            <span className="font-medium">
                              {course?.stats?.totalLessons ||
                                course?.preRecordedContent?.totalLessons ||
                                0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Thời lượng:</span>
                            <span className="font-medium">
                              {course?.stats?.totalHours ||
                                course?.courseStructure?.totalHours ||
                                0}{" "}
                              giờ
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin truy cập */}
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          Quyền truy cập
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Thời hạn:</span>
                            <span className="font-medium">
                              {course?.preRecordedContent?.accessDuration || 12}{" "}
                              {course?.preRecordedContent
                                ?.accessDurationUnit === "months"
                                ? "tháng"
                                : course?.preRecordedContent
                                    ?.accessDurationUnit === "days"
                                ? "ngày"
                                : "năm"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tải về:</span>
                            <span className="font-medium">
                              {course?.preRecordedContent?.downloadable
                                ? "Có"
                                : "Không"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Chứng chỉ:</span>
                            <span className="font-medium">
                              {course?.preRecordedContent?.certificate
                                ? "Có"
                                : "Không"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Xem trước:</span>
                            <span className="font-medium">
                              {course?.stats?.totalPreviewLessons || 0} bài
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bài tập và exercises */}
                  {(course?.preRecordedContent?.totalExercises > 0 ||
                    course?.stats?.totalLessons > 0) && (
                    <div className="mt-6 bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Bài tập & Thực hành
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {course?.preRecordedContent?.totalExercises || 0}
                          </div>
                          <div className="text-gray-600">Bài tập thực hành</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {course?.stats?.totalLessons || 0}
                          </div>
                          <div className="text-gray-600">Video bài giảng</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {course?.stats?.totalPreviewLessons || 0}
                          </div>
                          <div className="text-gray-600">Bài học miễn phí</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-4">
                    Thông tin khóa học trực tiếp
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Chi tiết khóa học
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Số học viên đã đăng ký:
                          </span>
                          <span className="font-medium">
                            {course?.studentsCount || 0} học viên
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Tổng số buổi học:
                          </span>
                          <span className="font-medium">
                            {course?.courseStructure?.totalSessions || 0} buổi
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Thời lượng mỗi buổi:
                          </span>
                          <span className="font-medium">
                            {course?.courseStructure?.hoursPerSession || 0} giờ
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Tổng thời lượng:
                          </span>
                          <span className="font-medium">
                            {course?.courseStructure?.totalHours || 0} giờ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === "chuong-trinh" && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Chương trình học</h3>

                {/* Hiển thị curriculum từ API */}
                {course?.curriculum && course.curriculum.length > 0 ? (
                  <div className="space-y-4">
                    {course.curriculum.map((topic) => (
                      <div
                        key={topic._id}
                        className="border border-gray-200 rounded-lg"
                      >
                        {/* Topic Header */}
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => toggleTopic(topic._id)}
                        >
                          <div className="flex items-center">
                            <svg
                              className={`w-5 h-5 mr-3 transition-transform ${
                                expandedTopics[topic._id] ? "rotate-180" : ""
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                            <span className="font-medium text-gray-900">
                              {topic.title}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {topic.lessons?.length ||
                              topic.stats?.totalLessons ||
                              0}{" "}
                            bài
                          </span>
                        </div>

                        {/* Topic Lessons */}
                        {expandedTopics[topic._id] && topic.lessons && (
                          <div className="border-t border-gray-200 bg-gray-50">
                            {topic.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson._id}
                                className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center">
                                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center mr-3 font-medium">
                                    {lessonIndex + 1}
                                  </span>
                                  <div>
                                    <span className="text-gray-700 font-medium">
                                      {lesson.title}
                                    </span>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        {lesson.description}
                                      </p>
                                    )}
                                    {lesson.duration && (
                                      <span className="text-xs text-gray-400 mt-1 block">
                                        {lesson.duration} phút
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Lock Icon for paid lessons */}
                                {lesson.isLocked && (
                                  <svg
                                    className="w-4 h-4 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Fallback cho course không có curriculum data
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
                )}
              </div>
            )}

            {activeTab === "danh-gia" && (
              <div className="space-y-6">
                {/* Tổng quan đánh giá - Use state values */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Điểm trung bình */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {averageRating || 0}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-6 h-6 ${
                              star <= Math.floor(averageRating || 0)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        {reviewsCount || 0} đánh giá
                      </div>
                    </div>

                    {/* Phân bố đánh giá */}
                    <div className="col-span-2">
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const dist = ratingDistribution.find(
                            (d) => d._id === rating
                          ) || { count: 0 };
                          const percentage =
                            reviewsCount > 0
                              ? (dist.count / reviewsCount) * 100
                              : 0;
                          return (
                            <div key={rating} className="flex items-center">
                              <span className="text-sm text-gray-600 w-8">
                                {rating}★
                              </span>
                              <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">
                                {dist.count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danh sách đánh giá */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Đánh giá chi tiết</h3>
                    <select
                      value={currentSort}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                      <option value="highest">Đánh giá cao nhất</option>
                      <option value="lowest">Đánh giá thấp nhất</option>
                    </select>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border-b border-gray-200 pb-6"
                      >
                        <div className="flex items-start">
                          <div
                            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-4"
                            style={{
                              backgroundColor: review.user.avatar
                                ? ""
                                : "#3b82f6", // Default blue if no avatar
                            }}
                          >
                            {review.user.avatar ? (
                              <img
                                src={review.user.avatar}
                                alt={review.user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              review.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {review.user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString("vi-VN", {
                                    day: "numeric",
                                    month: "short",
                                  })}{" "}
                                  trước
                                </div>
                              </div>
                              {/* Stars dựa trên review.rating */}
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {review.comment}
                            </p>
                            <div className="flex items-center mt-3 text-sm text-gray-500">
                              <button className="flex items-center mr-4 hover:text-blue-600">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L9 17m5-7h4M9 17v1a3 3 0 11-6 0v-5a3 3 0 116 0z"
                                  />
                                </svg>
                                Hữu ích ({review.helpfulCount})
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {loadingReviews && (
                    <div className="text-center py-4">Đang tải...</div>
                  )}

                  {/* Load more button */}
                  {hasMore && (
                    <div className="text-center mt-6">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingReviews}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingReviews ? "Đang tải..." : "Xem thêm đánh giá"}
                      </button>
                    </div>
                  )}
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
