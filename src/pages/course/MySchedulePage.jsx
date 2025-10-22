// components/MySchedulePage.jsx
// Import React và các hook cần thiết (giả sử dùng React Router cho nav)
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Nếu dùng React Router
import { getMySchedule } from "@/api/enrollmentApi"; // Giả sử có API này

// Virtual daysVN từ schema
const dayMap = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thursday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
  Sunday: "Chủ nhật",
};

const getDaysVN = (days) => days.map((day) => dayMap[day]);

/// Function generateSessions FIXED (sử dụng Date object cho filter)
const generateSessions = (enrollments, period, fakeToday = null) => {
  // Parse fake date if it's a string
  let now;
  if (fakeToday && typeof fakeToday === "string") {
    const [year, month, day] = fakeToday.split("-").map(Number);
    now = new Date(year, month - 1, day);
  } else if (fakeToday instanceof Date) {
    now = fakeToday;
  } else {
    now = new Date();
  }

  const sessions = [];

  // Helper: Tạo Date object chỉ với ngày (00:00 local, tránh timezone shift)
  const createDateOnly = (dateInput) => {
    let dateStr;
    if (dateInput instanceof Date) {
      dateStr = dateInput.toISOString().split("T")[0];
    } else if (typeof dateInput === "string") {
      dateStr = dateInput.split("T")[0];
    } else {
      console.error("Invalid date input:", dateInput);
      return null;
    }
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // JS month 0-based, time 00:00 local
  };

  const getPeriodStart = () => {
    if (period === "week") {
      const day = now.getDay(); // 0=Sun, 1=Mon, ... (21/10 Tue=2)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (day === 0 ? 6 : day - 1)); // Đầu tuần Mon
      return weekStart;
    } else if (period === "month") {
      return new Date(now.getFullYear(), now.getMonth(), 1); // 1/10
    }
    return null;
  };

  const periodStart = getPeriodStart();
  const periodEnd =
    period === "week"
      ? new Date(periodStart.getTime() + 6 * 24 * 60 * 60 * 1000)
      : period === "month"
      ? new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
      : null;

  // FIX: Normalize periodStart/End về local midnight để so sánh an toàn
  const normalizeLocalDate = (d) => {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  const periodStartDate = periodStart ? normalizeLocalDate(periodStart) : null;
  const periodEndDate = periodEnd ? normalizeLocalDate(periodEnd) : null;

  // Day map num: Sun=0, Mon=1, ... Sat=6 (JS getDay)
  const dayNumMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  enrollments.forEach((enroll) => {
    const { classId } = enroll;
    const schedule = classId.schedule;
    const classStart = createDateOnly(schedule.startDate); // 20/10 00:00
    const classEnd = createDateOnly(schedule.endDate); // 10/12 00:00
    if (!classStart || !classEnd) return; // Skip invalid

    // Bắt đầu từ tuần chứa startDate của lớp
    const firstWeekStart = new Date(classStart);
    const startDay = firstWeekStart.getDay(); // 0=Sun, 1=Mon, ...
    // Lùi về thứ 2 đầu tuần chứa startDate
    firstWeekStart.setDate(
      firstWeekStart.getDate() - (startDay === 0 ? 6 : startDay - 1)
    );

    let currentWeekStart = new Date(firstWeekStart);

    while (currentWeekStart <= classEnd) {
      schedule.days.forEach((dayEn) => {
        const dayNum = dayNumMap[dayEn]; // Mon=1
        const targetDate = new Date(currentWeekStart); // Copy từ đầu tuần
        const diffDays = dayNum - 1; // Mon=0, Tue=1, ... (offset từ Monday)
        targetDate.setDate(currentWeekStart.getDate() + diffDays); // Target đúng ngày

        // Chỉ thêm session nếu trong khoảng thời gian lớp học
        if (targetDate >= classStart && targetDate <= classEnd) {
          // FIX: So sánh chính xác bằng Date object thay vì string
          const normalizedTargetDate = new Date(targetDate);
          normalizedTargetDate.setHours(0, 0, 0, 0);

          const normalizedNow = new Date(now);
          normalizedNow.setHours(0, 0, 0, 0);

          const isToday =
            normalizedTargetDate.getTime() === normalizedNow.getTime();

          // FIX: Filter bằng Date object (không dùng string)
          const inPeriod =
            !periodStartDate ||
            (targetDate >= periodStartDate &&
              (!periodEndDate || targetDate <= periodEndDate));

          if (inPeriod) {
            const session = {
              ...enroll,
              sessionDate: targetDate,
              dayVN: dayMap[dayEn],
              isToday,
            };
            sessions.push(session);
          }
        }
      });

      // Next week
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
  });

  return sessions.sort((a, b) => a.sessionDate - b.sessionDate);
};

// Component chính (giữ nguyên, chỉ fix nhỏ instructor name nếu cần)
const MySchedulePage = () => {
  const [userName] = useState("Nguyễn Văn A"); // Lấy từ auth context
  const [filterPeriod, setFilterPeriod] = useState("week"); // 'week', 'month', 'all'
  const [enrollments, setEnrollments] = useState([]); // Từ API
  const [fakeDate, setFakeDate] = useState(""); // Fake date for testing
  const navigate = useNavigate();

  // Update useEffect để fetch API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMySchedule();
        setEnrollments(res); // Data từ API (array enrollments)
      } catch (err) {
        console.error("Lỗi fetch lịch:", err);
        if (err.response?.status === 401) navigate("/login");
        // Hoặc set error state: setError('Không tải được lịch học');
      }
    };
    fetchData();
  }, [filterPeriod, navigate]); // Note: filterPeriod ở dep, nhưng fetch không phụ thuộc, có thể remove nếu không cần refetch

  // Tính tổng progress
  const totalSessions = enrollments.reduce(
    (sum, e) => sum + e.progress.totalSessions,
    0
  );
  const attendedSessions = enrollments.reduce(
    (sum, e) => sum + e.progress.sessionsAttended,
    0
  );
  const overallPercentage =
    totalSessions > 0
      ? Math.round((attendedSessions / totalSessions) * 100)
      : 0;

  // Generate sessions từ enrollments
  const sessions = generateSessions(
    enrollments,
    filterPeriod,
    fakeDate || null
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lịch Học Của Tôi
            </h1>
            <p className="text-lg text-gray-600 mt-1">Xin chào, {userName}!</p>
          </div>
          <Link
            to="/classes/register"
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Đăng Ký Khóa Mới
          </Link>
        </div>

        {/* Filter */}
        <div className="flex justify-center sm:justify-end gap-4">
          {/* Test Date Input */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Test Date:</label>
            <input
              type="date"
              value={fakeDate}
              onChange={(e) => setFakeDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            />
            {fakeDate && (
              <button
                onClick={() => setFakeDate("")}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Clear
              </button>
            )}
          </div>

          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thời Khóa Biểu Chính (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Thời Khóa Biểu
          </h2>
          {/* Simple Weekly Grid - Mẫu cho tuần hiện tại (21/10/2025) */}
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
              <tbody className="bg-white divide-y ">
                {sessions.map((session) => {
                  const { classId } = session;
                  const sessionType =
                    classId.schedule.startTime < "12:00"
                      ? "Sáng"
                      : classId.schedule.startTime < "18:00"
                      ? "Chiều"
                      : "Tối";
                  const levelColor =
                    classId.courseId.level === "beginner"
                      ? "bg-green-100 text-green-800"
                      : classId.courseId.level === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800";

                  // FIX nhỏ: Instructor name fallback nếu không có firstname/lastname
                  const instructorName =
                    classId.instructor?.name ||
                    `Giảng viên: ${
                      classId.instructor?.profile.lastname || ""
                    } ${classId.instructor?.profile.firstname || ""}`.trim() ||
                    "Giảng viên chưa xác định";

                  return (
                    <tr
                      key={`${session._id}-${
                        session.sessionDate.toISOString().split("T")[0]
                      }`} // Key ổn định hơn
                      className={`hover:bg-gray-50 ${
                        session.isToday
                          ? "bg-yellow-50 border-l-4 border-yellow-400"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.dayVN} (
                        {session.sessionDate.toLocaleDateString("vi-VN")})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <div
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${levelColor}`}
                        >
                          {sessionType}
                        </div> */}
                        <div
                          className={`inline-flex px-2 py-1 rounded-md text-sm font-medium mt-1 ${levelColor}`}
                        >
                          {classId.classCode} -{" "}
                          {classId.courseId?.title || "Khóa học TOEIC Beginner"}{" "}
                          {/* Fallback course name */}
                        </div>
                        <div className="px-2 py-1 text-sm text-gray-500">
                          {instructorName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classId.schedule.startTime} -{" "}
                        {classId.schedule.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            window.open(classId.schedule.meetLink, "_blank")
                          }
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Tham Gia
                        </button>
                        {/* <button
                          onClick={() => navigate(`/classes/${classId._id}`)} // Hoặc mở modal ghi chú
                          className="text-green-600 hover:text-green-900 ml-4"
                        >
                          Ghi Chú
                        </button> */}
                      </td>
                    </tr>
                  );
                })}
                {sessions.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Không có lịch học nào trong{" "}
                      {filterPeriod === "week"
                        ? "tuần"
                        : filterPeriod === "month"
                        ? "tháng"
                        : "khoảng thời gian"}{" "}
                      này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                  className="bg-blue-600 h-2.5 rounded-full"
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

          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Các khóa học trực tuyến đã đăng ký
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-3 max-h-64 overflow-y-auto">
              {enrollments.slice(0, 3).map((enroll) => (
                <div
                  key={enroll._id}
                  className="flex items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-3 ${
                      enroll.classId.courseId.level === "beginner"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {enroll.classId.classCode} -{" "}
                      {enroll.classId.courseId.title ||
                        "Khóa học TOEIC Beginner"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Level: {enroll.classId.courseId.level}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/classes/${enroll.classId._id}`)}
                    className="text-xs text-blue-600 hover:text-blue-900"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              ))}
              {enrollments.length === 0 && (
                <p className="text-center text-gray-500 text-sm">
                  Không có sự kiện sắp tới.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
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
};

export default MySchedulePage;
