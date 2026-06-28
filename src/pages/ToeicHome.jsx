import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Star, BookOpen, ChevronRight } from "lucide-react";
import Button from "../components/common/Button";
import FaqSectionToeicHome from "../components/layouts/FaqSectionToeicHome";
import CourseCarousel from "../components/course/CourseCarousel";
import { getFeaturedCourses } from "@/api/courseApi";
import { getTodaySchedule } from "@/api/enrollmentApi";
import bannerImage from "@/assets/banner.png";

const ToeicHome = () => {
  const [courses, setCourses] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getFeaturedCourses();
        setCourses(response);
      } catch (error) {
        console.error("Error fetching featured courses:", error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchTodaySchedule = async () => {
      setIsLoadingSchedule(true);
      try {
        const response = await getTodaySchedule(); // Pass studentId nếu API cần
        setTodaySessions(response.sessions || []);
      } catch (error) {
        console.error("Error fetching today's schedule:", error);
        setTodaySessions([]);
      } finally {
        setIsLoadingSchedule(false);
      }
    };
    fetchTodaySchedule();
  }, [currentUser]);

  // Helper: Compute if can join (for makeup only)
  const canJoinSession = (session) => {
    if (session.type !== "makeup") return true; // Regular always enabled

    const now = new Date();
    const [startTimeStr, endTimeStr] = session.time.split(" - "); // "18:00 - 19:30"
    const dateStr = session.date.split("T")[0]; // "2025-11-19"

    // Local datetime for start and end
    const fullStart = new Date(`${dateStr}T${startTimeStr}:00`);
    const fullEnd = new Date(`${dateStr}T${endTimeStr}:00`);
    const thirtyMinBefore = new Date(fullStart.getTime() - 30 * 60 * 1000);

    return now >= thirtyMinBefore && now <= fullEnd;
  };

  const renderHeroSection = () => {
    if (currentUser) {
      const userName = `${currentUser.lastname} ${currentUser.firstname}`;

      if (isLoadingSchedule) {
        return (
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
            <div className="container mx-auto px-6 text-left max-w-7xl relative z-10">
              <h1 className="text-4xl md:text-4xl font-bold mb-10">
                Xin chào, {userName}!
              </h1>
              <h2 className="text-2xl md:text-2xl font-semibold mb-8">
                Lịch học hôm nay ({new Date().toLocaleDateString("vi-VN")})
              </h2>

              <div className="space-y-4 animate-pulse">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex flex-col gap-2"
                  >
                    <div className="h-5 bg-white/30 rounded w-2/3"></div>
                    <div className="h-4 bg-white/30 rounded w-1/3"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      } else if (todaySessions.length === 0) {
        return (
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
            <div className="container mx-auto px-6 text-left max-w-7xl relative z-10">
              <h1 className="text-4xl md:text-4xl font-bold mb-10">
                Xin chào, {userName}!
              </h1>
              <h2 className="text-2xl md:text-2xl font-semibold mb-4">
                Lịch học hôm nay ({new Date().toLocaleDateString("vi-VN")})
              </h2>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Bạn không có lịch học hôm nay.
              </p>
            </div>
          </section>
        );
      } else {
        return (
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
            <div className="container mx-auto px-6 text-left max-w-7xl relative z-10">
              <h1 className="text-4xl md:text-4xl font-bold mb-10 drop-shadow-lg">
                Xin chào, {userName}!
              </h1>
              <h2 className="text-2xl md:text-2xl font-semibold mb-4 drop-shadow-lg">
                Lịch học hôm nay ({new Date().toLocaleDateString("vi-VN")})
              </h2>
              <div className="space-y-4 mb-8">
                {todaySessions.map((session) => {
                  const canJoin = canJoinSession(session);
                  const buttonClass = canJoin
                    ? "bg-green-400 text-black hover:bg-green-500"
                    : "bg-gray-500 text-white cursor-not-allowed";

                  return (
                    <div
                      key={session.classId + session.sessionNumber} // Unique key
                      className="relative bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all"
                    >
                      {/* Badge cho buổi bù: Vị trí top-right */}
                      {session.type === "makeup" && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400 text-black">
                            Buổi bù
                          </span>
                        </div>
                      )}
                      <div className="">
                        {" "}
                        {/* Padding-top để tránh overlap badge */}
                        <p className="text-lg font-semibold">
                          {session.courseTitle}
                        </p>
                        <p className="text-sm text-blue-100">
                          {`Giảng viên ${session.instructor.profile.lastname} ${session.instructor.profile.firstname}`}
                        </p>
                        <p className="text-sm">{session.time}</p>
                        <button
                          onClick={
                            canJoin
                              ? () => window.open(session.meetLink, "_blank")
                              : undefined
                          }
                          disabled={!canJoin}
                          className={`mt-2 px-4 py-2 rounded text-sm font-semibold transition-colors ${buttonClass}`}
                        >
                          Tham gia ngay
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      }
    } else {
      // Hero mặc định khi chưa đăng nhập - với banner
      return (
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-32 md:py-40 lg:py-48 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src={bannerImage}
              alt="TOEIC Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 backdrop-blur-sm"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-6 text-center relative z-10 max-w-7xl">
            {/* Tiêu đề chính - TO, SANG, HIỆN ĐẠI */}
            <h1
              className="
      text-5xl sm:text-6xl md:text-7xl lg:text-8xl 
      font-bold 
      mb-6 
      leading-tight 
      tracking-tight 
      drop-shadow-2xl 
      bg-clip-text text-transparent 
      bg-gradient-to-r from-white to-yellow-200
      animate-fade-in
    "
              style={{ fontFamily: '"Poppins", "Montserrat", sans-serif' }}
            >
              Luyện Thi TOEIC Online Cùng DTT
            </h1>

            {/* Mô tả - RÕ RÀNG, DỄ ĐỌC */}
            <p
              className="
      text-lg sm:text-xl md:text-2xl lg:text-3xl 
      mb-10 
      font-medium 
      leading-relaxed 
      drop-shadow-lg 
      max-w-4xl mx-auto 
      text-blue-50
    "
              style={{
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
              }}
            >
              Nền tảng học DTT thông minh – cá nhân hóa lộ trình, rút ngắn thời
              gian ôn luyện.
            </p>

            {/* Nút CTA */}
            <Button
              size="lg"
              className="
        bg-yellow-400 text-black font-bold 
        hover:bg-yellow-300 
        transition-all duration-300 
        shadow-2xl 
        text-lg px-10 py-4 
        transform hover:scale-105
        rounded-full
      "
              onClick={() => navigate("/classes/register")} // Thêm navigation
            >
              Đăng ký ngay
            </Button>
          </div>
        </section>
      );
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      {renderHeroSection()}

      {/* Current Level Display */}
      {currentUser && (
        <div className="container mx-auto px-6 max-w-7xl pt-8 pb-2 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-6 py-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-lg md:text-xl font-bold text-slate-800">
                  Trình độ của bạn hiện tại là:{" "}
                  <span className="text-blue-600 uppercase underline decoration-2 decoration-blue-400 tracking-wider font-extrabold">
                    {currentUser.level || "newbie"}
                  </span>
                </p>
                {(!currentUser.level || currentUser.level === "newbie") && (
                  <p className="text-sm text-gray-500 mt-1">
                    Hãy làm bài kiểm tra đầu vào để nhận lộ trình học và đề xuất khóa học phù hợp nhất!
                  </p>
                )}
              </div>
            </div>
            {(!currentUser.level || currentUser.level === "newbie") && (
              <button
                onClick={() => navigate("/toeic-home/free-entry-test")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Kiểm tra đầu vào ngay</span>
                <span>➔</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Recommended Courses (For users with level) */}
      {currentUser && currentUser.level && currentUser.level !== "newbie" && (
        <div className="container mx-auto px-6 max-w-7xl pt-8 pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                🎓
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Khóa học phù hợp với trình độ của bạn
                </h3>
                <p className="text-gray-600">
                  Dựa trên trình độ hiện tại của bạn: <span className="font-semibold uppercase text-blue-600">{currentUser.level}</span>
                </p>
              </div>
            </div>

            {/* Recommended courses display (Grouped into columns) */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Cột Live Courses */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-indigo-900 border-b pb-2 flex items-center gap-2">
                  <span>👩‍🏫</span> Khóa Live (live-meet)
                </h4>
                {courses.filter(c => c.level === currentUser.level && c.type === "live-meet").length > 0 ? (
                  courses.filter(c => c.level === currentUser.level && c.type === "live-meet").map((course) => (
                    <div
                      key={course._id}
                      className="border-2 border-indigo-200 hover:border-indigo-400 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <span className="inline-block px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full mb-2">
                            Học trực tuyến Live-Meet
                          </span>
                          <h4 className="font-bold text-base text-gray-800 mb-2">
                            {course.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
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

                      <div className="flex items-center gap-4 mb-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-gray-700">
                            {course.rating?.average || 5}
                          </span>
                          <span className="text-gray-500">
                            ({course.rating?.reviewsCount || 0})
                          </span>
                        </div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          {course.studentsCount || 0} học viên
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          {course.discountPrice &&
                          course.discountPrice < course.price ? (
                            <div>
                              <span className="text-xs text-gray-500 line-through mr-2">
                                {formatPrice(course.price)}
                              </span>
                              <span className="text-base font-bold text-indigo-600">
                                {formatPrice(course.discountPrice)}
                              </span>
                              <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded">
                                -{course.discountPercent}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-base font-bold text-gray-800">
                              {formatPrice(course.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            navigate(`/toeic-home/course/${course._id}`);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-xs"
                        >
                          Xem chi tiết
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {course.targetScoreRange && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                          <p className="text-gray-600">
                            <span className="font-semibold">Mục tiêu điểm:</span>{" "}
                            {course.targetScoreRange.min} - {course.targetScoreRange.max}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-gray-500 py-6 bg-gray-50 rounded-xl border border-dashed">
                    Không có khóa học Live phù hợp với trình độ của bạn.
                  </p>
                )}
              </div>

              {/* Cột Video Courses */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg text-emerald-900 border-b pb-2 flex items-center gap-2">
                  <span>📹</span> Khóa Video (pre-recorded)
                </h4>
                {courses.filter(c => c.level === currentUser.level && c.type === "pre-recorded").length > 0 ? (
                  courses.filter(c => c.level === currentUser.level && c.type === "pre-recorded").map((course) => (
                    <div
                      key={course._id}
                      className="border-2 border-emerald-200 hover:border-emerald-400 rounded-xl p-6 hover:shadow-lg transition-all duration-300 bg-white"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full mb-2">
                            Khóa học Video thu sẵn
                          </span>
                          <h4 className="font-bold text-base text-gray-800 mb-2">
                            {course.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
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

                      <div className="flex items-center gap-4 mb-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold text-gray-700">
                            {course.rating?.average || 5}
                          </span>
                          <span className="text-gray-500">
                            ({course.rating?.reviewsCount || 0})
                          </span>
                        </div>
                        <div className="text-gray-600 flex items-center gap-1">
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          {course.studentsCount || 0} học viên
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          {course.discountPrice &&
                          course.discountPrice < course.price ? (
                            <div>
                              <span className="text-xs text-gray-500 line-through mr-2">
                                {formatPrice(course.price)}
                              </span>
                              <span className="text-base font-bold text-emerald-600">
                                {formatPrice(course.discountPrice)}
                              </span>
                              <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded">
                                -{course.discountPercent}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-base font-bold text-gray-800">
                              {formatPrice(course.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            navigate(`/toeic-home/course/${course._id}`);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium text-xs"
                        >
                          Xem chi tiết
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {course.targetScoreRange && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                          <p className="text-gray-600">
                            <span className="font-semibold">Mục tiêu điểm:</span>{" "}
                            {course.targetScoreRange.min} - {course.targetScoreRange.max}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-gray-500 py-6 bg-gray-50 rounded-xl border border-dashed">
                    Không có khóa học Video phù hợp với trình độ của bạn.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      <CourseCarousel courses={courses} title="Các Khóa Học TOEIC Nổi Bật" />

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vì Sao Chọn DTT TOEIC?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">
                Lộ trình cá nhân hóa
              </h3>
              <p className="text-gray-600">
                Xây dựng kế hoạch học tập phù hợp từng học viên.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Theo dõi tiến độ</h3>
              <p className="text-gray-600">
                Báo cáo chi tiết, theo sát hành trình học TOEIC của bạn.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">👩‍🏫</div>
              <h3 className="text-xl font-semibold mb-2">
                Giảng viên chất lượng
              </h3>
              <p className="text-gray-600">
                Đội ngũ thầy cô giàu kinh nghiệm, hỗ trợ nhiệt tình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16">
        <FaqSectionToeicHome />
      </section>

      {/* Call To Action */}
      <section className="bg-indigo-600 text-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sẵn sàng chinh phục TOEIC?
        </h2>
        <p className="mb-8">
          Hàng nghìn học viên đã đạt mục tiêu cùng DTT. Bạn đã sẵn sàng chưa?
        </p>
        <Button
          size="lg"
          className="bg-yellow-400 text-black font-semibold"
          onClick={() => navigate("/classes/register")} // Thêm navigation
        >
          Đăng ký ngay
        </Button>
      </section>
    </div>
  );
};

export default ToeicHome;
