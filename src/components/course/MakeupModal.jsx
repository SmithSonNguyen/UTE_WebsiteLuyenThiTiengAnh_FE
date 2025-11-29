// Modal component cho chọn buổi bù
import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { getAvailableMakeupClasses } from "@/api/makeuprequestApi";
const formatDateWithDay = (isoString) => {
  const date = new Date(isoString);
  const days = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const dayOfWeek = days[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return {
    dayOfWeek,
    date: `${day}/${month}/${year}`,
    fullDate: `${dayOfWeek}, ${day}/${month}/${year}`,
  };
};

const MakeupModal = ({ isOpen, onClose, missedSession, onSelectMakeup }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({
    slots: [],
    remainingChanges: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableMakeupClasses = async () => {
      // ✅ Chỉ fetch khi modal OPEN và có missedSession
      if (!isOpen || !missedSession) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getAvailableMakeupClasses(
          missedSession.classId,
          missedSession.sessionNumber
        );

        setAvailableSlots(response);
      } catch (error) {
        console.error("❌ Error fetching available makeup classes:", error);
        setError(error.message || "Không thể tải danh sách lớp bù");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableMakeupClasses();

    // ✅ Reset selected slot khi modal mở lại
    return () => {
      setSelectedSlot(null);
    };
  }, [isOpen, missedSession]); // ✅ Trigger khi isOpen hoặc missedSession thay đổi

  const handleConfirm = () => {
    if (selectedSlot) {
      const makeupData = {
        originalClassId: missedSession.classId,
        sessionNumberOriginal: missedSession.sessionNumber,
        dateOriginal: missedSession.date,
        makeupClassId: selectedSlot.classId,
        sessionNumberMakeup: selectedSlot.sessionNumber,
        dateMakeup: selectedSlot.date,
        timeMakeup: selectedSlot.time,
      };
      onSelectMakeup(makeupData);
      setSelectedSlot(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden transform transition-all">
        {/* Header giữ nguyên */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-5 overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg backdrop-blur-sm">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Chọn Buổi Học Bù</h2>
                {missedSession && (
                  <p className="text-xs mt-1 opacity-90">
                    Bù buổi {missedSession.sessionNumber} •{" "}
                    {missedSession.dateLabel || missedSession.date}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content với Loading & Error states */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)] bg-gray-50">
          {/* Info Card - Số lần bù còn lại */}
          {!isLoading && !error && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-r-xl p-5 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Số lần bù học còn lại
                  </p>
                  <p className="text-amber-700">
                    Bạn còn{" "}
                    <span className="text-2xl font-bold text-amber-600 mx-1">
                      {availableSlots.remainingChanges || 0}
                    </span>
                    lần bù học trong khóa này
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Đang tải danh sách lớp bù...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-5 rounded-r-xl mb-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    Lỗi tải dữ liệu
                  </p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Grid Layout cho các buổi học */}
          {!isLoading && !error && availableSlots.slots?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSlots.slots.map((slot) => {
                const isSelected = selectedSlot?.classId === slot.classId;
                const formattedDate = formatDateWithDay(slot.date);
                return (
                  <div
                    key={slot.classId}
                    onClick={() => setSelectedSlot(slot)}
                    className={`relative group cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg"
                        : "bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -left-2 z-10">
                        <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-lg">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {/* Header với ngày */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar
                              className={`w-5 h-5 ${
                                isSelected ? "text-blue-600" : "text-gray-600"
                              }`}
                            />
                            <span className="font-bold text-lg text-gray-900">
                              {formattedDate.dayOfWeek}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-gray-800">
                            {formattedDate.date}
                          </p>
                        </div>
                      </div>

                      {/* Session Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <Clock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500 font-medium">
                              Thời gian
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              {slot.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">
                              Lớp học
                            </p>
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {slot.classCode}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {slot.instructorName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Buổi học tag */}
                      <div className="mt-3 flex justify-center">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Buổi {slot.sessionNumber}
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div
                      className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                        isSelected
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      } bg-gradient-to-br from-blue-400/10 to-purple-400/10 pointer-events-none`}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && availableSlots.slots?.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không có lớp bù khả dụng
              </h3>
              <p className="text-sm text-gray-600">
                Hiện tại chưa có lớp bù nào phù hợp với buổi học này
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-5 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedSlot ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Đã chọn:{" "}
                <span className="font-semibold text-gray-900">
                  {formatDateWithDay(selectedSlot.date).fullDate}
                </span>
              </span>
            ) : (
              "Vui lòng chọn buổi học bù phù hợp"
            )}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot || isLoading}
              className={`px-8 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                selectedSlot && !isLoading
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Xác Nhận Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeupModal;
