import axiosInstance from "@/utils/axiosInstance";

// Học viên lấy danh sách giảng viên theo lớp đã đăng ký
export const getMyInstructors = async () => {
  const response = await axiosInstance.get("/chat/instructors");
  return response.result;
};

// Giảng viên lấy danh sách học sinh của các lớp mình dạy
export const getMyStudents = async () => {
  const response = await axiosInstance.get("/chat/students");
  return response.result;
};

// Lấy lịch sử tin nhắn theo roomId
export const getChatMessages = async (roomId, page = 1, limit = 30) => {
  const response = await axiosInstance.get(
    `/chat/messages/${roomId}?page=${page}&limit=${limit}`
  );
  return response.result;
};

// Đánh dấu đã đọc tin nhắn trong room
export const markMessagesRead = async (roomId) => {
  const response = await axiosInstance.post("/chat/mark-read", { roomId });
  return response;
};
