import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Facebook,
  Youtube,
  Home,
} from "lucide-react";
import { getAllUpcomingLiveClasses } from "@/api/classApi";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import bannerImage from "@/assets/banner.png";

const TOEICSchedulePage = () => {
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        const data = await getAllUpcomingLiveClasses();
        setScheduleData(data.classes || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        toast.error("Không thể tải lịch khai giảng");
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  // Helper function to format days in Vietnamese
  const formatDaysVN = (days) => {
    const dayMap = {
      Monday: "Thứ 2",
      Tuesday: "Thứ 3",
      Wednesday: "Thứ 4",
      Thursday: "Thứ 5",
      Friday: "Thứ 6",
      Saturday: "Thứ 7",
      Sunday: "Chủ nhật",
    };
    return days.map((day) => dayMap[day] || day).join(", ");
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  // Helper function to format level name
  const formatLevelName = (level) => {
    const levelMap = {
      beginner: "Cơ bản (0-450)",
      intermediate: "Trung cấp (450-650)",
      advanced: "Nâng cao (650+)",
    };
    return levelMap[level] || level;
  };

  // Group classes by course level
  const groupedData = scheduleData.reduce((acc, classItem) => {
    const level = classItem.courseId?.level || "unknown";
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(classItem);
    return acc;
  }, {});

  // Filter by selected course
  const filteredData =
    selectedCourse === "all"
      ? groupedData
      : {
          [selectedCourse]: groupedData[selectedCourse] || [],
        };

  const courses = [
    { id: "all", name: "Tất cả khóa học" },
    { id: "beginner", name: "Cơ bản (0-450)" },
    { id: "intermediate", name: "Trung cấp (450-650)" },
    { id: "advanced", name: "Nâng cao (650+)" },
  ];

  const features = [
    {
      title: "ĐỘI NGŨ SỨ GIẢ TRÀN ĐẦY NHIỆT HUYẾT VÀ ĐAM MÊ",
      color: "bg-green-500",
      description:
        "Ở DDT TOEIC các bạn sẽ được thực hành cùng đội ngũ sứ giả tài năng...",
    },
    {
      title: "KÊNH BÀI GIẢNG HỖ TRỢ HỌC ONLINE HOÀN TOÀN MIỄN PHÍ",
      color: "bg-orange-500",
      description:
        "Với mỗi khóa học, DDT TOEIC sẽ tặng bạn tài khoản học online hoàn toàn MIỄN PHÍ...",
    },
    {
      title: "GIÁO TRÌNH GIẢNG DẠY TOEIC TỰ BIÊN SOẠN",
      color: "bg-blue-600",
      description:
        "Toàn bộ giáo trình học do chính DDT - Founder biên soạn và thiết kế...",
    },
    {
      title: "PHƯƠNG PHÁP ĐÀO TẠO TOEIC KHÁC BIỆT",
      color: "bg-pink-500",
      description:
        "DDT TOEIC với mô hình đào tạo RIPL áp dụng sự hiện đại, tính thực tế...",
    },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-80 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt="TOEIC Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80"></div>
        </div>

        {/* Content */}
      </section>

      {/* Introduction */}
      <section id="intro" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
            LỊCH KHAI GIẢNG CÁC LỚP LUYỆN THI TOEIC TẠI DTT TOEIC
          </h2>
        </div>
      </section>

      {/* Main Content */}
      <section id="schedule" className="py-8 bg-white max-w-7xl mx-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Schedule Section */}
            <div className="lg:col-span-2">
              {/* Filter */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn khóa học
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">
                    Đang tải lịch khai giảng...
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!loading && scheduleData.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">Chưa có lịch khai giảng nào</p>
                </div>
              )}

              {/* Schedule Tables */}
              {!loading &&
                Object.entries(filteredData).map(([level, classes]) => {
                  if (classes.length === 0) return null;

                  return (
                    <div
                      key={level}
                      className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
                    >
                      <div className="bg-blue-600 text-white text-center py-4">
                        <h3 className="text-xl font-bold">
                          {formatLevelName(level)}
                        </h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Mã lớp
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Khóa học
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Thời gian học
                              </th>
                              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                                Khai giảng
                              </th>
                              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                                Sĩ số
                              </th>
                              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                                Đăng ký
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {classes.map((classItem, idx) => (
                              <tr
                                key={idx}
                                className="border-t hover:bg-gray-50 transition"
                              >
                                <td className="px-4 py-3 font-mono text-sm font-semibold">
                                  {classItem.classCode}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {classItem.courseId?.title || "N/A"}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div>
                                    {formatDaysVN(classItem.schedule.days)}
                                  </div>
                                  <div className="text-gray-600">
                                    {classItem.schedule.startTime} -{" "}
                                    {classItem.schedule.endTime}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold">
                                  {formatDate(classItem.schedule.startDate)}
                                </td>
                                <td className="px-4 py-3 text-center text-sm">
                                  {classItem.capacity.currentStudents} /{" "}
                                  {classItem.capacity.maxStudents}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                      classItem.capacity.currentStudents >=
                                      classItem.capacity.maxStudents
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700 text-white"
                                    }`}
                                    disabled={
                                      classItem.capacity.currentStudents >=
                                      classItem.capacity.maxStudents
                                    }
                                  >
                                    {classItem.capacity.currentStudents >=
                                    classItem.capacity.maxStudents
                                      ? "Đã đầy"
                                      : "Đăng ký"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white sticky top-32">
                <h3 className="text-2xl font-bold mb-2">Đăng ký tư vấn</h3>
                <p className="text-blue-100 mb-6">Hoàn toàn miễn phí</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Họ và tên đệm *"
                      required
                      className="px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Tên *"
                      required
                      className="px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="Số điện thoại *"
                      required
                      className="px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      className="px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Nội dung tư vấn *"
                    className="w-full px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300 line-clamp-3"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-blue-600 font-bold py-3 rounded-md hover:bg-blue-50 transition transform hover:scale-105"
                  >
                    Đăng ký ngay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="courses" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            4 Lý do bạn nên lựa chọn DDT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <div
                  className={`${feature.color} text-white p-4 text-center font-bold`}
                >
                  {feature.title}
                </div>
                <div className="p-6 text-gray-600 text-sm">
                  {feature.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TOEICSchedulePage;
