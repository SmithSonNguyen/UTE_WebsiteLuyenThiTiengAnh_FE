import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getInstructorClasses } from "../../api/instructorApi";
import {
  getClassStudents,
  getAttendanceByDate,
  saveAttendance,
} from "../../api/attendanceApi";

const AttendanceManagement = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [scheduleError, setScheduleError] = useState(""); // Thêm state cho lỗi schedule
  const [classInfo, setClassInfo] = useState(null); // Thêm state cho thông tin lớp
  const [sessionNumber, setSessionNumber] = useState(null); // Thêm state cho số buổi học

  // Fetch classes from API
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await getInstructorClasses();
      const classesData = response.result || [];
      setClasses(
        classesData.map((cls) => ({
          id: cls._id,
          name: `${cls.courseId.title} - ${cls.classCode}`,
          code: cls.classCode,
        }))
      );
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Không thể tải danh sách lớp học");
    }
  };

  const loadStudents = async () => {
    if (!selectedClass) return;

    setLoading(true);
    setScheduleError(""); // Reset lỗi schedule

    try {
      // Lấy danh sách sinh viên trong lớp
      const studentsData = await getClassStudents(selectedClass);
      setClassInfo(studentsData.classInfo); // Lưu thông tin lớp

      // Lấy điểm danh hiện tại cho ngày đã chọn
      let attendanceData = null;
      try {
        attendanceData = await getAttendanceByDate(selectedClass, selectedDate);
        setSessionNumber(attendanceData.sessionNumber); // Lưu số buổi học
      } catch (error) {
        // Xử lý error message đúng cách
        let errorMessage = "Có lỗi xảy ra khi kiểm tra lịch học";
        if (error?.error) {
          // ✅ Lấy error field chi tiết
          errorMessage = error.error;
        } else if (error?.message) {
          // ✅ Fallback với message
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        setScheduleError(errorMessage);
        setStudents([]); // Clear students khi có lỗi schedule
        return;

        // Nếu chưa có điểm danh cho ngày này, tạo mới
      }

      // Mapping students với thông tin điểm danh (nếu có)
      const studentsWithAttendance = studentsData.students.map((student) => {
        const attendanceRecord = attendanceData?.records.find(
          (record) => record.studentId === student._id
        );

        return {
          id: student._id,
          studentId: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          isPresent: attendanceRecord?.isPresent || false,
          note: attendanceRecord?.note || "",
        };
      });

      setStudents(studentsWithAttendance);
    } catch (error) {
      console.error("Error loading students:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Không thể tải danh sách sinh viên");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load students when class or date changes
  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    } else {
      setStudents([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass, selectedDate]);

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, isPresent } : student
      )
    );
  };

  const handleNoteChange = (studentId, note) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, note } : student
      )
    );
  };

  const handleMarkAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, isPresent: true }))
    );
  };

  const handleMarkAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, isPresent: false }))
    );
  };

  const handleSaveAttendance = async () => {
    if (!selectedClass || students.length === 0) {
      toast.error("Vui lòng chọn lớp và có sinh viên để điểm danh");
      return;
    }

    if (scheduleError) {
      toast.error("Không thể lưu điểm danh khi có lỗi lịch học");
      return;
    }

    try {
      const attendanceData = {
        date: selectedDate,
        students: students.map((student) => ({
          studentId: student.studentId,
          isPresent: student.isPresent,
          note: student.note,
        })),
      };

      await saveAttendance(selectedClass, attendanceData);
      toast.success("Điểm danh đã được lưu thành công!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Không thể lưu điểm danh. Vui lòng thử lại!");
      }
    }
  };

  const presentCount = students.filter((s) => s.isPresent).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Quản lý điểm danh
        </h2>
        <div className="text-sm text-gray-500">
          {new Date(selectedDate).toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn lớp học
            </label>
            <select
              value={selectedClass}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Chọn lớp học --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày điểm danh
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {students.length > 0 && (
            <div className="flex items-end gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="flex-1 bg-green-600 text-white px-3 py-3 rounded-md text-sm hover:bg-green-700 transition-colors"
              >
                Có mặt tất cả
              </button>
              <button
                onClick={handleMarkAllAbsent}
                className="flex-1 bg-red-600 text-white px-3 py-3 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Vắng tất cả
              </button>
            </div>
          )}
        </div>

        {/* Class Schedule Info */}
        {classInfo && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              📅 Thông tin lịch học
            </h4>
            <div className="text-sm text-blue-800">
              <span className="font-medium">Lớp:</span> {classInfo.classCode} -{" "}
              {classInfo.courseTitle}
            </div>
            {sessionNumber /* Chỉ hiển thị nếu có dữ liệu */ && (
              <div className="text-sm text-blue-800">
                <span className="font-medium">Buổi:</span> {sessionNumber}
              </div>
            )}
          </div>
        )}

        {/* Schedule Error Warning */}
        {scheduleError && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-red-600">⚠️</span>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-900">
                  Không thể điểm danh
                </h4>
                <p className="text-sm text-red-800 mt-1">
                  {typeof scheduleError === "string"
                    ? scheduleError
                    : "Có lỗi xảy ra với lịch học"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Tổng sinh viên
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Có mặt</p>
                <p className="text-2xl font-semibold text-green-600">
                  {presentCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-semibold">❌</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Vắng mặt</p>
                <p className="text-2xl font-semibold text-red-600">
                  {absentCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : students.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Danh sách sinh viên
              </h3>
              <button
                onClick={handleSaveAttendance}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 Lưu điểm danh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      STT
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Họ và tên
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Số điện thoại
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">
                      Trạng thái
                    </th>
                    {/* <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Ghi chú
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {student.email}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {student.phone}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleAttendanceChange(student.id, true)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              student.isPresent
                                ? "bg-green-100 text-green-800 border-2 border-green-300"
                                : "bg-gray-100 text-gray-700 hover:bg-green-50"
                            }`}
                          >
                            ✅ Có mặt
                          </button>
                          <button
                            onClick={() =>
                              handleAttendanceChange(student.id, false)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              !student.isPresent
                                ? "bg-red-100 text-red-800 border-2 border-red-300"
                                : "bg-gray-100 text-gray-700 hover:bg-red-50"
                            }`}
                          >
                            ❌ Vắng
                          </button>
                        </div>
                      </td>
                      {/* <td className="py-3 px-4">
                        <input
                          type="text"
                          value={student.note}
                          onChange={(e) =>
                            handleNoteChange(student.id, e.target.value)
                          }
                          placeholder="Ghi chú..."
                          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : selectedClass && scheduleError ? (
        <div className="text-center py-12">
          <div className="text-red-500">
            <div className="text-4xl mb-4">📅</div>
            <div className="text-lg font-medium mb-2">Không thể điểm danh</div>
            <div className="text-sm text-gray-600 max-w-md mx-auto">
              Ngày được chọn không nằm trong lịch học của lớp. Vui lòng chọn
              ngày khác.
            </div>
          </div>
        </div>
      ) : selectedClass ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">👥</div>
            <div className="text-lg font-medium mb-2">Không có sinh viên</div>
            <div className="text-sm">
              Không có sinh viên nào trong lớp này hoặc chưa có sinh viên đăng
              ký.
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <div className="text-4xl mb-4">🎓</div>
            <div className="text-lg font-medium mb-2">Chọn lớp học</div>
            <div className="text-sm">
              Vui lòng chọn lớp học để bắt đầu điểm danh
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
