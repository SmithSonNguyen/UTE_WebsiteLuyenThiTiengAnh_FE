import axios from "@/utils/axiosInstance";

// API lấy thông tin giảng viên
export const getInstructorProfile = async () => {
  try {
    const response = await axios.get("/instructor/profile");
    return response;
  } catch (error) {
    console.error("Error fetching instructor profile:", error);
    throw error;
  }
};

// API cập nhật thông tin giảng viên
export const updateInstructorProfile = async (profileData) => {
  try {
    const response = await axios.put("/instructor/profile", profileData);
    return response;
  } catch (error) {
    console.error("Error updating instructor profile:", error);
    throw error;
  }
};

// API lấy danh sách lớp học của giảng viên
export const getInstructorClasses = async () => {
  try {
    const response = await axios.get("/instructor/classes");
    return response;
  } catch (error) {
    console.error("Error fetching instructor classes:", error);
    throw error;
  }
};

export default {
  getInstructorProfile,
  updateInstructorProfile,
  getInstructorClasses,
};
