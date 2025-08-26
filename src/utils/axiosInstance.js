import axios from "axios";
import { logoutSuccess } from "@/redux/authSlice";

// Tạo instance axios mà không thêm interceptor ngay lập tức
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Để gửi cookie từ server
});

// Hàm để thêm interceptor sau khi store được khởi tạo
export const initializeAxiosInterceptors = (store) => {
  instance.interceptors.request.use(
    function (config) {
      const accessToken = store.getState().auth.login.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      if (response && response.data) return response.data;
      return response;
    },
    function (error) {
      if (error?.response?.status === 401) {
        store.dispatch(logoutSuccess());
        window.location.href = "/login";
      }
      return Promise.reject(error?.response?.data || error);
    }
  );
};

export default instance;
