import axiosInstance from "@/utils/axiosInstance";

const BASE_URL = "/makeup-requests";

// Lấy tất cả các lớp học bù có sẵn cho buổi học cụ thể
export const getAvailableMakeupClasses = async (classId, sessionNumber) => {
  try {
    const response = await axiosInstance.get(
      `/makeup-requests/available-makeup-classes/${classId}/${sessionNumber}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching available makeup classes:", error);
    throw error;
  }
};
