import React, { useState, useEffect } from "react";
import {
  getInstructorProfile,
  updateInstructorProfile,
} from "../../api/instructorApi";
import { toast } from "react-toastify";

const InstructorProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    position: "",
    specialization: "",
    experience: "",
    education: "",
    joinDate: "",
    bio: "",
    avatar: "/api/placeholder/150/150",
    linkSocial: "",
    certificates: [],
  });

  const [teachingStats, setTeachingStats] = useState({
    totalClasses: 0,
    activeClasses: 0,
    totalStudents: 0,
    averageScore: 0,
  });

  // Fetch instructor profile on component mount
  useEffect(() => {
    fetchInstructorProfile();
  }, []);

  const fetchInstructorProfile = async () => {
    try {
      setLoading(true);
      const response = await getInstructorProfile();
      const data = response.result;

      setProfileData({
        id: data._id || "",
        firstname: data.profile.firstname || "",
        lastname: data.profile.lastname || "",
        email: data.profile.email || "",
        phone: data.profile.phone || "",
        position: data.instructorInfo.position || "",
        specialization: data.instructorInfo.specialization || "",
        experience: data.instructorInfo.experience || "",
        education: data.instructorInfo.education || "",
        joinDate: data.instructorInfo.joinDate || "",
        bio: data.profile.bio || "",
        avatar: data.profile.avatar || "/api/placeholder/150/150",
        linkSocial: data.profile.linkSocial || "",
        certificates: data.instructorInfo.certificates || [],
      });

      if (data.teachingStats) {
        setTeachingStats(data.teachingStats);
      }
    } catch (error) {
      console.error("Error fetching instructor profile:", error);
      toast.error("Không thể tải thông tin giảng viên");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updateData = {
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        phone: profileData.phone,
        address: profileData.address,
        department: profileData.department,
        position: profileData.position,
        specialization: profileData.specialization,
        experience: profileData.experience,
        education: profileData.education,
        bio: profileData.bio,
        avatar: profileData.avatar,
        linkSocial: profileData.linkSocial,
      };

      await updateInstructorProfile(updateData);
      setIsEditing(false);
      toast.success("Thông tin đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset data by refetching from server
    fetchInstructorProfile();
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Thông tin cá nhân
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                💾 Lưu thay đổi
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ✏️ Chỉnh sửa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={profileData.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    📷
                  </button>
                )}
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {profileData.lastname} {profileData.firstname}
                </h3>
                <p className="text-gray-500">{profileData.position}</p>
                <p className="text-gray-500">{profileData.department}</p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <span className="mr-2">📧</span>
                  {profileData.email}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <span className="mr-2">📞</span>
                  {profileData.phone}
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <span className="mr-2">📅</span>
                  Tham gia từ{" "}
                  {new Date(profileData.joinDate).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Teaching Stats */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Thống kê giảng dạy
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng số lớp:</span>
                <span className="font-semibold text-blue-600">
                  {teachingStats.totalClasses}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lớp đang dạy:</span>
                <span className="font-semibold text-green-600">
                  {teachingStats.activeClasses}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng sinh viên:</span>
                <span className="font-semibold text-purple-600">
                  {teachingStats.totalStudents}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              Thông tin chi tiết
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.lastname}
                    onChange={(e) =>
                      handleInputChange("lastname", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.lastname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.firstname}
                    onChange={(e) =>
                      handleInputChange("firstname", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.firstname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liên kết mạng xã hội
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profileData.linkSocial}
                    onChange={(e) =>
                      handleInputChange("linkSocial", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.linkSocial}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chức vụ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.position}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chuyên môn
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.specialization}
                    onChange={(e) =>
                      handleInputChange("specialization", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.specialization}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kinh nghiệm
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.experience}
                    onChange={(e) =>
                      handleInputChange("experience", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.experience}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trình độ học vấn
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.education}
                    onChange={(e) =>
                      handleInputChange("education", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.education}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới thiệu bản thân
              </label>
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.bio}</p>
              )}
            </div>

            {/* Certificates */}
            {/* <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chứng chỉ
              </label>
              <div className="flex flex-wrap gap-2">
                {teachingStats.certificates.map((cert, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    🏆 {cert}
                  </span>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
