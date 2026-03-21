import React from "react";
import { useNavigate } from "react-router-dom";
import { Headphones, Clock, BarChart2, ChevronRight } from "lucide-react";

// Danh sách đề thi Writing/Nghe (mock data — có thể kết nối API sau)
const WRITING_TESTS = [
  {
    id: "mock-writing-01",
    title: "TOEIC Writing Test - Demo",
    description:
      "Bài thi writing mẫu gồm 8 câu: viết câu theo ảnh, phản hồi email, và viết luận.",
    duration: 60,
    totalQuestions: 8,
    parts: ["Part 1 (Q1-5)", "Part 2 (Q6-7)", "Part 3 (Q8)"],
    level: "Intermediate",
    badge: "🖊️ Writing",
  },
];

const levelColors = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
};

const WritingTestSelect = () => {
  const navigate = useNavigate();

  const handleStart = (testId) => {
    navigate(`/toeic-home/writing-test/${testId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Headphones className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Luyện Viết</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Chọn đề thi để bắt đầu luyện tập
              </p>
            </div>
          </div>
        </div>

        {/* Test cards */}
        <div className="space-y-5">
          {WRITING_TESTS.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-indigo-200 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* Left info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {test.badge} {test.title}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${levelColors[test.level] || "bg-gray-100 text-gray-600"}`}
                    >
                      {test.level}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    {test.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      {test.duration} phút
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-indigo-400" />
                      {test.totalQuestions} câu hỏi
                    </span>
                  </div>

                  {/* Parts badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {test.parts.map((part) => (
                      <span
                        key={part}
                        className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Start button */}
                <button
                  onClick={() => handleStart(test.id)}
                  className="flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-md shadow-indigo-200 hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
                >
                  Bắt đầu
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WritingTestSelect;
