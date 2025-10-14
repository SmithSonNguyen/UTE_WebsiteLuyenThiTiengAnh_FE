import axiosInstance from "@/utils/axiosInstance";

// API để lấy danh sách khóa học nổi bật
export const getFeaturedCourses = async () => {
  const response = await axiosInstance.get("/courses/featured");
  return response;
};

// API để lấy chi tiết khóa học theo ID
export const getCourseDetails = async (courseId) => {
  const response = await axiosInstance.get(`/courses/${courseId}`);
  return response;
};
