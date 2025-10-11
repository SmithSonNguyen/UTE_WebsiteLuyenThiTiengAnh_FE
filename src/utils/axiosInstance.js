import axios from "axios";
import { setAccessToken, logoutSuccess } from "@/redux/authSlice";

// Tạo instance axios mà không thêm interceptor ngay lập tức
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Để gửi cookie từ server
});

let isRefreshing = false;
let failedQueue = [];

// Function to add failed requests to the queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Hàm để thêm interceptor sau khi store được khởi tạo
export const initializeAxiosInterceptors = (store) => {
  instance.interceptors.request.use(
    function (config) {
      const accessToken = store.getState().auth.login.accessToken;
      console.log(
        "Request interceptor - Current access token:",
        accessToken ? "EXISTS" : "NULL"
      );
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("Added Authorization header");
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
    async (error) => {
      const originalRequest = error.config;

      const status = error?.response?.status;
      //const message = error?.response?.data?.message || "";

      if (
        status === 401 &&
        !originalRequest._retry
        // message.toLowerCase().includes("token")
      ) {
        originalRequest._retry = true;
        if (isRefreshing) {
          // Nếu đang refresh => đưa request vào hàng đợi
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token) => {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = "Bearer " + token;
                resolve(instance(originalRequest));
              },
              reject,
            });
          });
        }
        isRefreshing = true;

        try {
          console.log("Attempting to refresh token...");
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`,
            {},
            {
              withCredentials: true,
            }
          );
          console.log("Refresh token response:", res.data);
          const newAccessToken = res.data.access_token; // Sửa từ accessToken thành access_token
          console.log("New access token:", newAccessToken);
          store.dispatch(setAccessToken(newAccessToken));
          processQueue(null, newAccessToken);

          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;
          console.log("Retrying original request with new token");
          return instance(originalRequest);
        } catch (err) {
          processQueue(err, null);
          store.dispatch(logoutSuccess());
          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error?.response?.data || error);
    }
  );
};

export default instance;
