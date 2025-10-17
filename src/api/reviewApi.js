import axiosInstance from "@/utils/axiosInstance";
// API để lấy đánh giá của khóa học
export const getCourseReviews = async (
  courseId,
  sort = "newest",
  page = 1,
  limit = 10
) => {
  const response = await axiosInstance.get(`/reviews/${courseId}`, {
    params: {
      sort,
      page,
      limit,
    },
  });
  return response;
};
