import axiosInstance from "../utils/axiosInstance";

// Gửi OTP - sử dụng users route
export const sendOTPApi = async (userData, purpose) => {
  if (purpose === "register") {
    const response = await axiosInstance.post("/users/send-otp-register", {
      ...userData,
      purpose,
    });
    return response;
  } else {
    const response = await axiosInstance.post(
      "/users/send-otp-reset-password",
      {
        ...userData,
        purpose,
      }
    );
    return response;
  }
};

// Verify OTP - sử dụng users route
export const verifyOTPRegister = async (userData) => {
  const response = await axiosInstance.post(
    "/users/verify-otp-register",
    userData
  );
  return response;
};

export const verifyOTPResetPassword = async (email, otp) => {
  const response = await axiosInstance.post(
    "/users/verify-otp-reset-password",
    { email, otp }
  );
  return response;
};

// Đăng ký với OTP
// export const registerWithOTPApi = async (userData) => {
//   const response = await axiosInstance.post("/otp/register-with-otp", userData);
//   return response.data;
// };

// Reset password với OTP
export const resetPassword = async (email, new_password, confirm_password) => {
  const response = await axiosInstance.post("/users/reset-password", {
    email,
    new_password,
    confirm_password,
  });
  return response;
};
