import axiosInstance from "@/utils/axiosInstance";

// API để lấy lịch học của user hiện tại
export const getMySchedule = async () => {
  const response = await axiosInstance.get(`/enrollments/my-schedule`);
  return response;
};

// API để lấy lịch học hôm nay của user hiện tại
export const getTodaySchedule = async () => {
  const response = await axiosInstance.get(`/enrollments/today-schedule`);
  return response;
};
