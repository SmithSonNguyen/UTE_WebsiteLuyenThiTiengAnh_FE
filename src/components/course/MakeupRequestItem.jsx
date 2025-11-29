import { Calendar, Clock, MapPin, User, X, LogIn } from "lucide-react";
import formatDateToDDMMYY from "@/utils/formatDateToDDMMYY";
import getDayOfWeekVN from "@/utils/getDayOfWeekVN";
import { useState } from "react"; // Thêm import useState
import ConfirmModal from "@/components/common/ConfirmModal"; // Import ConfirmModal
import { toast } from "react-toastify"; // Import toast nếu chưa có
import { cancelMakeupRequest } from "@/api/makeuprequestApi"; // Import API cancel

const MakeupRequestItem = ({ makeup, onCancelClick }) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false); // State local cho modal

  // Compute full start datetime for makeup slot
  const makeupStartTimeStr = makeup.makeupSlot.time.split(" - ")[0]; // e.g., "20:00"
  const makeupDateStr = makeup.makeupSlot.date.split("T")[0]; // e.g., "2025-11-26"
  const fullStartDateTime = new Date(
    `${makeupDateStr}T${makeupStartTimeStr}:00`
  );
  const now = new Date();
  const thirtyMinBefore = new Date(
    fullStartDateTime.getTime() - 30 * 60 * 1000
  );

  const canJoin = now >= thirtyMinBefore;

  // Join handler
  const handleJoinMakeup = () => {
    const meetLink = makeup.makeupSlot.classId.schedule.meetLink;
    if (meetLink) {
      window.open(meetLink, "_blank");
    }
  };

  // Local handlers cho confirm
  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    try {
      await cancelMakeupRequest(makeup._id); // Gọi API với ID của makeup này
      toast.success("Đã hủy đăng ký buổi bù thành công!");
      // Optional: Gọi callback parent nếu cần update state global
      if (onCancelClick) onCancelClick(makeup._id); // Để parent remove item nếu cần
    } catch (error) {
      console.error("❌ Error canceling makeup request:", error);
      toast.error("Đã xảy ra lỗi khi hủy đăng ký buổi bù. Vui lòng thử lại.");
    }
    setIsCancelModalOpen(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        {/* Header với Status Badge */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {makeup.originalSession.classId.courseId.title}
              </h3>
              {/* <p className="text-sm text-gray-500">Mã: #123</p> */}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r text-white shadow-sm ${
                  makeup.status === "scheduled"
                    ? "from-yellow-400 to-orange-400"
                    : "from-green-400 to-blue-500"
                }`}
              >
                {makeup.status === "scheduled" && canJoin
                  ? "Đang diễn ra"
                  : makeup.status === "scheduled"
                  ? "Đã lên lịch"
                  : "Đã hoàn thành"}
              </span>
              {makeup.status === "scheduled" && canJoin && (
                <button
                  onClick={handleJoinMakeup}
                  className="inline-flex items-center px-3 py-1.5 text-xs leading-5 font-semibold rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors duration-200"
                  title="Tham gia lớp học bù"
                >
                  <LogIn className="w-3 h-3 mr-1" />
                  Tham gia
                </button>
              )}
            </div>
            {makeup.status === "scheduled" && !canJoin && (
              <button
                onClick={handleOpenCancelModal} // ← Mở modal local thay vì gọi trực tiếp API
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                title="Hủy đăng ký"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buổi Học Gốc */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-red-500 rounded-full p-1.5">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide">
                Buổi Học Gốc
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-red-700 font-medium">Mã lớp</p>
                  <p className="text-sm font-bold text-red-900">
                    {makeup.originalSession.classId.classCode}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-red-700 font-medium">
                    Buổi và Ngày
                  </p>
                  <p className="text-sm font-bold text-red-900">
                    Buổi {makeup.originalSession.sessionNumber} -{" "}
                    {getDayOfWeekVN(makeup.originalSession.date)},{" "}
                    {formatDateToDDMMYY(makeup.originalSession.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-red-700 font-medium">Thời gian</p>
                  <p className="text-sm font-bold text-red-900">
                    {makeup.originalSession.classId.schedule.startTime}
                    {" - "}
                    {makeup.originalSession.classId.schedule.endTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-red-700 font-medium">Giảng viên</p>
                  <p className="text-sm font-bold text-red-900">
                    {makeup.originalSession.classId.instructor.profile.lastname}{" "}
                    {
                      makeup.originalSession.classId.instructor.profile
                        .firstname
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buổi Học Bù */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border border-green-200">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-500 rounded-full p-1.5">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-sm font-bold text-green-900 uppercase tracking-wide">
                Buổi Học Bù
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-green-700 font-medium">Mã lớp</p>
                  <p className="text-sm font-bold text-green-900">
                    {makeup.makeupSlot.classId.classCode}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-green-700 font-medium">
                    Buổi & Ngày
                  </p>
                  <p className="text-sm font-bold text-green-900">
                    Buổi {makeup.makeupSlot.sessionNumber} -{" "}
                    {getDayOfWeekVN(makeup.makeupSlot.date)},{" "}
                    {formatDateToDDMMYY(makeup.makeupSlot.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-green-700 font-medium">
                    Thời gian
                  </p>
                  <p className="text-sm font-bold text-green-900">
                    {makeup.makeupSlot.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-green-700 font-medium">
                    Giảng viên
                  </p>
                  <p className="text-sm font-bold text-green-900">
                    {makeup.makeupSlot.classId.instructor.profile.lastname}{" "}
                    {makeup.makeupSlot.classId.instructor.profile.firstname}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-600 flex items-center">
          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
          Bạn có thể tham gia lớp học bù trước thời gian diễn ra 30 phút. Sau
          khi lớp học bù diễn ra bạn sẽ không thể hủy đăng ký nữa.
        </p>
      </div>

      {/* Local ConfirmModal cho hủy */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        title="Xác nhận hủy đăng ký buổi bù"
        message="Bạn có chắc chắn muốn hủy đăng ký buổi bù này? Hành động này không thể hoàn tác."
        confirmText="Hủy đăng ký"
        cancelText="Giữ nguyên"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default MakeupRequestItem;
