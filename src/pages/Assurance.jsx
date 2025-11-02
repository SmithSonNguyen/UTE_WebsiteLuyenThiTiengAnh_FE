import React, { useState } from "react";
import {
  Check,
  Award,
  BookOpen,
  Zap,
  TrendingUp,
  Users,
  Target,
  Star,
} from "lucide-react";

export default function CommitmentPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Tài liệu đa dạng và chất lượng",
      description:
        "Hệ thống tài liệu được cập nhật liên tục, phù hợp với đề thi thực tế",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Kiến thức thực chiến",
      description: "Học những gì cần thiết để thi đậu, không lan man",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Chiến lược học lâu dài",
      description:
        "Không chỉ thi đậu mà còn nâng cao năng lực tiếng Anh thực sự",
    },
  ];

  const methodFeatures = [
    { text: "Thiết kế riêng dành cho Học viên đi thi", checked: true },
    { text: "Ứng dụng lâu dài và đi lên IELTS hoặc giao tiếp", checked: true },
    { text: "Học tiếng Anh thụ động 1 cách chủ động", checked: true },
    { text: "Ứng dụng học thuật cho tương lai", checked: true },
  ];

  const techFeatures = [
    { text: "Kho đề thi Online", checked: true },
    { text: "Kho từ vựng qua câu chuyện", checked: true },
  ];

  const roadmapFeatures = [
    { text: "Công khai hệ thống qua SGK trên LMS", checked: true },
    { text: "Lộ trình tăng skill rõ ràng", checked: true },
    { text: "Hiệu quả cao với mục tiêu rõ ràng", checked: true },
    { text: "Lộ trình đa dạng cho học viên lựa chọn", checked: true },
  ];

  const commitmentPoints = [
    {
      title: "Chất lượng đầu tiên",
      description:
        "Đảm bảo chương trình chất lượng, học viên đạt được đầu ra ngay với tiến bộ vượt trội. Không phải học đi học lại vô nghĩa liên tục.",
    },
    {
      title: "Hệ thống học tập vượt trội",
      description:
        "Hệ thống học tập Online được đầu tư chất lượng, cập nhật đề thi sát thực tế. Khi học, bạn được tặng kèm nhiều Khóa cải thiện kỹ năng tiếng Anh đầy hấp dẫn.",
    },
  ];

  const supportPolicy = [
    "Học lại miễn phí đến khi có kết quả mong đợi",
    "Phân tích vấn đề cụ thể, mang đến giải pháp riêng hiệu quả nhất cho bạn",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Cam kết đầu ra</h1>
              <p className="text-xl mb-8 leading-relaxed">
                Cam kết đầu ra là sự khẳng định về <strong>uy tín</strong> cũng
                như <strong>sự khác biệt</strong> chất lượng. Chương trình cam
                kết giải thích rõ{" "}
                <span className="text-yellow-300">
                  tại sao cam kết này vượt trội
                </span>{" "}
                hơn nơi khác.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                  Liên hệ Zalo tư vấn
                </button>
                <button className="border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://fme.edu.vn/wp-content/uploads/2024/07/cam-ket-dau-ra-fme-768x432.jpg"
                alt="Cam kết đầu ra"
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold shadow-lg">
                ⭐ Cam kết bằng văn bản
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Điểm khác biệt */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Cam kết có gì khác biệt
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Cách chúng tôi đồng hành "có tâm, có tầm" cùng học viên
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {commitmentPoints.map((point, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    {point.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chính sách hỗ trợ */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200">
          <p className="text-lg mb-6 text-gray-700">
            <strong>Tuy nhiên,</strong> trong trường hợp thiếu may mắn của bạn,
            <strong className="text-orange-600"> học tài thi phận</strong>, thì
            chúng tôi có chính sách hỗ trợ tận tình:
          </p>
          <div className="space-y-3">
            {supportPolicy.map((policy, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">{policy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Chương trình học có gì?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Features */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="space-y-12">
          {/* Phương pháp học */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <BookOpen className="w-8 h-8" /># Phương pháp học
              </h3>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {methodFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="bg-green-500 rounded-full p-1">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ứng dụng công nghệ */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Zap className="w-8 h-8" /># Ứng dụng công nghệ
              </h3>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {techFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="bg-blue-500 rounded-full p-1">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lộ trình học */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <TrendingUp className="w-8 h-8" /># Lộ trình học
              </h3>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                {roadmapFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <div className="bg-orange-500 rounded-full p-1">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-800 font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Nhận ngay tư vấn miễn phí
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nhận tư vấn về chương trình học, các quy định thi, chương trình giáo
            dục và đề thi thử
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
              Nhận tư vấn qua Zalo
            </button>
            <button className="bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-all transform hover:scale-105 shadow-lg">
              Nhắn tin Messenger
            </button>
          </div>
          <div className="mt-12">
            <img
              src="https://fme.edu.vn/wp-content/uploads/2023/06/khoa-hoc-vstep-fme-voi-nhieu-tinh-nang-hap-dan-768x768.png"
              alt="Khóa học VSTEP"
              className="rounded-2xl shadow-2xl mx-auto max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Đánh giá từ các học viên
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  HV
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Học viên {item}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">
                "Chương trình học rất bài bản, giáo viên tận tâm. Sau khóa học,
                tôi đã tự tin hơn rất nhiều trong việc sử dụng tiếng Anh."
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA with QR */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Cam kết đầu ra bằng văn bản
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Nó không là lời nói, mà nó là hành động, để bạn có thể chạm, và cảm
            nhận được
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 inline-block">
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 text-center px-4">
                QR Code
                <br />
                Cam kết đầu ra
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
