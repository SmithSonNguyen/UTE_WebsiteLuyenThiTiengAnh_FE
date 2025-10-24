import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Facebook,
  Youtube,
  Home,
} from "lucide-react";

const TOEICSchedulePage = () => {
  const [selectedLocation, setSelectedLocation] = useState("0");
  const [selectedCourse, setSelectedCourse] = useState("0");

  // Sample data
  const locations = {
    "Hà Nội": [
      { id: "1", name: "CS1: 188 Nguyễn Lương Bằng, Ô Chợ Dừa, Đống Đa, HN" },
      { id: "2", name: "CS2: 461 Hoàng Quốc Việt, Cầu Giấy" },
      { id: "3", name: "CS3: 141 Bạch Mai, Hai Bà Trưng" },
    ],
    "TP. Hồ Chí Minh": [
      { id: "6", name: "CS1: 49A Phan Đăng Lưu, Q. Bình Thạnh" },
      { id: "7", name: "CS2: 125 Bà Hom, Phường 13, Quận 6" },
      { id: "8", name: "CS3: 1095-1097 Huỳnh Tấn Phát, Quận 7" },
      { id: "9", name: "CS4: 427 Cộng Hòa, Q.Tân Bình" },
      { id: "10", name: "CS5: 215 Khánh Hội, Q4" },
    ],
  };

  const courses = [
    { id: "238", name: "Level Pre (300-350)" },
    { id: "239", name: "Level A (450-500)" },
    { id: "240", name: "Level B (600-650)" },
    { id: "241", name: "Khóa TOEIC Speaking, Writing" },
    { id: "243", name: "Luyện đề TOEIC" },
  ];

  const scheduleData = [
    {
      location: "CS1: 49A Phan Đăng Lưu, Q. Bình Thạnh",
      courses: [
        {
          level: "Level Pre (300-350)",
          classes: [
            {
              code: "PRE86012",
              schedule:
                "Thứ 3, 19:45 - 21:15\nThứ 5, 19:45 - 21:15\nThứ 7, 19:45 - 21:15",
              startDate: "16/10/2025",
            },
            {
              code: "PRE91114",
              schedule:
                "Thứ 2, 20:00 - 21:30\nThứ 4, 20:00 - 21:30\nThứ 6, 20:00 - 21:30",
              startDate: "31/10/2025",
            },
          ],
        },
        {
          level: "Level A (450-500)",
          classes: [
            {
              code: "APLUS88525",
              schedule:
                "Thứ 2, 19:45 - 21:15\nThứ 4, 19:45 - 21:15\nThứ 6, 19:45 - 21:15",
              startDate: "15/10/2025",
            },
            {
              code: "A91115",
              schedule:
                "Thứ 2, 20:00 - 21:30\nThứ 4, 20:00 - 21:30\nThứ 6, 20:00 - 21:30",
              startDate: "24/10/2025",
            },
          ],
        },
      ],
    },
    {
      location: "CS4: 427 Cộng Hòa, Q.Tân Bình",
      courses: [
        {
          level: "Level Pre (300-350)",
          classes: [
            {
              code: "PRE90754",
              schedule:
                "Thứ 2, 19:45 - 21:15\nThứ 4, 19:45 - 21:15\nThứ 6, 19:45 - 21:15",
              startDate: "13/10/2025",
            },
          ],
        },
        {
          level: "Level B (600-650)",
          classes: [
            {
              code: "BPLUS90751",
              schedule:
                "Thứ 2, 17:45 - 19:15\nThứ 4, 17:45 - 19:15\nThứ 6, 17:45 - 19:15",
              startDate: "20/10/2025",
            },
          ],
        },
      ],
    },
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
    birthday: "",
    location: "",
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
      birthday: "",
      location: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Home className="w-6 h-6 text-blue-600" />
              <a
                href="#intro"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Giới thiệu
              </a>
              <a
                href="#courses"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Khoá học
              </a>
              <a
                href="#schedule"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Lịch khai giảng
              </a>
              <a
                href="#register"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Đăng ký
              </a>
            </div>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-blue-600 cursor-pointer hover:scale-110 transition" />
              <Youtube className="w-5 h-5 text-red-600 cursor-pointer hover:scale-110 transition" />
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">DDT TOEIC</h1>
            <p className="text-xl">Đào tạo TOEIC số 1 Việt Nam</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section id="intro" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
            LỊCH KHAI GIẢNG CÁC LỚP TOEIC TẠI TP. HCM
          </h2>
        </div>
      </section>

      {/* Main Content */}
      <section id="schedule" className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Schedule Section */}
            <div className="lg:col-span-2">
              {/* Filter */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn cơ sở
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="0">Chọn cơ sở</option>
                      {Object.entries(locations).map(([city, locs]) => (
                        <optgroup key={city} label={city}>
                          {locs.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn khóa học
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      <option value="0">Chọn khóa học</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule Tables */}
              {scheduleData.map((location, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
                >
                  <div className="bg-blue-600 text-white text-center py-4">
                    <h3 className="text-xl font-bold">{location.location}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Level
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Lớp
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Thời gian học
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Khai giảng
                          </th>
                          <th className="px-4 py-3 text-center font-semibold text-gray-700">
                            Đăng ký
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {location.courses.map((course, courseIdx) => (
                          <React.Fragment key={courseIdx}>
                            {course.classes.map((cls, clsIdx) => (
                              <tr
                                key={clsIdx}
                                className="border-t hover:bg-gray-50 transition"
                              >
                                {clsIdx === 0 && (
                                  <td
                                    rowSpan={course.classes.length}
                                    className="px-4 py-3 font-semibold text-blue-600 border-r"
                                  >
                                    {course.level}
                                  </td>
                                )}
                                <td className="px-4 py-3 font-mono text-sm">
                                  {cls.code}
                                </td>
                                <td className="px-4 py-3 text-sm whitespace-pre-line">
                                  {cls.schedule}
                                </td>
                                <td className="px-4 py-3 text-sm font-semibold">
                                  {cls.startDate}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                    Đăng ký
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white sticky top-24">
                <h3 className="text-2xl font-bold mb-2">Đăng ký tư vấn</h3>
                <p className="text-blue-100 mb-6">Hoàn toàn miễn phí</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Họ và tên đệm *"
                      required
                      className="px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      placeholder="Tên *"
                      required
                      className="px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
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
                    placeholder="Ngày sinh (dd/mm/yy)"
                    className="w-full px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                    value={formData.birthday}
                    onChange={(e) =>
                      setFormData({ ...formData, birthday: e.target.value })
                    }
                  />
                  <select
                    required
                    className="w-full px-4 py-2 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-300"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  >
                    <option value="">Chọn cơ sở</option>
                    {Object.entries(locations).map(([city, locs]) => (
                      <optgroup key={city} label={city}>
                        {locs.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">DDT TOEIC</h3>
              <p className="text-gray-400 mb-2">Đào tạo TOEIC số 1 Việt Nam</p>
              <div className="flex items-center space-x-2 mb-2">
                <Phone className="w-4 h-4" />
                <span>0934 489 666</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>toeic@ddt.com</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Cơ sở Hồ Chí Minh</h4>
              <ul className="text-sm space-y-2 text-gray-400">
                <li>CS1: 49A Phan Đăng Lưu, Q. Bình Thạnh</li>
                <li>CS2: 125 Bà Hom, Quận 6</li>
                <li>CS3: 1095-1097 Huỳnh Tấn Phát, Quận 7</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Cơ sở Hà Nội</h4>
              <ul className="text-sm space-y-2 text-gray-400">
                <li>CS1: 188 Nguyễn Lương Bằng, Đống Đa</li>
                <li>CS2: 461 Hoàng Quốc Việt, Cầu Giấy</li>
                <li>CS3: 141 Bạch Mai, Hai Bà Trưng</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2025 Anh Ngữ DDT - All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TOEICSchedulePage;
