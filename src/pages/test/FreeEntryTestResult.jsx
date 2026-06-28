import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  TrendingUp,
  ChevronRight,
  Star,
  X,
} from "lucide-react";

const FreeEntryTestResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);

  useEffect(() => {
    const fetchCoursesAndSetResult = async () => {
      // Lấy dữ liệu từ state hoặc sessionStorage
      const stateData = location.state;
      let data = null;

      if (stateData) {
        data = stateData;
      } else {
        // Fallback: đọc từ sessionStorage
        try {
          const stored = sessionStorage.getItem("toeic_result_ETS-2024-01");
          if (stored) {
            data = JSON.parse(stored);
          } else {
            // Không có dữ liệu
            navigate("/toeic-home/free-entry-test");
            return;
          }
        } catch (err) {
          console.error("Error loading result:", err);
          navigate("/toeic-home/free-entry-test");
          return;
        }
      }

      // Fetch courses từ API và filter theo điểm số
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/courses/featured`);
        const courses = await response.json();

        // Filter courses dựa trên điểm số của user
        const userScore = data.summary.totalScore;
        const recommendedCourses = courses.filter((course) => {
          if (course.targetScoreRange) {
            return (
              userScore >= course.targetScoreRange.min &&
              userScore <= course.targetScoreRange.max
            );
          }
          return false;
        });

        // Thêm recommended courses vào data
        data.recommendedCourses = recommendedCourses;
      } catch (err) {
        console.error("Error fetching courses:", err);
        // Nếu API lỗi, vẫn hiển thị kết quả nhưng không có recommended courses
        data.recommendedCourses = [];
      }

      setResultData(data);
    };

    fetchCoursesAndSetResult();
  }, [location, navigate]);

  if (!resultData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4">
            ⏳
          </div>
          <p className="text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  const { summary, detailedAnswers, recommendedCourses } = resultData;
  const {
    listeningCorrect,
    readingCorrect,
    listeningScore,
    readingScore,
    totalScore,
  } = summary;

  // Lọc khóa học theo loại
  const liveMeetCourses = (recommendedCourses || []).filter(c => c.type === "live-meet");
  const preRecordedCourses = (recommendedCourses || []).filter(c => c.type === "pre-recorded");

  // Đánh giá trình độ dựa trên điểm số
  const getScoreLevel = (score) => {
    if (score >= 945)
      return {
        label: "Xuất sắc",
        color: "text-purple-600",
        bg: "bg-purple-50",
      };
    if (score >= 785)
      return { label: "Rất tốt", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 605)
      return { label: "Khá", color: "text-blue-600", bg: "bg-blue-50" };
    if (score >= 405)
      return {
        label: "Trung bình",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    return {
      label: "Cần cải thiện",
      color: "text-orange-600",
      bg: "bg-orange-50",
    };
  };

  const level = getScoreLevel(totalScore);

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Kết quả bài thi</h1>
          <button
            onClick={() => navigate("/toeic-home")}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Về trang chủ
          </button>
        </div>
      </div>

      {/* Course Modal Popup */}
      {showCourseModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCourseModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Khóa học phù hợp với bạn
                  </h3>
                  <p className="text-gray-600">
                    Dựa trên điểm số của bạn ({totalScore} điểm)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCourseModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 py-6">
              {recommendedCourses && recommendedCourses.length > 0 ? (
                <div className="space-y-6">
                  {/* Bảng so sánh lợi ích - Hàng đầu tiên (Stretch để bằng chiều cao) */}
                  <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Bảng lợi ích khóa Live */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">👩‍🏫</span>
                          <h4 className="font-bold text-lg text-indigo-900">
                            Khóa Live (live-meet)
                          </h4>
                        </div>
                        <p className="text-sm text-indigo-950/70 mb-4 font-medium">
                          Học trực tuyến trực tiếp tương tác 2 chiều với giảng viên.
                        </p>
                        <ul className="space-y-2.5 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✔</span>
                            <span>Được học trực tiếp trực tuyến với giảng viên qua phòng Meet.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✔</span>
                            <span>Được trò chuyện, trao đổi và được giảng viên trực tiếp giải đáp thắc mắc tận tình.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✔</span>
                            <span>Được cung cấp tài liệu đầy đủ sau mỗi buổi học.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✔</span>
                            <span>Linh hoạt: có thể được học bù tối đa 3 buổi nghỉ.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✔</span>
                            <span>Bài kiểm tra năng lực cuối khoá để đánh giá chuẩn xác sự tiến bộ.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Bảng lợi ích khóa Video */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">📹</span>
                          <h4 className="font-bold text-lg text-emerald-950">
                            Khóa Video (pre-recorded)
                          </h4>
                        </div>
                        <p className="text-sm text-emerald-950/70 mb-4 font-medium">
                          Học chủ động, linh hoạt mọi lúc mọi nơi theo lịch trình cá nhân.
                        </p>
                        <ul className="space-y-2.5 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✔</span>
                            <span>Được tự do học tập chủ động 24/7 mọi lúc mọi nơi.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✔</span>
                            <span>Các video bài giảng chất lượng cao có thể xem lại nhiều lần để nắm chắc kiến thức.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✔</span>
                            <span>Hệ thống bài tập thực hành phong phú ngay sau khi hoàn thành từng video bài học.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold">✔</span>
                            <span>Bài kiểm tra năng lực cuối khoá để hệ thống hóa kiến thức.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Danh sách Khóa học - Hàng thứ hai */}
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Cột Live Courses */}
                    <div className="space-y-4">
                      {liveMeetCourses.length > 0 ? (
                        liveMeetCourses.map((course) => (
                          <div
                            key={course._id}
                            className="border-2 border-indigo-200 hover:border-indigo-400 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-2">
                                  Học trực tuyến Live-Meet
                                </span>
                                <h4 className="font-bold text-lg text-gray-800 mb-2">
                                  {course.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {course.description}
                                </p>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 whitespace-nowrap ${
                                  course.level === "beginner"
                                    ? "bg-green-100 text-green-700"
                                    : course.level === "intermediate"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {course.level === "beginner"
                                  ? "Cơ bản"
                                  : course.level === "intermediate"
                                  ? "Trung cấp"
                                  : "Nâng cao"}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold text-gray-700">
                                  {course.rating?.average || 5}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({course.rating?.reviewsCount || 0})
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <BookOpen className="w-4 h-4 inline mr-1" />
                                {course.studentsCount || 0} học viên
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div>
                                {course.discountPrice &&
                                course.discountPrice < course.price ? (
                                  <div>
                                    <span className="text-sm text-gray-500 line-through mr-2">
                                      {formatPrice(course.price)}
                                    </span>
                                    <span className="text-xl font-bold text-indigo-600">
                                      {formatPrice(course.discountPrice)}
                                    </span>
                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                                      -{course.discountPercent}%
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xl font-bold text-gray-800">
                                    {formatPrice(course.price)}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setShowCourseModal(false);
                                  navigate(`/toeic-home/course/${course._id}`);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm"
                              >
                                Xem chi tiết
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {course.targetScoreRange && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Mục tiêu điểm:</span>{" "}
                                  {course.targetScoreRange.min} - {course.targetScoreRange.max}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm text-gray-500 py-6 bg-gray-50 rounded-xl border border-dashed">
                          Không có khóa học Live phù hợp với điểm của bạn.
                        </p>
                      )}
                    </div>

                    {/* Cột Video Courses */}
                    <div className="space-y-4">
                      {preRecordedCourses.length > 0 ? (
                        preRecordedCourses.map((course) => (
                          <div
                            key={course._id}
                            className="border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full mb-2">
                                  Khóa học Video thu sẵn
                                </span>
                                <h4 className="font-bold text-lg text-gray-800 mb-2">
                                  {course.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                  {course.description}
                                </p>
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-xs font-semibold ml-2 whitespace-nowrap ${
                                  course.level === "beginner"
                                    ? "bg-green-100 text-green-700"
                                    : course.level === "intermediate"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {course.level === "beginner"
                                  ? "Cơ bản"
                                  : course.level === "intermediate"
                                  ? "Trung cấp"
                                  : "Nâng cao"}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold text-gray-700">
                                  {course.rating?.average || 5}
                                </span>
                                <span className="text-sm text-gray-500">
                                  ({course.rating?.reviewsCount || 0})
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <BookOpen className="w-4 h-4 inline mr-1" />
                                {course.studentsCount || 0} học viên
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                              <div>
                                {course.discountPrice &&
                                course.discountPrice < course.price ? (
                                  <div>
                                    <span className="text-sm text-gray-500 line-through mr-2">
                                      {formatPrice(course.price)}
                                    </span>
                                    <span className="text-xl font-bold text-emerald-600">
                                      {formatPrice(course.discountPrice)}
                                    </span>
                                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                                      -{course.discountPercent}%
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xl font-bold text-gray-800">
                                    {formatPrice(course.price)}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setShowCourseModal(false);
                                  navigate(`/toeic-home/course/${course._id}`);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-sm"
                              >
                                Xem chi tiết
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            {course.targetScoreRange && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">Mục tiêu điểm:</span>{" "}
                                  {course.targetScoreRange.min} - {course.targetScoreRange.max}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-sm text-gray-500 py-6 bg-gray-50 rounded-xl border border-dashed">
                          Không có khóa học Video phù hợp với điểm của bạn.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
                  </div>
                  <p className="text-gray-500 text-lg mb-2">
                    Hiện tại chưa có khóa học phù hợp với điểm số của bạn.
                  </p>
                  <p className="text-gray-400 text-sm mb-6">
                    Hãy khám phá tất cả các khóa học của chúng tôi
                  </p>
                  <button
                    onClick={() => {
                      setShowCourseModal(false);
                      navigate("/toeic-home/courses");
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Xem tất cả khóa học
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Score Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Chúc mừng bạn đã hoàn thành bài thi!
            </h2>
            <div
              className={`inline-block px-6 py-2 rounded-full ${level.bg} ${level.color} font-semibold text-lg`}
            >
              {level.label}
            </div>
            <p className="text-xl text-blue-600 font-semibold mt-4">
              Trình độ hiện tại của bạn là <span className="underline uppercase tracking-wide">{totalScore >= 650 ? "advanced" : totalScore >= 450 ? "intermediate" : "beginner"}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Total Score */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
              <p className="text-gray-600 font-medium mb-2">Tổng điểm</p>
              <p className="text-5xl font-bold text-blue-600 mb-1">
                {totalScore}
              </p>
              <p className="text-sm text-gray-500">/ 990</p>
            </div>

            {/* Listening Score */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
              <p className="text-gray-600 font-medium mb-2">Listening</p>
              <p className="text-4xl font-bold text-green-600 mb-1">
                {listeningScore}
              </p>
              <p className="text-sm text-gray-500">
                {listeningCorrect}/100 câu đúng
              </p>
            </div>

            {/* Reading Score */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
              <p className="text-gray-600 font-medium mb-2">Reading</p>
              <p className="text-4xl font-bold text-purple-600 mb-1">
                {readingScore}
              </p>
              <p className="text-sm text-gray-500">
                {readingCorrect}/100 câu đúng
              </p>
            </div>
          </div>

          {/* Progress bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  Listening Progress
                </span>
                <span className="text-green-600 font-semibold">
                  {listeningCorrect}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${listeningCorrect}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">
                  Reading Progress
                </span>
                <span className="text-purple-600 font-semibold">
                  {readingCorrect}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${readingCorrect}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Chi tiết đáp án
          </h3>

          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7].map((part) => {
              const partAnswers = detailedAnswers.filter(
                (a) => a.part === part
              );
              if (partAnswers.length === 0) return null;

              const partCorrect = partAnswers.filter((a) => a.isCorrect).length;
              const partTotal = partAnswers.length;

              return (
                <div
                  key={part}
                  className="border border-gray-200 rounded-xl p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-gray-800">
                      Part {part}
                    </h4>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold ${
                        partCorrect === partTotal
                          ? "bg-green-100 text-green-700"
                          : partCorrect >= partTotal * 0.7
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {partCorrect}/{partTotal} câu đúng
                    </span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2">
                    {partAnswers.map((answer) => (
                      <div
                        key={answer.number}
                        className={`relative p-2 rounded-lg text-center font-semibold text-sm ${
                          answer.isCorrect
                            ? "bg-green-500 text-white"
                            : answer.userAnswer
                            ? "bg-red-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                        title={`Câu ${answer.number}: Bạn chọn ${
                          answer.userAnswer || "không trả lời"
                        } - Đáp án: ${answer.correctAnswer}`}
                      >
                        {answer.number}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Chú thích:
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded"></div>
                <span className="text-gray-600">Trả lời đúng</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-500 rounded"></div>
                <span className="text-gray-600">Trả lời sai</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <span className="text-gray-600">Chưa trả lời</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowCourseModal(true)}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Xem khóa học phù hợp với bạn
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeEntryTestResult;
