import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import FaqSectionToeicHome from "../components/layouts/FaqSectionToeicHome";
import CourseCarousel from "../components/course/CourseCarousel";
import { getFeaturedCourses } from "@/api/courseApi";
import { getMySchedule } from "@/api/enrollmentApi"; // Import API để lấy enrollments

const ToeicHome = () => {
  const [courses, setCourses] = useState([]);
  const [todaySessions, setTodaySessions] = useState([]); // Lịch hôm nay
  const [enrollments, setEnrollments] = useState([]); // Từ API
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false); // State loading cho lịch
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

  // Fetch lịch học hôm nay nếu đã đăng nhập
  useEffect(() => {
    if (!currentUser) return;

    const fetchTodaySchedule = async () => {
      setIsLoadingSchedule(true);
      try {
        const enrollments = await getMySchedule();
        const todaySessions = generateTodaySessions(enrollments);
        setTodaySessions(todaySessions);
        setEnrollments(enrollments); // Lưu enrollments vào state
      } catch (error) {
        console.error("Error fetching today's schedule:", error);
      } finally {
        setIsLoadingSchedule(false);
      }
    };
    fetchTodaySchedule();
  }, [currentUser]);

  // Function để generate chỉ sessions hôm nay (tái sử dụng logic từ MySchedulePage)
  const generateTodaySessions = (enrollments) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Chỉ ngày hôm nay (00:00)

    const sessions = [];

    const dayMap = {
      Monday: "Thứ 2",
      Tuesday: "Thứ 3",
      Wednesday: "Thứ 4",
      Thursday: "Thứ 5",
      Friday: "Thứ 6",
      Saturday: "Thứ 7",
      Sunday: "Chủ nhật",
    };

    const dayNumMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const createDateOnly = (dateInput) => {
      let dateStr;
      if (dateInput instanceof Date) {
        dateStr = dateInput.toISOString().split("T")[0];
      } else if (typeof dateInput === "string") {
        dateStr = dateInput.split("T")[0];
      } else {
        return null;
      }
      const [year, month, day] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    enrollments.forEach((enroll) => {
      const { classId } = enroll;
      const schedule = classId.schedule;
      const classStart = createDateOnly(schedule.startDate);
      const classEnd = createDateOnly(schedule.endDate);
      if (!classStart || !classEnd) return;

      // Tìm tuần đầu tiên chứa startDate
      const firstWeekStart = new Date(classStart);
      const startDay = firstWeekStart.getDay();
      firstWeekStart.setDate(
        firstWeekStart.getDate() - (startDay === 0 ? 6 : startDay - 1)
      );

      let currentWeekStart = new Date(firstWeekStart);

      while (currentWeekStart <= classEnd) {
        schedule.days.forEach((dayEn) => {
          const dayNum = dayNumMap[dayEn];
          const targetDate = new Date(currentWeekStart);
          const diffDays = dayNum - 1; // Offset từ Monday
          targetDate.setDate(currentWeekStart.getDate() + diffDays);

          if (targetDate >= classStart && targetDate <= classEnd) {
            const normalizedTargetDate = new Date(
              targetDate.getFullYear(),
              targetDate.getMonth(),
              targetDate.getDate()
            );
            if (normalizedTargetDate.getTime() === today.getTime()) {
              const session = {
                ...enroll,
                sessionDate: targetDate,
                dayVN: dayMap[dayEn],
                isToday: true,
              };
              sessions.push(session);
            }
          }
        });

        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
    });

    return sessions.sort((a, b) => a.sessionDate - b.sessionDate);
  };

  const renderHeroSection = () => {
    if (currentUser) {
      const userName = `${currentUser.lastname} ${currentUser.firstname}`;

      if (isLoadingSchedule) {
        // Hiển thị skeleton thay vì chỉ có text "Đang tải..."
        return (
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10">
            <div className="container mx-auto px-6 text-left max-w-7xl">
              <h1 className="text-4xl md:text-4xl font-bold mb-10">
                Xin chào, {userName}!
              </h1>
              <h2 className="text-2xl md:text-2xl font-semibold mb-8">
                Lịch học hôm nay ({new Date().toLocaleDateString("vi-VN")})
              </h2>

              {/* Skeleton UI */}
              <div className="space-y-4 animate-pulse">
                {[1].map((i) => (
                  <div
                    key={i}
                    className="bg-white/20 rounded-lg p-4 flex flex-col gap-2"
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
      } else if (enrollments.length === 0) {
        // Chưa đăng ký khóa học nào
        return (
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10">
            <div className="container mx-auto px-6 text-left max-w-7xl">
              <h1 className="text-4xl md:text-4xl font-bold mb-10">
                Xin chào, {userName}!
              </h1>
              <h2 className="text-2xl md:text-2xl font-semibold mb-4">
                Lịch học hôm nay ({new Date().toLocaleDateString("vi-VN")})
              </h2>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học TOEIC
                nổi bật ngay bây giờ!
              </p>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-black font-semibold"
                >
                  Đăng ký học ngay
                </Button>
              </div>
            </div>
          </section>
        );
      } else if (todaySessions.length === 0) {
        return (
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10">
            <div className="container mx-auto px-6 text-left max-w-7xl">
              <h1 className="text-4xl md:text-4xl font-bold mb-10">
                Xin chào, {userName}!
              </h1>
              <h2 className="text-2xl md:text-2xl font-semibold mb-4">
                Lịch học hôm nay ({new Date().toLocaleDateString("vi-VN")})
              </h2>
              <p className="text-lg md:text-xl mb-8 text-blue-100">
                Bạn không có lịch học hôm nay.
              </p>
              {/* <Button
                size="lg"
                className="bg-yellow-400 text-black font-semibold"
              >
                Đăng ký học ngay
              </Button> */}
            </div>
          </section>
        );
      } else {
        // Hiển thị lịch hôm nay nếu có
        return (
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10">
            <div className="container mx-auto px-6 text-left max-w-7xl">
              <h1 className="text-4xl md:text-4xl font-bold mb-10">
                Xin chào, {userName}!
              </h1>
              <h2 className="text-2xl md:text-2xl font-semibold mb-4">
                Lịch học hôm nay ({new Date().toLocaleDateString("vi-VN")})
              </h2>
              <div className="space-y-4 mb-8">
                {todaySessions.map((session) => {
                  const { classId } = session;
                  return (
                    <div
                      key={session._id}
                      className="bg-white/10 rounded-lg p-4"
                    >
                      <p className="text-lg font-semibold">
                        {classId.courseId?.title || "Khóa học TOEIC"}
                      </p>
                      <p className="text-sm text-blue-100">
                        {`Giảng viên ${classId.instructor.profile.lastname} ${classId.instructor.profile.firstname}`}
                      </p>
                      <p className="text-sm">
                        {classId.schedule.startTime} -{" "}
                        {classId.schedule.endTime}
                      </p>
                      <button
                        onClick={() =>
                          window.open(classId.schedule.meetLink, "_blank")
                        }
                        className="mt-2 bg-green-400 text-black px-4 py-2 rounded text-sm font-semibold hover:bg-green-500"
                      >
                        Tham gia ngay
                      </button>
                    </div>
                  );
                })}
              </div>
              {/* <Button
                size="lg"
                className="bg-yellow-400 text-black font-semibold"
                onClick={() => navigate("/my-schedule")}
              >
                Lịch học của tôi
              </Button> */}
            </div>
          </section>
        );
      }
    } else {
      // Hero mặc định khi chưa đăng nhập
      return (
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Luyện Thi TOEIC Online Cùng DTT
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Nền tảng học DTT thông minh – cá nhân hóa lộ trình, rút ngắn thời
              gian ôn luyện.
            </p>
            <Button
              size="lg"
              className="bg-yellow-400 text-black font-semibold"
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
        <Button size="lg" className="bg-yellow-400 text-black font-semibold">
          Đăng ký ngay
        </Button>
      </section>
    </div>
  );
};

export default ToeicHome;
