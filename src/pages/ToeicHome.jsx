import React, { useEffect, useState } from "react";
import Button from "../components/common/Button";
import FaqSectionToeicHome from "../components/layouts/FaqSectionToeicHome";
import CourseCard from "@/components/course/CourseCard";
import CourseCarousel from "../components/course/CourseCarousel";

const ToeicHome = () => {
  const [courses, setCourses] = useState([]);

  // Trong file ToeicHome.js, thay thế phần setCourses trong useEffect bằng dữ liệu mẫu đầy đủ sau:

  useEffect(() => {
    // Fetch từ API: fetch('/api/courses').then(res => res.json()).then(setCourses);
    setCourses([
      {
        id: 1,
        title: "TOEIC Speaking & Writing [Tự Học]",
        subtitle: "Từ 0 đến 300+",
        type: "pre-recorded",
        rating: { average: 4.9, reviewsCount: 68 },
        studentsCount: 223,
        price: 1800000,
        discountPrice: 999000,
        discountPercent: 45,
        description:
          "Học online với bài giảng sẵn, quiz và tài liệu hỗ trợ tự học hiệu quả.",
      },
      {
        id: 2,
        title: "TOEIC Speaking & Writing [Live Meet]",
        subtitle: "Từ 0 đến 300+",
        type: "live-meet",
        rating: { average: 4.8, reviewsCount: 45 },
        studentsCount: 150,
        price: 2000000,
        discountPrice: 1200000,
        discountPercent: 40,
        description:
          "Lớp học trực tiếp qua Google Meet, tương tác với giảng viên giàu kinh nghiệm.",
      },
      {
        id: 3,
        title: "TOEIC Listening & Reading [Tự Học]",
        subtitle: "Từ 400 đến 700+",
        type: "pre-recorded",
        rating: { average: 4.7, reviewsCount: 120 },
        studentsCount: 350,
        price: 1500000,
        discountPrice: 850000,
        discountPercent: 43,
        description:
          "Khóa học video chi tiết với bài tập nghe-đọc, phù hợp tự học tại nhà.",
      },
      {
        id: 4,
        title: "TOEIC Full 4 Skills [Live Meet]",
        subtitle: "Từ 500 đến 850+",
        type: "live-meet",
        rating: { average: 4.9, reviewsCount: 89 },
        studentsCount: 280,
        price: 3000000,
        discountPrice: 2100000,
        discountPercent: 30,
        description:
          "Lộ trình toàn diện 4 kỹ năng qua lớp live, kèm feedback cá nhân hóa.",
      },
    ]);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Luyện Thi TOEIC Online Cùng DTT
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Nền tảng học DTT thông minh – cá nhân hóa lộ trình, rút ngắn thời
            gian ôn luyện.
          </p>
          <Button size="lg" className="bg-yellow-400 text-black font-semibold">
            Đăng ký ngay
          </Button>
        </div>
      </section>

      {/* Courses Section */}
      <CourseCarousel courses={courses} title="Các Khóa Học TOEIC Nổi Bật" />

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Vì Sao Chọn DTT TOEIC?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">
                Lộ trình cá nhân hóa
              </h3>
              <p className="text-gray-600">
                Xây dựng kế hoạch học tập phù hợp từng học viên.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Theo dõi tiến độ</h3>
              <p className="text-gray-600">
                Báo cáo chi tiết, theo sát hành trình học TOEIC của bạn.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">👩‍🏫</div>
              <h3 className="text-xl font-semibold mb-2">
                Giảng viên chất lượng
              </h3>
              <p className="text-gray-600">
                Đội ngũ thầy cô giàu kinh nghiệm, hỗ trợ nhiệt tình.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16">
        <FaqSectionToeicHome />
      </section>

      {/* Call To Action */}
      <section className="bg-indigo-600 text-white py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Sẵn sàng chinh phục TOEIC?
        </h2>
        <p className="mb-8">
          Hàng nghìn học viên đã đạt mục tiêu cùng DTT. Bạn đã sẵn sàng chưa?
        </p>
        <Button size="lg" className="bg-yellow-400 text-black font-semibold">
          Đăng ký ngay
        </Button>
      </section>
    </div>
  );
};

export default ToeicHome;
