import React, { useState, useEffect } from "react";
import { Book, Play, Clock, TrendingUp } from "lucide-react";

// Component Card Khóa học
const CourseCard = ({ course }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="relative max-w-[350px] w-full h-full mx-auto my-0 hover:shadow-lg shadow-[0_0_0_1px_hsl(var(--border))] transition-shadow rounded-lg overflow-hidden bg-white">
      <a className="absolute inset-0 z-10" href={`/learn/${course._id}`} />

      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-600 text-white shadow absolute top-[2px] right-[2px] z-[9]">
        Đã mua
      </div>

      <div className="flex flex-col">
        <div className="h-[180px] relative flex bg-gray-200">
          <img
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
            src={course.thumbnail || "https://via.placeholder.com/350x180"}
          />
        </div>

        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h3 className="m-0 text-base leading-5 tracking-tighter font-bold line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {course.description}
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Book className="w-4 h-4" />
              <span>
                {course.preRecordedContent?.totalLessons || 0} bài học
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{course.courseStructure?.totalHours || 0} giờ</span>
            </div>

            <div className="flex gap-3 mt-3">
              <p className="tracking-tighter font-semibold text-blue-600">
                {formatPrice(course.discountPrice || course.price)}
              </p>
              {course.discountPrice && (
                <p className="tracking-tighter line-through text-gray-400">
                  {formatPrice(course.price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component chính - Trang Khóa Học Đã Mua
const PurchasedCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, beginner, intermediate, advanced

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  const fetchPurchasedCourses = async () => {
    try {
      // Giả lập API call
      // const response = await fetch('/api/purchased-courses');
      // const data = await response.json();

      // Dữ liệu mẫu
      const mockData = [
        {
          _id: "1",
          title: "CI/CD Deploy React, Next, Node lên VPS",
          description:
            "Học cách deploy ứng dụng React, Next.js và Node.js lên VPS với CI/CD",
          price: 990000,
          discountPrice: 790000,
          level: "intermediate",
          thumbnail:
            "https://via.placeholder.com/350x180/3B82F6/FFFFFF?text=Deploy+Course",
          courseStructure: {
            totalHours: 12.5,
            totalSessions: 25,
          },
          preRecordedContent: {
            totalLessons: 45,
            totalTopics: 8,
          },
        },
        {
          _id: "2",
          title: "NodeJs Super",
          description:
            "Khóa học NodeJS từ cơ bản đến nâng cao, xây dựng API RESTful",
          price: 1990000,
          discountPrice: 1590000,
          level: "advanced",
          thumbnail:
            "https://via.placeholder.com/350x180/10B981/FFFFFF?text=NodeJS+Course",
          courseStructure: {
            totalHours: 55.5,
            totalSessions: 229,
          },
          preRecordedContent: {
            totalLessons: 229,
            totalTopics: 23,
          },
        },
        {
          _id: "3",
          title: "React Pro",
          description:
            "Khóa học React chuyên sâu, hooks, context, redux toolkit",
          price: 1490000,
          discountPrice: 1190000,
          level: "intermediate",
          thumbnail:
            "https://via.placeholder.com/350x180/8B5CF6/FFFFFF?text=React+Course",
          courseStructure: {
            totalHours: 32,
            totalSessions: 64,
          },
          preRecordedContent: {
            totalLessons: 98,
            totalTopics: 12,
          },
        },
        {
          _id: "4",
          title: "TOEIC Beginner Essentials",
          description: "Khóa học TOEIC cơ bản cho người mới bắt đầu",
          price: 1500000,
          discountPrice: 1200000,
          level: "beginner",
          thumbnail:
            "https://via.placeholder.com/350x180/F59E0B/FFFFFF?text=TOEIC+Course",
          courseStructure: {
            totalHours: 30,
            totalSessions: 20,
          },
          preRecordedContent: {
            totalLessons: 18,
            totalTopics: 1,
          },
        },
      ];

      setTimeout(() => {
        setCourses(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const filteredCourses =
    filter === "all"
      ? courses
      : courses.filter((course) => course.level === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Khóa Học Của Tôi
              </h1>
              <p className="text-gray-600 mt-2">
                {courses.length} khóa học đã mua
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilter("beginner")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "beginner"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                Cơ bản
              </button>
              <button
                onClick={() => setFilter("intermediate")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "intermediate"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                Trung cấp
              </button>
              <button
                onClick={() => setFilter("advanced")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "advanced"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                Nâng cao
              </button>
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Không có khóa học nào trong danh mục này
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasedCoursesPage;
