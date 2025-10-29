import axiosInstance from "@/utils/axiosInstance";

// Lấy danh sách sinh viên trong lớp
export const getClassStudents = async (classId) => {
  if (!classId || classId.trim() === "") {
    throw new Error("Class ID is required");
  }

  try {
    const response = await axiosInstance.get(
      `/attendance/class/${classId}/students`
    );
    return response.result;
  } catch (error) {
    console.error("Error fetching class students:", error);
    throw error;
  }
};

// Lấy điểm danh theo ngày
export const getAttendanceByDate = async (classId, date) => {
  try {
    const response = await axiosInstance.get(
      `/attendance/class/${classId}?date=${date}`
    );
    return response.result;
  } catch (error) {
    console.error("Error fetching attendance by date:", error);
    throw error;
  }
};

// Lưu điểm danh
export const saveAttendance = async (classId, attendanceData) => {
  try {
    const response = await axiosInstance.post(
      `/attendance/class/${classId}`,
      attendanceData
    );
    return response.result;
  } catch (error) {
    console.error("Error saving attendance:", error);
    throw error;
  }
};

// Lấy lịch sử điểm danh
export const getAttendanceHistory = async (classId, fromDate, toDate) => {
  try {
    let url = `/attendance/class/${classId}/history`;
    const params = [];
    if (fromDate) params.push(`fromDate=${fromDate}`);
    if (toDate) params.push(`toDate=${toDate}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const response = await axiosInstance.get(url);
    return response.result;
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    throw error;
  }
};

// Lấy tổng quan điểm danh
export const getClassAttendanceOverview = async (classId) => {
  try {
    const response = await axiosInstance.get(
      `/attendance/class/${classId}/overview`
    );
    return response.result;
  } catch (error) {
    console.error("Error fetching attendance overview:", error);
    throw error;
  }
};
