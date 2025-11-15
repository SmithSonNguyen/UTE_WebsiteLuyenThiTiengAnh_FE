// components/MySchedulePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMySchedule } from "@/api/enrollmentApi"; // API trả array classes với sessions
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  MoreVertical,
  LogIn,
  RefreshCw,
} from "lucide-react";

// Skeleton components (giữ nguyên)
const TableSkeleton = () => (
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
        {[...Array(5)].map((_, i) => (
          <tr key={i}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ProgressSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-8 animate-pulse"></div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5 animate-pulse"></div>
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-20 mx-auto mt-1 animate-pulse"></div>
      </div>
      <div className="text-center">
        <div className="h-8 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-20 mx-auto mt-1 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const UpcomingSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 space-y-3 max-h-64 overflow-y-auto">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex items-center p-3 bg-gray-50 rounded-lg animate-pulse"
      >
        <div className="w-2 h-2 rounded-full mr-3 bg-gray-200"></div>
        <div className="flex-1 space-y-1">
          <div className="h-3 bg-gray-200 rounded w-48"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    ))}
  </div>
);

// Action Menu Dropdown Component
const ActionMenu = ({ session, onJoinClass, onRegisterMakeup }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        title="Tùy chọn"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[1000] animate-fadeIn">
          {/* Join Class Option */}
          <button
            onClick={() => {
              onJoinClass();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 group"
          >
            <LogIn className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Tham Gia Lớp Học
              </div>
              <div className="text-xs text-gray-500">
                Vào phòng học trực tuyến
              </div>
            </div>
          </button>

          {/* Makeup Option (if available) */}
          {session.showMakeupButton && (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  onRegisterMakeup();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 group"
              >
                <RefreshCw className="w-4 h-4 text-orange-600 group-hover:rotate-180 transition-transform duration-300" />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Đăng Ký Học Bù
                  </div>
                  <div className="text-xs text-gray-500">
                    Buổi {session.sessionNumber}
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

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

// Modal component cho chọn buổi bù - Premium Design
const MakeupModal = ({
  isOpen,
  onClose,
  missedSession,
  remainingMakeups,
  onSelectMakeup,
}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Dữ liệu mẫu - các buổi học có thể bù
  const availableMakeupSlots = [
    {
      id: 1,
      date: "25/11/2025",
      dayOfWeek: "Thứ Hai",
      time: "18:00 - 20:00",
      sessionNumber: 5,
      className: "TOEIC-550-A1",
      instructor: "Thầy Nguyễn Văn A",
      level: "beginner",
      availableSlots: 3,
      maxSlots: 5,
      isPopular: true,
    },
    {
      id: 2,
      date: "27/11/2025",
      dayOfWeek: "Thứ Tư",
      time: "19:00 - 21:00",
      sessionNumber: 5,
      className: "TOEIC-550-B2",
      instructor: "Cô Trần Thị B",
      level: "intermediate",
      availableSlots: 2,
      maxSlots: 5,
      isPopular: false,
    },
    {
      id: 3,
      date: "29/11/2025",
      dayOfWeek: "Thứ Sáu",
      time: "18:30 - 20:30",
      sessionNumber: 6,
      className: "TOEIC-650-C3",
      instructor: "Thầy Lê Văn C",
      level: "advanced",
      availableSlots: 4,
      maxSlots: 5,
      isPopular: false,
    },
    {
      id: 4,
      date: "01/12/2025",
      dayOfWeek: "Thứ Hai",
      time: "17:00 - 19:00",
      sessionNumber: 7,
      className: "TOEIC-550-A1",
      instructor: "Thầy Nguyễn Văn A",
      level: "beginner",
      availableSlots: 5,
      maxSlots: 5,
      isPopular: true,
    },
  ];

  const handleConfirm = () => {
    if (selectedSlot) {
      onSelectMakeup(selectedSlot);
      setSelectedSlot(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header với Gradient và Pattern - Compact Version */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-5 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Chọn Buổi Học Bù</h2>
                {missedSession && (
                  <p className="text-xs mt-1 opacity-90">
                    Bù buổi {missedSession.sessionNumber} •{" "}
                    {missedSession.dateLabel || missedSession.date}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)] bg-gray-50">
          {/* Info Card - Số lần bù còn lại */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Số lần bù học còn lại
                </p>
                <p className="text-amber-700">
                  Bạn còn{" "}
                  <span className="text-2xl font-bold text-amber-600 mx-1">
                    {remainingMakeups}
                  </span>
                  lần bù học trong khóa này
                </p>
              </div>
            </div>
          </div>

          {/* Grid Layout cho các buổi học */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableMakeupSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;

              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`relative group cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg"
                      : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-lg">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>
                  )}

                  <div className="p-5">
                    {/* Header với ngày và level */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar
                            className={`w-5 h-5 ${
                              isSelected ? "text-blue-600" : "text-gray-600"
                            }`}
                          />
                          <span className="font-bold text-lg text-gray-900">
                            {slot.dayOfWeek}
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">
                          {slot.date}
                        </p>
                      </div>
                    </div>

                    {/* Session Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Thời gian
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {slot.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">
                            Lớp học
                          </p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {slot.className}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {slot.instructor}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Buổi học tag */}
                    <div className="mt-3 flex justify-center">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Buổi {slot.sessionNumber}
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div
                    className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                      isSelected
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    } bg-gradient-to-br from-blue-400/10 to-purple-400/10 pointer-events-none`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-5 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedSlot ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Đã chọn:{" "}
                <span className="font-semibold text-gray-900">
                  {selectedSlot.dayOfWeek}, {selectedSlot.date}
                </span>
              </span>
            ) : (
              "Vui lòng chọn buổi học bù phù hợp"
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className={`px-8 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                selectedSlot
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Xác Nhận Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component chính
const MySchedulePage = () => {
  const [filterPeriod, setFilterPeriod] = useState("week"); // 'week', 'month', 'all'
  const [selectedCourse, setSelectedCourse] = useState(""); // Course ID hoặc ''
  const [classes, setClasses] = useState([]); // Từ API: array classes
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState("schedule"); // 'schedule' hoặc 'makeup'
  const [isMakeupModalOpen, setIsMakeupModalOpen] = useState(false);
  const [selectedMakeupSession, setSelectedMakeupSession] = useState(null);
  const [registeredMakeups, setRegisteredMakeups] = useState([]); // Danh sách buổi bù đã đăng ký
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userName = `${user.lastname} ${user.firstname}`;

  // Dữ liệu mẫu - số lần bù còn lại (thực tế sẽ lấy từ API)
  const remainingMakeups = 3;

  // Define now at component level (fix ReferenceError)
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Normalize to midnight

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getMySchedule(); // Trả array classes
        setClasses(res); // Giả sử res.data là array classes
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
        classSessions.map((session) => ({
          ...session,
          classCode: cls.classCode,
          courseTitle: cls.courseId.title,
          courseLevel: cls.courseId.level,
          instructorName:
            cls.instructor.profile.lastname +
            " " +
            cls.instructor.profile.firstname,
          time: cls.time,
          meetLink: cls.meetLink,
        }))
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
      courseId: cls.courseId._id,
      courseTitle: cls.courseId.title,
      courseLevel: cls.courseId.level,
      nextSession,
    };
  });

  // Handler mở modal bù học
  const handleOpenMakeupModal = (session) => {
    setSelectedMakeupSession(session);
    setIsMakeupModalOpen(true);
  };

  // Handler đăng ký buổi bù
  const handleSelectMakeup = (makeupSlot) => {
    const newMakeup = {
      id: Date.now(),
      originalSession: selectedMakeupSession,
      makeupSlot: makeupSlot,
      registeredAt: new Date().toISOString(),
      status: "pending", // pending, confirmed, cancelled
    };
    setRegisteredMakeups([...registeredMakeups, newMakeup]);
    alert(
      `Đã đăng ký bù buổi ${selectedMakeupSession.sessionNumber} vào ${makeupSlot.dayOfWeek}, ${makeupSlot.date}`
    );
  };

  // Handler hủy buổi bù
  const handleCancelMakeup = (makeupId) => {
    if (window.confirm("Bạn có chắc muốn hủy đăng ký buổi bù này?")) {
      setRegisteredMakeups(registeredMakeups.filter((m) => m.id !== makeupId));
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
                            {session.dateLabel}
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
                            <ActionMenu
                              session={session}
                              onJoinClass={() =>
                                window.open(session.meetLink, "_blank")
                              }
                              onRegisterMakeup={() =>
                                handleOpenMakeupModal(session)
                              }
                            />
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
            /* Tab Lịch Bù */
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {registeredMakeups.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buổi Gốc
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Buổi Bù
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lớp Bù
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành Động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {registeredMakeups.map((makeup) => (
                      <tr key={makeup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Buổi {makeup.originalSession.sessionNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {makeup.originalSession.dateLabel}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {makeup.makeupSlot.dayOfWeek},{" "}
                            {makeup.makeupSlot.date}
                          </div>
                          <div className="text-xs text-gray-500">
                            {makeup.makeupSlot.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {makeup.makeupSlot.className}
                          </div>
                          <div className="text-xs text-gray-500">
                            {makeup.makeupSlot.instructor}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Chờ xác nhận
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleCancelMakeup(makeup.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Hủy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chưa có buổi bù nào
                  </h3>
                  <p className="text-sm text-gray-600">
                    Các buổi học bù bạn đăng ký sẽ hiển thị tại đây
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
                  key={cls.classCode}
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
                      Level: {cls.courseLevel}
                      {cls.nextSession &&
                        ` | Buổi tới: ${cls.nextSession.dateLabel}`}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/classes/${cls.courseId}`)}
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
        makeupSession={selectedMakeupSession}
        remainingMakeups={remainingMakeups}
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
