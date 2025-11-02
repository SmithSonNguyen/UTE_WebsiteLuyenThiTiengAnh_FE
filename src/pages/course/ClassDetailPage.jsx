// pages/ClassDetailPage.jsx
// Import React và các hook cần thiết
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // React Router cho params và nav
import { getClassForStudent } from "@/api/classApi"; // API lấy thông tin lớp học

// Dữ liệu mẫu (fake data dựa trên schema Enrollment/Class)
// Trong thực tế, fetch từ API /classes/:classId với accessToken và requireEnrollment middleware

// Virtual daysVN
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

// Component chính
const ClassDetailPage = () => {
  const { classId } = useParams(); // Lấy classId từ URL
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  //const [enrollmentData, setEnrollmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetch data (thay bằng axios.get(`/api/classes/${classId}`) với token)
    const fetchData = async () => {
      try {
        // Giả sử API trả về { class: mockClassData, enrollment: mockEnrollmentData }
        // Trong thực tế: const res = await axios.get(`/api/classes/${classId}`, { headers: { Authorization: `Bearer ${token}` } });
        const res = await getClassForStudent(classId);
        setClassData(res);
        //setEnrollmentData(res.enrollment);
      } catch (err) {
        setError(
          err.message ||
            "Không thể tải thông tin lớp học. Bạn có quyền truy cập không?"
        );
        // Nếu 403, navigate('/unauthorized');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          {error || "Lớp học không tồn tại."}
        </div>
        <Link to="/my-schedule" className="ml-4 text-blue-600">
          Quay về Lịch Học
        </Link>
      </div>
    );
  }

  const { schedule, courseId, instructor, capacity, classCode, status } =
    classData;

  const daysVN = getDaysVN(schedule.days);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Link
              to="/my-schedule"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block text-sm"
            >
              ← Quay về Lịch Học
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              {classCode} - {courseId.title}
            </h1>
            <p className="text-gray-600 mt-2">{courseId.description}</p>
          </div>
          <div className="text-right">
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                courseId.level === "beginner"
                  ? "bg-green-100 text-green-800"
                  : courseId.level === "intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {courseId.level.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Schedule & Progress */}
        <div className="space-y-6">
          {/* Schedule Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Lịch Học
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày học:</span>
                <span className="font-medium">{daysVN.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-medium">
                  {schedule.startTime} - {schedule.endTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày bắt đầu:</span>
                <span className="font-medium">
                  {new Date(schedule.startDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày kết thúc:</span>
                <span className="font-medium">
                  {new Date(schedule.endDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sức chứa:</span>
                <span className="font-medium">
                  {capacity.currentStudents}/{capacity.maxStudents}
                </span>
              </div>
              <button
                onClick={() => window.open(schedule.meetLink, "_blank")}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Tham Gia Lớp Học (Meet Link)
              </button>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tiến Độ Của Bạn
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Hoàn thành
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {status.progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${status.progressPercent}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {status.sessionsAttended}
                  </div>
                  <div className="text-sm text-gray-500">Buổi Đã Học</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {status.totalSessions}
                  </div>
                  <div className="text-sm text-gray-500">Tổng Buổi</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Instructor & Resources */}
        <div className="space-y-6">
          {/* Instructor Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Giảng Viên
            </h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  <img
                    src={
                      instructor.profile.avatar ||
                      "/src/assets/defaultavatar.png"
                    }
                    alt={instructor.name}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {instructor.profile.lastname} {instructor.profile.firstname}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {instructor.profile.bio}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  (window.location.href = `mailto:${instructor.email}`)
                }
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Gửi Email
              </button>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tài Liệu Học Tập
            </h2>
            <ul className="space-y-2">
              {courseId.resources.map((resource, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{resource.name}</span>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    Tải/Mở
                  </a>
                </li>
              ))}
            </ul>
            {courseId.resources.length === 0 && (
              <p className="text-gray-500 text-sm text-center mt-4">
                Chưa có tài liệu. Kiểm tra sau!
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Hành Động
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowNoteModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Ghi Chú Cá Nhân
              </button>
              <Link
                to={`/enrollments/${classId}/report-absence`}
                className="w-full block bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium text-center"
              >
                Báo Cáo Vắng Mặt
              </Link>
              <button
                onClick={() => navigate("/my-schedule")}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-900 py-2 px-4 rounded-lg font-medium"
              >
                Quay Về Lịch Học
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Ghi Chú Cho Lớp {classCode}
              </h3>
              <textarea
                value={currentNote || ""}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-green-500"
                placeholder="Ghi lại từ vựng, ý chính, bài tập..."
                rows={6}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 text-gray-600 border rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={async () => {
                    // Simulate save: PUT /enrollments/my/:classId/notes
                    // const res = await axios.put(`/api/enrollments/${classId}/notes`, { notes: currentNote });
                    // setEnrollmentData({ ...enrollmentData, notes: currentNote });
                    setShowNoteModal(false);
                    // toast.success('Đã lưu ghi chú!');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Lưu Ghi Chú
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetailPage;
