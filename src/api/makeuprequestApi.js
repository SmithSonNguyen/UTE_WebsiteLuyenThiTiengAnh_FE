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

export const registerMakeupClass = async (makeupRequestData) => {
  try {
    const response = await axiosInstance.post(
      `/makeup-requests/`,
      makeupRequestData
    );
    return response;
  } catch (error) {
    console.error("Error registering makeup class:", error);
    throw error;
  }
};

export const getMakeupRequestsByStudent = async () => {
  try {
    const response = await axiosInstance.get(`/makeup-requests/`);
    return response;
  } catch (error) {
    console.error("Error fetching makeup requests:", error);
    throw error;
  }
};

export const cancelMakeupRequest = async (makeupRequestId) => {
  try {
    const response = await axiosInstance.delete(
      `/makeup-requests/${makeupRequestId}`
    );
    return response;
  } catch (error) {
    console.error("Error canceling makeup request:", error);
    throw error;
  }
};
