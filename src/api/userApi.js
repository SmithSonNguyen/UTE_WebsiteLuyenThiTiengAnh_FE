import axiosInstance from "@/utils/axiosInstance";

// API để lấy signature upload ảnh
export const getUploadSignature = async () => {
  const response = await axiosInstance.get("/users/upload-signature");
  return response;
};

// API để upload ảnh lên Cloudinary
export const uploadImageToCloudinary = async (
  file,
  signature,
  timestamp,
  cloudname,
  apikey
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("api_key", apikey);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data.secure_url; // Trả về URL của ảnh đã upload
};

// API để cập nhật thông tin cá nhân
export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put(
    "/users/update-profile",
    profileData
  );
  return response;
};

// API để đăng xuất
export const logoutUser = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response;
};
