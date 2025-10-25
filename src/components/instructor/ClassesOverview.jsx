import React, { useState, useEffect } from "react";
import { getInstructorClasses } from "../../api/instructorApi";
import { toast } from "react-toastify";

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

const ClassesOverview = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);

  // Fetch classes from API
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await getInstructorClasses();
      setClasses(response.result || []);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Không thể tải danh sách lớp học");
    } finally {
      setLoading(false);
    }
  };

  // Helper to compute dynamic session status based on current time and schedule
  const computeSessionStatus = (classItem) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });
    const schedule = classItem.schedule;

    // Check if today has a scheduled class
    if (!schedule?.days?.includes(currentDay)) {
      return "Chưa diễn ra";
    }

    // Check if today is within the course period
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const courseStart = new Date(schedule.startDate);
    const courseEnd = new Date(schedule.endDate);
    courseStart.setHours(0, 0, 0, 0);
    courseEnd.setHours(23, 59, 59, 999);

    if (today < courseStart) {
      return "Chưa diễn ra";
    }
    if (today > courseEnd) {
      return "Đã hoàn thành";
    }

    // Parse startTime and endTime (assume format "HH:mm")
    const [startHours, startMinutes] = (schedule.startTime || "")
      .split(":")
      .map(Number);
    const [endHours, endMinutes] = (schedule.endTime || "")
      .split(":")
      .map(Number);

    if (isNaN(startHours) || isNaN(endHours)) {
      return "Chưa diễn ra"; // Fallback if invalid times
    }

    // Create Date objects for today
    const startToday = new Date(today.getTime());
    startToday.setHours(startHours, startMinutes, 0, 0);

    const endToday = new Date(today.getTime());
    endToday.setHours(endHours, endMinutes, 0, 0);

    if (now < startToday) {
      return "Sắp diễn ra";
    } else if (now <= endToday) {
      return "Đang diễn ra";
    } else {
      return "Vừa kết thúc";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang diễn ra":
        return "bg-green-100 text-green-800";
      case "Sắp diễn ra":
        return "bg-yellow-100 text-yellow-800";
      case "Vừa kết thúc":
        return "bg-gray-100 text-gray-800";
      case "Chưa diễn ra":
        return "bg-blue-100 text-blue-800";
      case "Đã hoàn thành":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-orange-100 text-orange-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Danh sách lớp học ({classes.length})
        </h2>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => {
          const sessionStatus = computeSessionStatus(classItem);
          return (
            <div
              key={classItem._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {classItem.classCode} {/* Use classId as display name */}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {classItem.courseId.title}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        sessionStatus
                      )}`}
                    >
                      {sessionStatus}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                        classItem.courseId.level
                      )}`}
                    >
                      {classItem.courseId.level}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Lịch học:</span>
                    <span className="text-gray-900">
                      {getDaysVN(classItem.schedule?.days).join(", ") ||
                        "Chưa có lịch"}{" "}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Khung giờ:</span>
                    <span className="text-gray-900">
                      {classItem.schedule?.startTime || ""} -{" "}
                      {classItem.schedule?.endTime || ""}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Link:</span>
                    <span className="text-gray-900">
                      {classItem.schedule?.meetLink || "Chưa có link"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Sĩ số:</span>
                    <span className="text-gray-900">
                      {classItem.totalStudents || 0}/
                      {classItem.capacity?.maxStudents || 0} sinh viên
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <span className="text-gray-500 w-20">Thời gian:</span>
                    <span className="text-gray-900">
                      {classItem.schedule?.startDate
                        ? new Date(
                            classItem.schedule.startDate
                          ).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Chưa có"}{" "}
                      -{" "}
                      {classItem.schedule?.endDate
                        ? new Date(
                            classItem.schedule.endDate
                          ).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Chưa có"}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {/* <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Tỷ lệ tham gia</span>
                    <span>
                      {Math.round(
                        (classItem.presentStudents / classItem.totalStudents) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (classItem.presentStudents / classItem.totalStudents) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div> */}

                {/* Actions */}
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setSelectedClass(classItem)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200 transition-colors">
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Class Detail Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Chi tiết lớp học</h3>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên lớp
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedClass.classId} {/* Use classId as display name */}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã lớp
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedClass.classCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trình độ
                  </label>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                      selectedClass.courseId.level
                    )}`}
                  >
                    {selectedClass.courseId.level}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trạng thái
                  </label>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      computeSessionStatus(selectedClass)
                    )}`}
                  >
                    {computeSessionStatus(selectedClass)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedClass.courseId.description || "Chưa có mô tả"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lịch học
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {getDaysVN(selectedClass.schedule?.days).join(", ") ||
                      "Chưa có"}{" "}
                    ({selectedClass.schedule?.startTime || ""} -{" "}
                    {selectedClass.schedule?.endTime || ""})
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phòng học
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    Chưa có {/* No room in API data */}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesOverview;
