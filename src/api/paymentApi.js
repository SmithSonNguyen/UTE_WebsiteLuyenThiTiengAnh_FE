import axiosInstance from "@/utils/axiosInstance";

/**
 * Tạo payment và lấy VNPay URL
 * @param {Object} paymentData - { courseId?, classId?, amount, orderInfo? }
 * @returns {Promise} - { paymentId, vnpayUrl, vnp_TxnRef }
 */
export const createPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payment/vnpay", paymentData);
    return response.result;
  } catch (error) {
    console.error("Create payment error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Lấy lịch sử thanh toán
 * @param {Object} params - { status?, page?, limit? }
 */
export const getPaymentHistory = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/payment/history", { params });
    return response.result;
  } catch (error) {
    console.error("Get payment history error:", error);
    throw error.response?.data || error;
  }
};

/**
 * Kiểm tra quyền truy cập course
 * @param {string} courseId
 */
export const checkCourseAccess = async (courseId) => {
  try {
    const response = await axiosInstance.get(`/payment/access/${courseId}`);
    return response.result;
  } catch (error) {
    console.error("Check course access error:", error);
    throw error.response?.data || error;
  }
};
