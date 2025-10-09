import axisInstance from "@/utils/axiosInstance";

export const getAllTests = async () => {
  const response = await axisInstance.get("/tests");
  return response;
};

export const getFilteredTests = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "tat-ca"
    ) {
      queryParams.append(key, value);
    }
  });

  const response = await axisInstance.get(`/tests/filtered?${queryParams}`);
  return response;
};
