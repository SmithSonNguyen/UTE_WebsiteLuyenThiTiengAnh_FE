import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-2xl">🏆</span>
            <p className="text-lg md:text-xl font-bold text-slate-800">
              Trình độ của bạn hiện tại là:{" "}
              <span className="text-blue-600 uppercase underline decoration-2 decoration-blue-400 tracking-wider">
                {currentUser.level || "newbie"}
              </span>
            </p>
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
