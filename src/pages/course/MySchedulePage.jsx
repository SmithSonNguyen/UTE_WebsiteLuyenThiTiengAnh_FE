// components/MySchedulePage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  TableSkeleton,
  ProgressSkeleton,
  UpcomingSkeleton,
} from "@/components/course/MyScheduleSkeleton";
import MakeupRequestItem from "@/components/course/MakeupRequestItem";
import MakeupModal from "@/components/course/MakeupModal";
import ActionMenu from "@/components/course/ActionMenu";
import { getMySchedule } from "@/api/enrollmentApi"; // API trả array classes với sessions
import {
  registerMakeupClass,
  getMakeupRequestsByStudent,
  cancelMakeupRequest,
} from "@/api/makeuprequestApi";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Calendar, Clock, MapPin, User, ArrowRight, X } from "lucide-react";
import formatDateToDDMMYY from "@/utils/formatDateToDDMMYY";
import { toast } from "react-toastify";

// Empty State Component (bỏ test date input)
const EmptyState = ({ userName }) => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch Học Của Tôi</h1>
          <p className="text-lg text-gray-600 mt-5">Xin chào, {userName}!</p>
        </div>
        <Link
          to="/classes/register"
          className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Đăng Ký Khóa Mới
        </Link>
      </div>

      {/* Filter - Static, disabled */}
      <div className="flex justify-center sm:justify-end gap-4">
        <select
          value="week"
          onChange={() => {}} // Disabled in empty state
          disabled
          className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 opacity-50"
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="all">Tất cả</option>
        </select>
        <select
          value=""
          onChange={() => {}} // Disabled
          disabled
          className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 opacity-50"
        >
          <option value="">Tất cả khóa học</option>
        </select>
      </div>
    </div>

    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Empty Table */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Thời Khóa Biểu
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp Học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời Gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-6xl">📚</div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Bạn chưa đăng ký khóa học nào
                    </h3>
                    <p className="text-lg text-gray-600 max-w-md">
                      Hãy bắt đầu hành trình học TOEIC của bạn bằng cách đăng ký
                      một khóa học ngay hôm nay!
                    </p>
                    <Link
                      to="/classes/register"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
                    >
                      Đăng ký khóa học ngay
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Progress & Upcoming - Empty */}
      <div className="space-y-6">
        {/* Progress Overview - Empty */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Tiến Độ Học Tập
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-4">
            <div className="text-6xl">📈</div>
            <h3 className="text-xl font-semibold text-gray-900">
              Chưa có tiến độ
            </h3>
            <p className="text-gray-600">
              Đăng ký khóa học để theo dõi tiến độ học tập của bạn.
            </p>
          </div>
        </div>

        {/* Upcoming Events - Empty */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Các khóa học trực tuyến đã đăng ký
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 text-center space-y-4">
            <div className="text-6xl">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900">
              Chưa có khóa học nào
            </h3>
            <p className="text-gray-600">
              Khám phá và đăng ký các khóa học TOEIC phù hợp với bạn.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
      </div>
    </div>
  </div>
);

// Component chính
const MySchedulePage = () => {
  const [filterPeriod, setFilterPeriod] = useState("week"); // 'week', 'month', 'all'
  const [selectedCourse, setSelectedCourse] = useState(""); // Course ID hoặc ''
  const [classes, setClasses] = useState([]); // Từ API: array classes
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' hoặc 'makeup'
  const [isMakeupModalOpen, setIsMakeupModalOpen] = useState(false);
  const [selectedMissedSession, setSelectedMissedSession] = useState(null);
  const [registeredMakeups, setRegisteredMakeups] = useState([]); // Danh sách buổi bù đã đăng ký
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userName = `${user.lastname} ${user.firstname}`;

  // Define now at component level (fix ReferenceError)
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize to midnight

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [scheduleRes, makeupRes] = await Promise.all([
          getMySchedule(),
          getMakeupRequestsByStudent(), // API fetch MakeupRequest của user
        ]);
        setClasses(scheduleRes);
        setRegisteredMakeups(makeupRes);
      } catch (err) {
        console.error("Lỗi fetch lịch:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Tính progress tổng (từ tất cả classes)
  const totalSessions = classes.reduce(
    (sum, cls) => sum + cls.totalSessions,
    0
  );
  const attendedSessions = classes.reduce(
    (sum, cls) => sum + cls.sessionAttended,
    0
  );
  const overallPercentage =
    totalSessions > 0
      ? Math.round((attendedSessions / totalSessions) * 100)
      : 0;

  // Filter sessions (flatMap từ tất cả classes, filter period & course)
  const filterSessions = () => {
    const getPeriodRange = () => {
      if (filterPeriod === "week") {
        const weekStart = new Date(now);
        const day = now.getDay(); // 0=Sun, 1=Mon, ...
        weekStart.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // Đầu tuần (Mon)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return { start: weekStart, end: weekEnd };
      } else if (filterPeriod === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: monthStart, end: monthEnd };
      }
      return null; // 'all' → Không filter
    };

    const periodRange = getPeriodRange();
    let filteredSessions = [];

    classes.forEach((cls) => {
      let classSessions = cls.sessions;

      // Filter theo course
      if (
        selectedCourse &&
        selectedCourse !== "" &&
        cls.courseId._id !== selectedCourse
      ) {
        return; // Skip class không match
      }

      // Filter theo period (nếu có)
      if (periodRange) {
        classSessions = classSessions.filter((session) => {
          const sessionDate = new Date(
            session.fullDate.split("/").reverse().join("-")
          );
          sessionDate.setHours(0, 0, 0, 0);
          return (
            sessionDate >= periodRange.start && sessionDate <= periodRange.end
          );
        });
      }

      // FlatMap với class info
      filteredSessions = filteredSessions.concat(
        classSessions.map((session) => {
          // Tìm makeup matching cho session này (chỉ 1, giả sử không duplicate)
          const matchingMakeup = registeredMakeups.find(
            (makeup) =>
              makeup.originalSession.classId._id.toString() === cls.classId &&
              makeup.originalSession.sessionNumber === session.sessionNumber &&
              ["scheduled", "completed"].includes(makeup.status)
          );

          const hasMakeup = !!matchingMakeup;
          const statusMakeup = matchingMakeup ? matchingMakeup.status : null; // "scheduled" hoặc "completed"
          return {
            ...session,
            classId: cls.classId,
            classCode: cls.classCode,
            courseTitle: cls.courseId.title,
            courseLevel: cls.courseId.level,
            instructorName:
              cls.instructor.profile.lastname +
              " " +
              cls.instructor.profile.firstname,
            time: cls.time,
            meetLink: cls.meetLink,
            showMakeupButton: session.showMakeupButton && !hasMakeup, // ← Kết hợp ở đây
            hasMakeup,
            statusMakeup,
          };
        })
      );
    });

    // Sort theo ngày
    return filteredSessions.sort((a, b) => {
      const dateA = new Date(a.fullDate.split("/").reverse().join("-"));
      const dateB = new Date(b.fullDate.split("/").reverse().join("-"));
      return dateA - dateB;
    });
  };

  const sessions = filterSessions();

  // Upcoming classes (3 classes đầu, hoặc filter sessions upcoming)
  const upcomingClasses = classes.slice(0, 3).map((cls) => {
    const nextSession =
      cls.sessions.find((s) => {
        const sDate = new Date(s.fullDate.split("/").reverse().join("-"));
        sDate.setHours(0, 0, 0, 0);
        return sDate >= now;
      }) || cls.sessions[0]; // Fallback first session
    return {
      classId: cls.classId,
      courseId: cls.courseId._id,
      courseTitle: cls.courseId.title,
      courseLevel: cls.courseId.level,
      nextSession,
    };
  });

  // Handler mở modal bù học
  const handleOpenMakeupModal = (session) => {
    setSelectedMissedSession(session);
    setIsMakeupModalOpen(true);
  };

  // Handler đăng ký buổi bù
  const handleSelectMakeup = async (makeupData) => {
    try {
      const response = await registerMakeupClass(makeupData);
      const makeupRequest = response.makeupRequest;
      setRegisteredMakeups((prev) => [makeupRequest, ...prev]);

      // Update local classes để hide nút (tìm session tương ứng)
      setClasses((prevClasses) =>
        prevClasses.map((cls) => {
          const classId = cls.classId;
          const statusMakeup = makeupRequest.status;

          return {
            ...cls,
            sessions: cls.sessions.map((s) =>
              classId === selectedMissedSession.classId &&
              s.sessionNumber === selectedMissedSession.sessionNumber
                ? {
                    ...s,

                    hasMakeup: true,
                    statusMakeup,
                  } // Override
                : s
            ),
          };
        })
      );
    } catch (error) {
      console.error("❌ Error registering makeup class:", error);
      toast.error("Đã xảy ra lỗi khi đăng ký buổi bù. Vui lòng thử lại.");
      return;
    }
    toast.success(`Đã đăng ký học bù thành công!`);
  };

  // Handler hủy buổi bù
  const handleCancelMakeup = async (makeupId) => {
    try {
      setRegisteredMakeups(registeredMakeups.filter((m) => m._id !== makeupId));
    } catch (error) {
      console.error("❌ Error canceling makeup request:", error);
      toast.error("Đã xảy ra lỗi khi hủy đăng ký buổi bù. Vui lòng thử lại.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lịch Học Của Tôi
              </h1>
              <p className="text-lg text-gray-600 mt-5">
                Xin chào, {userName}!
              </p>
            </div>
            <Link
              to="/classes/register"
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Đăng Ký Khóa Mới
            </Link>
          </div>

          {/* Filter - Static */}
          <div className="flex justify-center sm:justify-end gap-4">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="all">Tất cả</option>
            </select>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả khóa học</option>
              {classes.map((cls) => (
                <option key={cls.courseId._id} value={cls.courseId._id}>
                  {cls.courseId.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Thời Khóa Biểu
            </h2>
            <TableSkeleton />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Tiến Độ Học Tập
              </h2>
              <ProgressSkeleton />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Các khóa học trực tuyến đã đăng ký
              </h2>
              <UpcomingSkeleton />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Hành Động Nhanh
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
                <button
                  onClick={() => navigate("/contact-instructor")}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Liên Hệ Giảng Viên
                </button>
                <button
                  onClick={() => navigate("/report-absence")}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                >
                  Báo Cáo Vắng Mặt
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium text-gray-700">
                  Xuất Lịch Sang Google Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state if no classes
  if (classes.length === 0) {
    return <EmptyState userName={userName} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lịch Học Của Tôi
            </h1>
            <p className="text-lg text-gray-600 mt-5">Xin chào, {userName}!</p>
          </div>
          <Link
            to="/classes/register"
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Đăng Ký Khóa Mới
          </Link>
        </div>

        {/* Filter: Thời gian + Khóa học */}
        <div className="flex justify-center sm:justify-end gap-4">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="all">Tất cả</option>
          </select>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả khóa học</option>
            {classes.map((cls) => (
              <option key={cls.courseId._id} value={cls.courseId._id}>
                {cls.courseId.title} ({cls.classCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`py-4 px-1 border-b-2 font-medium text-md transition ${
                activeTab === "schedule"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Lịch Học
              <span className="ml-2 bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs">
                {sessions.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("makeup")}
              className={`py-4 px-1 border-b-2 font-medium text-md transition ${
                activeTab === "makeup"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Lịch Bù
              <span className="ml-2 bg-orange-100 text-orange-700 py-1 px-2 rounded-full text-xs">
                {registeredMakeups.length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thời Khóa Biểu Chính (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {activeTab === "schedule" ? "Thời Khóa Biểu" : "Lịch Bù Đã Đăng Ký"}
          </h2>
          {activeTab === "schedule" ? (
            <div className="bg-white rounded-lg shadow-md">
              <div className="overflow-visible">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buổi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lớp Học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thời Gian
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y relative">
                    {sessions.map((session) => {
                      const levelColor =
                        session.courseLevel === "beginner"
                          ? "bg-green-100 text-green-800"
                          : session.courseLevel === "intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800";

                      return (
                        <tr
                          key={`${session.classCode}-${session.sessionNumber}`} // Key ổn định
                          className={`relative hover:bg-gray-50 ${
                            session.isToday
                              ? "bg-yellow-50 border-l-4 border-yellow-400"
                              : ""
                          } ${
                            session.isAbsent
                              ? "bg-red-50 border-l-4 border-red-400"
                              : ""
                          }`} // Highlight absent
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Buổi {session.sessionNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {session.dayVN}
                            {" - "} {formatDateToDDMMYY(session.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex px-2 py-1 rounded-md text-sm font-medium ${levelColor}`}
                            >
                              {session.classCode} - {session.courseTitle}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              Giảng viên: {session.instructorName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {session.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {/* <ActionMenu
                              session={session}
                              onJoinClass={() =>
                                window.open(session.meetLink, "_blank")
                              }
                              onRegisterMakeup={() =>
                                handleOpenMakeupModal(session)
                              }
                            /> */}
                            {session.hasMakeup ? (
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full 
                              ${
                                session.statusMakeup === "scheduled"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                              >
                                {session.statusMakeup === "scheduled"
                                  ? "Đã lên lịch"
                                  : "Đã bù"}
                              </span>
                            ) : session.showMakeupButton ? (
                              <ActionMenu
                                session={session}
                                onJoinClass={() =>
                                  window.open(session.meetLink, "_blank")
                                }
                                onRegisterMakeup={() =>
                                  handleOpenMakeupModal(session)
                                }
                                //isRegistering={isRegistering} // Nếu bạn pass loading từ gợi ý trước
                              />
                            ) : (
                              // Optional: Show nút Join nếu không phải makeup case (luôn có cho future/present)
                              <button
                                onClick={() =>
                                  window.open(session.meetLink, "_blank")
                                }
                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                title="Tham gia lớp"
                              >
                                Tham gia
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {sessions.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          Không có lịch học nào trong khoảng thời gian này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Tab Lịch Bù - Card Layout */
            <div className="space-y-4">
              {registeredMakeups.length > 0 ? (
                registeredMakeups.map((makeup) => (
                  <MakeupRequestItem
                    key={makeup._id}
                    makeup={makeup}
                    onCancelClick={handleCancelMakeup}
                  />
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Chưa có buổi bù nào
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Các buổi học bù bạn đăng ký sẽ hiển thị tại đây. Hãy đăng ký
                    bù buổi khi bạn vắng mặt nhé!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Progress & Upcoming */}
        <div className="space-y-6">
          {/* Progress Overview */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Tiến Độ Học Tập
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Tổng Hoàn Thành
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {overallPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {attendedSessions}
                  </div>
                  <div className="text-sm text-gray-500">Buổi Đã Học</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalSessions}
                  </div>
                  <div className="text-sm text-gray-500">Tổng Buổi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events (classes với next session upcoming) */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Các khóa học trực tuyến đã đăng ký
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-3 max-h-64 overflow-y-auto">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.classId}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${
                      cls.courseLevel === "beginner"
                        ? "bg-green-500"
                        : cls.courseLevel === "intermediate"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {cls.classCode} - {cls.courseTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      Level: {cls.courseLevel} <br />
                      {cls.nextSession &&
                        `Buổi tiếp theo: ${cls.nextSession.dateLabel}`}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/classes/${cls.classId}`)}
                    className="text-xs text-blue-600 hover:text-blue-900"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  Không có khóa học nào.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions (giữ nguyên) */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Hành Động Nhanh
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
              <button
                onClick={() => navigate("/contact-instructor")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
              >
                Liên Hệ Giảng Viên
              </button>
              <button
                onClick={() => navigate("/report-absence")}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
              >
                Báo Cáo Vắng Mặt
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium text-gray-700">
                Xuất Lịch Sang Google Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Makeup Modal */}
      <MakeupModal
        isOpen={isMakeupModalOpen}
        onClose={() => setIsMakeupModalOpen(false)}
        missedSession={selectedMissedSession}
        onSelectMakeup={handleSelectMakeup}
      />
    </div>
  );
};

export default MySchedulePage;

// Add to your global CSS or create a style tag
// @keyframes fadeIn {
//   from { opacity: 0; transform: translateY(-10px); }
//   to { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
