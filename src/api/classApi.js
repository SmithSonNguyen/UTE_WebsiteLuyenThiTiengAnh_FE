import axiosInstance from "@/utils/axiosInstance";

// Lấy danh sách lớp học theo courseId
export const getCourseClasses = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/classes?courseId=${courseId}`);
    return response;
  } catch (error) {
    console.error("Error fetching course classes:", error);
    throw error;
  }
};

// Lấy danh sách lớp học theo level (beginner, intermediate, advanced)
export const getClassesByLevel = async (level) => {
  try {
    const response = await axiosInstance.get(`/classes/level/${level}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching classes by level:", error);
    throw error;
  }
};

// Đăng ký vào lớp học
export const enrollClass = async (classId, userId) => {
  try {
    const response = await axiosInstance.post(`/classes/${classId}/enroll`, {
      userId,
    });
    return response.data.result;
  } catch (error) {
    console.error("Error enrolling class:", error);
    throw error;
  }
};

// Lấy chi tiết lớp học
export const getClassDetail = async (classId) => {
  try {
    const response = await axiosInstance.get(`/classes/${classId}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching class detail:", error);
    throw error;
  }
};

// Lấy thông tin lớp học cho học viên (bao gồm enrollment status)
export const getClassForStudent = async (classId) => {
  try {
    const response = await axiosInstance.get(`/classes/${classId}/student`);
    return response.result;
  } catch (error) {
    console.error("Error fetching class for student:", error);
    throw error;
  }
};

// Lấy danh sách lớp học sắp khai giảng theo courseId
export const getUpcomingClassesByCourse = async (courseId) => {
  try {
    const response = await axiosInstance.get(
      `/classes/course/${courseId}/upcoming`
    );
    return response.result;
  } catch (error) {
    console.error("Error fetching upcoming classes by course:", error);
    throw error;
  }
};

// Lấy danh sách lớp học sắp khai giảng theo level
export const getUpcomingClassesByLevel = async (level) => {
  try {
    const response = await axiosInstance.get(
      `/classes/level/${level}/upcoming`
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching upcoming classes by level:", error);
    throw error;
  }
};

// Cập nhật link lớp học (dành cho giảng viên)
export const updateClassLink = async (classId, meetLink) => {
  try {
    const response = await axiosInstance.post(
      `/classes/${classId}/update-link`,
      { meetLink } // Gửi như object thay vì value trực tiếp
    );
    return response.result; // Consistent với các API khác
  } catch (error) {
    console.error("Error updating class link:", error);
    throw error;
  }
};
