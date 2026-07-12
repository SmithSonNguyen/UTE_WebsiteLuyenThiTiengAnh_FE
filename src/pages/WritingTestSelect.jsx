import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PenLine, Clock, BookOpen, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

const difficultyConfig = {
  beginner:     { label: "Beginner",     className: "bg-green-100 text-green-700" },
  intermediate: { label: "Intermediate", className: "bg-blue-100 text-blue-700" },
  advanced:     { label: "Advanced",     className: "bg-purple-100 text-purple-700" },
};

const WritingTestSelect = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);
  const userLevel = currentUser?.level || "beginner";
  const [tests, setTests]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/writing-tests");
        // API trả về { result: [...] } hoặc trực tiếp array
        const data = Array.isArray(res.result) ? res.result : (Array.isArray(res) ? res : []);
        setTests(data);
      } catch (err) {
        setError("Không thể tải danh sách đề thi: " + (err.message || "Lỗi không xác định"));
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

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
              <PenLine className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Luyện Viết</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Chọn đề thi để bắt đầu luyện tập
              </p>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-indigo-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Đang tải danh sách đề thi...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && tests.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <PenLine className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Chưa có đề thi nào.</p>
          </div>
        )}

        {/* Test cards */}
        {!loading && !error && tests.length > 0 && (
          <div className="space-y-5">
            {tests.map((test) => {
              const diff = difficultyConfig[userLevel.toLowerCase()] || difficultyConfig.intermediate;
              const totalQuestions = test.questions?.length ?? 8;
              return (
                <div
                  key={test.writingTestId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-indigo-200 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                    {/* Left info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          🖊️ {test.name}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${diff.className}`}>
                          {diff.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4">
                        {test.description || "Bài thi Writing gồm 3 phần: mô tả ảnh, phản hồi email và viết luận."}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-indigo-400" />
                          {test.duration ?? 60} phút
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-indigo-400" />
                          {totalQuestions} câu hỏi
                        </span>
                        {test.completedCount > 0 && (
                          <span className="flex items-center gap-1.5 text-indigo-500 font-medium">
                            ✓ {test.completedCount} lượt làm
                          </span>
                        )}
                      </div>

                      {/* Parts badges */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {["Part 1 (Q1–5)", "Part 2 (Q6–7)", "Part 3 (Q8)"].map((part) => (
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
                      onClick={() => handleStart(test.writingTestId)}
                      className="flex items-center gap-2 py-3 px-8 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold shadow-md shadow-indigo-200 hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
                    >
                      Bắt đầu
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingTestSelect;
