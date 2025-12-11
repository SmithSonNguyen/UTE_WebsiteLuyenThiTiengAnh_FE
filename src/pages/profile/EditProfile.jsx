import { useState } from "react";
import defaultavatar from "@/assets/defaultavatar.png";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { useSelector, useDispatch } from "react-redux";
import {
  getUploadSignature,
  uploadImageToCloudinary,
  updateUserProfile,
} from "@/api/userApi";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "@/redux/authSlice";
import { toast } from "react-toastify";

function formatDateISOtoInput(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const [avatar, setAvatar] = useState(user?.avatar || defaultavatar);
  const [avatarFile, setAvatarFile] = useState(null); // Store the actual file
  const [lastname, setLastname] = useState(user?.lastname || "");
  const [firstname, setFirstname] = useState(user?.firstname || "");
  const [birthday, setBirthday] = useState(
    formatDateISOtoInput(user?.birthday)
  );
  const [phone, setPhone] = useState(user?.phone || "");
  //const [bioCount, setBioCount] = useState((user?.bio || "").length);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file); // Store the actual file for upload
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      let avatarUrl = user?.avatar; // Keep current avatar URL by default

      // If user selected a new avatar, upload it to Cloudinary
      if (avatarFile) {
        try {
          // Get upload signature from backend
          const response = await getUploadSignature();
          const { signature, timestamp, cloudname, apikey } = response;

          // Upload image to Cloudinary
          avatarUrl = await uploadImageToCloudinary(
            avatarFile,
            signature,
            timestamp,
            cloudname,
            apikey
          );
        } catch (error) {
          console.error("Upload error:", error);
          setError("Không thể upload ảnh đại diện. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      }

      // Prepare profile data
      const profileData = {
        lastname,
        firstname,
        birthday,
        phone,
        avatar: avatarUrl,
      };

      // Update user profile
      const response = await updateUserProfile(profileData);

      if (response && response.user) {
        // Update Redux store with new user data
        dispatch(setCurrentUser({ user: response.user }));
        setMessage("Cập nhật thành công!");
      } else {
        setMessage("Cập nhật thành công!");
      }

      // Redirect to profile page after successful update
      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại."
      );
      const backendErrors = err.errors;
      if (backendErrors) {
        // Lặp qua tất cả errors và toast từng cái
        Object.values(backendErrors).forEach((err) => {
          if (err.msg) toast.error(err.msg);
        });
        //setErrorMessage("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center">
      {loading && <FullScreenLoader />}
      <form
        className="w-full max-w-xl min-w-0 lg:min-w-[600px] bg-white rounded-2xl shadow p-8 flex flex-col gap-6 mx-2"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-2 text-center">
          Chỉnh sửa trang cá nhân
        </h2>
        {message && (
          <div className="text-green-600 text-center font-semibold mb-2">
            {message}
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center font-semibold mb-2">
            {error}
          </div>
        )}
        <div className="flex flex-col items-center gap-2 mb-2">
          <img
            src={avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
          />
          <label htmlFor="avatar-upload">
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-medium cursor-pointer hover:bg-blue-600 transition">
              Đổi ảnh
            </span>
          </label>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold text-sm">Họ</label>
            <input
              type="text"
              className="border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-full"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Họ"
              autoComplete="family-name"
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-semibold text-sm">Tên</label>
            <input
              type="text"
              className="border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 max-w-full"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Tên"
              autoComplete="given-name"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Ngày sinh</label>
          <input
            type="date"
            className="border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            placeholder="Ngày sinh"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Số điện thoại</label>
          <input
            type="text"
            className="border border-gray-300 rounded-xl px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Số điện thoại"
            maxLength={15}
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
