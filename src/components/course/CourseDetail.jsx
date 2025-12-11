import React, { useState, useEffect } from "react";
import FixedRegistrationCard from "./FixedRegistrationCard";
import { getCourseReviews } from "@/api/reviewApi";
import { getUpcomingClassesByCourse } from "@/api/classApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createPayment } from "@/api/paymentApi"; // Import payment API
import { toast } from "react-hot-toast";

const CourseDetail = ({ course, isLoading = false }) => {
  const navigate = useNavigate();
  // const [showRegister, setShowRegister] = useState(false);
  const accessTokenFromRedux = useSelector(
    (state) => state?.auth?.login?.accessToken
  );
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

  // 🆕 Payment states
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Class schedule states for live-meet courses
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  /**
   * 🆕 Handle enrollment payment
   * @param {Object} classItem - Class data từ API
   */
  const handleTryForFree = () => {
    // Check nếu là khóa TOEIC Beginner Essentials
    if (course.title === "TOEIC Beginner Essentials") {
      navigate("/toeic-home/free-video-course/");
    } else {
      // Các khóa khác: chuyển đến trang preview hoặc first lesson
      if (course?.curriculum?.[0]?.lessons?.[0]) {
        const firstLesson = course.curriculum[0].lessons[0];
        navigate(`/courses/${course._id}/lessons/${firstLesson._id}`);
      } else {
        toast.info("Khóa học này chưa có bài học dùng thử");
      }
    }
  };
  const handleEnrollClass = async (classItem) => {
    try {
      // 1. Kiểm tra user đã đăng nhập chưa
      const accessToken =
        accessTokenFromRedux || localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
        // Redirect to login page
        navigate("/login", {
          state: {
            from: `/courses/${course._id}`,
            message: "Vui lòng đăng nhập để đăng ký khóa học",
          },
        });
        return;
      }

      // 2. Validate class data
      if (!classItem?._id) {
        toast.error("Thông tin lớp học không hợp lệ");
        return;
      }

      // 3. Check if class is full
      if (
        classItem.capacity.currentStudents >= classItem.capacity.maxStudents
      ) {
        toast.error("Lớp học đã đầy. Vui lòng chọn lớp khác.");
        return;
      }

      // 4. Check if class has started
      const now = new Date();
      const startDate = new Date(classItem.schedule.startDate);
      if (now > startDate) {
        toast(
          "Lớp học đã bắt đầu. Tiếp tục chuyển đến thanh toán theo yêu cầu."
        );
      }

      setProcessingPayment(true);
      setSelectedClassId(classItem._id);

      // 5. Prepare payment data
      const paymentData = {
        classId: classItem._id,
        courseId: course._id,
        amount: course.discountPrice || course.price, // Số tiền VND
        orderInfo: `Thanh toán lớp ${classItem.classCode} - ${course.title}`,
      };

      console.log("💳 Creating payment:", paymentData);

      // 6. Call payment API
      const result = await createPayment(paymentData);

      console.log("✅ Payment created:", result);

      // 7. Redirect to VNPay
      if (result.vnpayUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");

        // Lưu thông tin để quay lại sau khi thanh toán
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            paymentId: result.paymentId,
            classId: classItem._id,
            courseId: course._id,
            classCode: classItem.classCode,
            timestamp: Date.now(),
          })
        );

        // Redirect to VNPay
        window.location.href = result.vnpayUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (error) {
      console.error("❌ Enrollment error:", error);

      // Handle specific errors
      if (error.message?.includes("đã đăng ký")) {
        toast.error("Bạn đã đăng ký lớp học này rồi");
      } else if (error.message?.includes("đã đầy")) {
        toast.error("Lớp học đã đầy");
      } else if (error.message?.includes("Unauthorized")) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        toast.error(error.message || "Có lỗi xảy ra khi tạo thanh toán");
      }
    } finally {
      setProcessingPayment(false);
      setSelectedClassId(null);
    }
  };

  /**
   * 🆕 Handle pre-recorded course enrollment
   */
  const handleEnrollCourse = async (course) => {
    try {
      // 1. Kiểm tra user đã đăng nhập chưa
      const accessToken =
        accessTokenFromRedux || localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Vui lòng đăng nhập để đăng ký khóa học");
        // Redirect to login page
        navigate("/login", {
          state: {
            from: `/courses/${course._id}`,
            message: "Vui lòng đăng nhập để đăng ký khóa học",
          },
        });
        return;
      }

      setProcessingPayment(true);

      const paymentData = {
        courseId: course._id,
        amount: course.discountPrice || course.price,
        orderInfo: `Thanh toán khóa học ${course.title}`,
      };

      console.log("💳 Creating payment:", paymentData);

      const result = await createPayment(paymentData);

      if (result.vnpayUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");

        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            paymentId: result.paymentId,
            courseId: course._id,
            timestamp: Date.now(),
          })
        );

        window.location.href = result.vnpayUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (error) {
      console.error("❌ Enrollment error:", error);

      if (error.message?.includes("Unauthorized")) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        toast.error(error.message || "Có lỗi xảy ra khi tạo thanh toán");
      }
    } finally {
      setProcessingPayment(false);
    }
  };

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

  // Fetch upcoming classes for live-meet courses
  const fetchClasses = async (courseId) => {
    if (!courseId) return;

    setLoadingClasses(true);
    try {
      const response = await getUpcomingClassesByCourse(courseId);
      setClasses(response.classes || []);
    } catch (error) {
      console.error("Error fetching upcoming classes:", error);
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Initial fetch when course loads
  useEffect(() => {
    if (course?._id) {
      fetchReviews(course._id);
      // Fetch classes if it's a live-meet course
      if (course.type === "live-meet") {
        fetchClasses(course._id);
      }
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
    { id: "muc-tieu", label: "Lợi ích khóa học" },
    { id: "thong-tin", label: "Thông tin khóa học" },
    {
      id: "chuong-trinh",
      label:
        course?.type === "live-meet" ? "Lịch khai giảng" : "Chương trình học",
    },
    { id: "danh-gia", label: `Đánh giá (${reviewsCount})` },
  ];

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

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
                {course?.features.map((feature, idx) => (
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
                <h3 className="text-xl font-bold mb-4">Lợi ích khóa học</h3>
                <ul className="space-y-3">
                  {course?.features.map((feature, idx) => (
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
                  <h3 className="text-xl font-bold mb-4">Thông tin khóa học</h3>
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
              <div className="bg-white rounded-lg shadow-sm">
                {course?.type === "live-meet" ? (
                  // Lịch khai giảng cho live-meet course
                  <div>
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 text-center text-lg font-semibold">
                      Lịch khai giảng
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Level
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Lớp
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Thời gian học
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Lịch Khai giảng
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700">
                              Đăng ký
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {loadingClasses ? (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-4 py-8 text-center text-gray-500"
                              >
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                  <span>Đang tải lịch khai giảng...</span>
                                </div>
                              </td>
                            </tr>
                          ) : classes.length > 0 ? (
                            classes.map((classItem, index) => {
                              const isProcessing =
                                processingPayment &&
                                selectedClassId === classItem._id;
                              const isFull =
                                classItem.capacity.currentStudents >=
                                classItem.capacity.maxStudents;
                              const hasStarted =
                                new Date() >
                                new Date(classItem.schedule.startDate);
                              return (
                                <tr
                                  key={classItem._id || index}
                                  className={
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="px-4 py-4">
                                    <span className="text-blue-600 font-medium">
                                      {course.level === "beginner" &&
                                        "Level Pre (0-450)"}
                                      {course.level === "intermediate" &&
                                        "Level A (450-650)"}
                                      {course.level === "advanced" &&
                                        "Level B (650-800)"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 font-medium text-gray-900">
                                    {classItem.classCode}
                                    <div className="text-xs text-gray-500 mt-1">
                                      {classItem.capacity.currentStudents}/
                                      {classItem.capacity.maxStudents} học viên
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-gray-700">
                                    <div>
                                      {classItem.schedule?.daysVN
                                        ? classItem.schedule.daysVN.join(", ")
                                        : classItem.schedule?.days
                                            ?.map((day) => {
                                              const dayMap = {
                                                Monday: "Thứ 2",
                                                Tuesday: "Thứ 3",
                                                Wednesday: "Thứ 4",
                                                Thursday: "Thứ 5",
                                                Friday: "Thứ 6",
                                                Saturday: "Thứ 7",
                                                Sunday: "Chủ nhật",
                                              };
                                              return dayMap[day];
                                            })
                                            .join(", ")}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {`${classItem.schedule?.startTime} - ${classItem.schedule?.endTime}`}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-gray-700">
                                    {classItem.schedule?.startDate &&
                                      new Date(
                                        classItem.schedule.startDate
                                      ).toLocaleDateString("vi-VN")}
                                  </td>
                                  <td className="px-4 py-4">
                                    {/* 🆕 Updated button with payment logic */}
                                    <button
                                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                                        isFull || isProcessing
                                          ? "bg-gray-400 cursor-not-allowed"
                                          : "bg-red-600 hover:bg-red-700 text-white"
                                      }`}
                                      onClick={() =>
                                        handleEnrollClass(classItem)
                                      }
                                      disabled={isFull || isProcessing}
                                    >
                                      {isProcessing ? (
                                        <span className="flex items-center">
                                          <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                          >
                                            <circle
                                              className="opacity-25"
                                              cx="12"
                                              cy="12"
                                              r="10"
                                              stroke="currentColor"
                                              strokeWidth="4"
                                            ></circle>
                                            <path
                                              className="opacity-75"
                                              fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                          </svg>
                                          Đang xử lý...
                                        </span>
                                      ) : isFull ? (
                                        "Đã đầy"
                                      ) : hasStarted ? (
                                        "Đăng ký (đã bắt đầu)"
                                      ) : (
                                        "Đăng ký"
                                      )}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td
                                colSpan="5"
                                className="px-4 py-8 text-center text-gray-500"
                              >
                                Hiện tại chưa có lịch khai giảng cho khóa học
                                này
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  // Chương trình học cho pre-recorded course
                  <div className="p-6">
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
                                    expandedTopics[topic._id]
                                      ? "rotate-180"
                                      : ""
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
                                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z"
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
        {/* Cột phải: Sidebar cố định - Chỉ hiện lg+ */}
        <div className="hidden lg:block col-span-1">
          <div className="h-screen sticky top-0">
            {" "}
            {/* pt-4 để align với content */}
            <FixedRegistrationCard
              course={course}
              onRegister={async () => {
                console.log("🎯 FixedRegistrationCard onRegister triggered");
                console.log("🎯 Course type:", course?.type);
                console.log(
                  "🎯 handleEnrollCourse exists?",
                  typeof handleEnrollCourse
                );

                if (course?.type === "pre-recorded") {
                  console.log("🎯 About to call handleEnrollCourse");
                  try {
                    await handleEnrollCourse(course);
                    console.log("🎯 handleEnrollCourse called successfully");
                  } catch (err) {
                    console.error("🎯 Error calling handleEnrollCourse:", err);
                  }
                } else {
                  // For live-meet, scroll to schedule
                  setActiveTab("chuong-trinh");
                  setTimeout(() => {
                    const table = document.querySelector(
                      "[data-schedule-table]"
                    );
                    if (table) {
                      table.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }, 100);
                }
              }}
              onTryForFree={handleTryForFree}
              isProcessing={processingPayment}
            />
          </div>
        </div>
      </div>

      {/* Mobile Registration - Fixed */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[9999] p-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log("📱 Mobile button clicked");
            console.log("📱 Course type:", course?.type);
            console.log("📱 Processing:", processingPayment);

            if (processingPayment) {
              console.log("⏸️ Already processing, ignoring click");
              return;
            }

            if (course?.type === "pre-recorded") {
              console.log(
                "🎥 Pre-recorded course - calling handleEnrollCourse"
              );
              handleEnrollCourse();
            } else {
              console.log("📅 Live-meet course - scrolling to schedule");
              setActiveTab("chuong-trinh");
              setTimeout(() => {
                const table = document.querySelector("[data-schedule-table]");
                if (table) {
                  table.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }, 100);
            }
          }}
          disabled={processingPayment}
          className={`w-full py-3 rounded-lg font-bold text-base transition-colors ${
            processingPayment
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {processingPayment ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </span>
          ) : (
            `ĐĂNG KÝ HỌC NGAY - ${(
              course?.discountPrice ||
              course?.price ||
              989000
            ).toLocaleString()}đ`
          )}
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
