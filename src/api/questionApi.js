import axiosInstance from "@/utils/axiosInstance";

export const getAllQuestions = async (testId) => {
  try {
    const response = await axiosInstance.get(`/tests/${testId}/questions`);
    return response;
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};
