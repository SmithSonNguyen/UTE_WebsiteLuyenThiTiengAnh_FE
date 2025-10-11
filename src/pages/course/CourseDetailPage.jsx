import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CourseDetail from "@/components/course/CourseDetail";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Fetch từ API: fetch(`/api/courses/${id}`).then(res => res.json()).then(setCourse);

    // Dữ liệu mẫu dựa trên id
    const mockCourses = {
      1: {
        id: 1,
        title: "TOEIC S&W | TOEIC Speaking và Writing [Tăng Khóa TED Talks]",
        type: "pre-recorded",
        rating: { average: 4.9, reviewsCount: 68 },
        studentsCount: 223,
        duration: "10/2025",
        price: 1800000,
        discountPrice: 999000,
        discountPercent: 45,
        features: [
          "Đánh cơ bản về mục tiêu đạt điểm TOEIC Speaking - Writing tại mức đầu ra 240-300+",
          "Bài giảng hướng dẫn chi tiết làm đăng câu hỏi TOEIC Speaking- Writing",
          "Làm quen với cấu hình các hội, chủ đề trọng TOEIC Speaking- Writing với hàng trăm",
          "Bài thi mẫu trả lời- nghe- đọc am, đồng thời luyện nghe- viết câu trả lời cho",
          "Bổ sung cập nhật, làm mới nội dung, email, bài luận hiện tại",
        ],
        comboDeals: {
          price: 1525000,
          discount: 57,
          title: "Combo TOEIC 4 kỹ năng [Tăng TED Talks]",
          includedCourses: ["Complete TOEIC", "TOEIC Speaking & Writing"],
        },
      },
      2: {
        id: 2,
        title:
          "TOEIC S&W | TOEIC Speaking và Writing [Live Meet - Tăng Khóa TED Talks]",
        type: "live-meet",
        rating: { average: 4.8, reviewsCount: 45 },
        studentsCount: 150,
        duration: "Từ 10/2025 (12 buổi)",
        price: 2000000,
        discountPrice: 1200000,
        discountPercent: 40,
        features: [
          "Đánh cơ bản về mục tiêu đạt điểm TOEIC Speaking - Writing tại mức đầu ra 240-300+",
          "Bài giảng live tương tác, làm đăng câu hỏi TOEIC Speaking- Writing với giảng viên",
          "Làm quen với cấu hình các hội, chủ đề trọng TOEIC Speaking- Writing qua thảo luận",
          "Bài thi mẫu trả lời- nghe- đọc am, đồng thời luyện nghe- viết câu trả lời live",
          "Bổ sung cập nhật, làm mới nội dung qua feedback email và group chat",
        ],
        comboDeals: {
          price: 1800000,
          discount: 50,
          title: "Combo TOEIC 4 kỹ năng Live [Với TED Talks]",
          includedCourses: [
            "Complete TOEIC Live",
            "TOEIC Speaking & Writing Live",
          ],
        },
        instructor: { name: "Nguyễn Văn A" },
      },
    };

    setCourse(mockCourses[id] || mockCourses[1]); // Default to id=1 nếu id không tồn tại
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <CourseDetail course={course} />
    </div>
  );
};

export default CourseDetailPage;
