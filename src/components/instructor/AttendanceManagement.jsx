import React, { useState, useEffect } from "react";

const AttendanceManagement = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);

  // Mock data
  useEffect(() => {
    const mockClasses = [
      { id: 1, name: "TOEIC 450 - Sáng", code: "TOEIC450-S01" },
      { id: 2, name: "TOEIC 650 - Chiều", code: "TOEIC650-C01" },
      { id: 3, name: "TOEIC 850 - Tối", code: "TOEIC850-T01" },
    ];
    setClasses(mockClasses);
  }, []);

  const loadStudents = () => {
    setLoading(true);
    // Mock students data
    const mockStudents = [
      {
        id: 1,
        studentId: "SV001",
        name: "Nguyễn Văn An",
        email: "an.nguyen@email.com",
        phone: "0123456789",
        isPresent: false,
        note: "",
      },
      {
        id: 2,
        studentId: "SV002",
        name: "Trần Thị Bình",
        email: "binh.tran@email.com",
        phone: "0123456790",
        isPresent: false,
        note: "",
      },
      {
        id: 3,
        studentId: "SV003",
        name: "Lê Văn Cường",
        email: "cuong.le@email.com",
        phone: "0123456791",
        isPresent: false,
        note: "",
      },
      {
        id: 4,
        studentId: "SV004",
        name: "Phạm Thị Dung",
        email: "dung.pham@email.com",
        phone: "0123456792",
        isPresent: false,
        note: "",
      },
      {
        id: 5,
        studentId: "SV005",
        name: "Hoàng Văn Em",
        email: "em.hoang@email.com",
        phone: "0123456793",
        isPresent: false,
        note: "",
      },
    ];

    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  };

  const handleClassChange = (classId) => {
    setSelectedClass(classId);
    if (classId) {
      loadStudents();
    } else {
      setStudents([]);
    }
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

  const handleSaveAttendance = () => {
    const attendanceData = {
      classId: selectedClass,
      date: selectedDate,
      students: students.map((student) => ({
        studentId: student.id,
        isPresent: student.isPresent,
        note: student.note,
      })),
    };

    console.log("Saving attendance:", attendanceData);
    alert("Điểm danh đã được lưu thành công!");
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
                      Mã SV
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Ghi chú
                    </th>
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
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                        {student.studentId}
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
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={student.note}
                          onChange={(e) =>
                            handleNoteChange(student.id, e.target.value)
                          }
                          placeholder="Ghi chú..."
                          className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : selectedClass ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            Không có sinh viên nào trong lớp này
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500">
            Vui lòng chọn lớp học để bắt đầu điểm danh
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
