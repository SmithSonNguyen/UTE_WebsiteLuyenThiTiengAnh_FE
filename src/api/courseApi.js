import axiosInstance from "@/utils/axiosInstance";

// API để lấy tất cả khóa học với filter và pagination
export const getAllCourses = async (params = {}) => {
  try {
    const { page = 1, limit = 12, type, level, status = "active" } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    });

    if (type) queryParams.append("type", type);
    if (level) queryParams.append("level", level);

    const response = await axiosInstance.get(`/courses?${queryParams}`);
    return response.result;
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw error;
  }
};

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
