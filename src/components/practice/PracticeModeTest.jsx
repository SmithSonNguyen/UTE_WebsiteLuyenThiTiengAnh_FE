import React, { useState } from "react";
import DisplayOptionTest from "@/components/test/DisplayOptionTest";
import { useParams } from "react-router-dom";

const partsData = [
  {
    part: 1,
    name: "Part 1 (6 câu hỏi",
    tags: ["Tranh tả người", "Tranh tả vật", "Tranh tả cả người và vật"],
  },
  {
    part: 2,
    name: "Part 2 (25 câu hỏi",
    tags: [
      "WHAT",
      "WHO",
      "WHERE",
      "WHEN",
      "HOW",
      "WHY",
      "YES/NO",
      "Câu hỏi đuôi",
      "Lựa chọn",
      "Yêu cầu",
      "Trần thuật",
    ],
  },
  {
    part: 3,
    name: "Part 3 (39 câu hỏi",
    tags: [
      "Chủ đề",
      "Người nói",
      "Chi tiết",
      "Tương lai",
      "Bảng biểu",
      "Hàm ý",
    ],
  },
  {
    part: 4,
    name: "Part 4 (30 câu hỏi",
    tags: [
      "Chủ đề",
      "Địa điểm",
      "Chi tiết",
      "Tương lai",
      "Bảng biểu",
      "Phát biểu",
    ],
  },
  {
    part: 5,
    name: "Part 5 (30 câu hỏi",
    tags: ["Từ loại", "Ngữ pháp", "Từ vựng"],
  },
  {
    part: 6,
    name: "Part 6 (16 câu hỏi",
    tags: ["Ngữ pháp", "Từ loại", "Điền câu"],
  },
  {
    part: 7,
    name: "Part 7 (54 câu hỏi",
    tags: ["Tìm thông tin", "Suy luận", "Email/Letter", "Advertisement"],
  },
];

const timeOptions = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  100, 105, 110, 115, 120,
];

const PracticeModeTest = () => {
  const [selectedParts, setSelectedParts] = useState([]); // [1, 3, 5]
  const [timeLimit, setTimeLimit] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const { examId } = useParams();

  const togglePart = (part) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleStart = () => {
    if (selectedParts.length === 0) {
      alert("Vui lòng chọn ít nhất 1 phần thi!");
      return;
    }
    setIsStarted(true);
  };

  // === ĐÃ BẮT ĐẦU → HIỂN THỊ BÀI THI ===
  if (isStarted) {
    return (
      <DisplayOptionTest
        examId={examId}
        selectedParts={selectedParts} // [1, 3, 5] → DisplayOptionTest nhận đúng
        timeLimitMinutes={timeLimit}
      />
    );
  }

  // === GIAO DIỆN CHỌN PART ===
  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Luyện Tập Tùy Chỉnh
      </h2>

      {/* Gợi ý */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-gray-700 flex items-start gap-2">
        <div>
          <strong>Mẹo:</strong> Chọn từng phần để luyện tập chuyên sâu, không áp
          lực thời gian.
        </div>
      </div>

      {/* Chọn phần */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Chọn phần thi
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          {partsData.map((item) => (
            <div
              key={item.part}
              onClick={() => togglePart(item.part)}
              className={`border rounded-lg p-4 transition-all cursor-pointer select-none ${
                selectedParts.includes(item.part)
                  ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedParts.includes(item.part)}
                  onChange={() => togglePart(item.part)}
                  className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    Part {item.part}: {item.name.split(" (")[1]}
                  </div>
                  <div className="text-sm font-medium text-blue-700">
                    {item.name.split(" (")[0]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thời gian */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Giới hạn thời gian
        </label>
        <select
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        >
          <option value={0}>Không giới hạn</option>
          {timeOptions.map((t) => (
            <option key={t} value={t}>
              {t} phút
            </option>
          ))}
        </select>
      </div>

      {/* Nút bắt đầu */}
      <div className="text-center">
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all shadow-lg"
        >
          BẮT ĐẦU LUYỆN TẬP
        </button>
      </div>

      {/* Hiển thị đã chọn */}
      {selectedParts.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Đã chọn: <strong>{selectedParts.length}</strong> phần →{" "}
          <strong>{selectedParts.map((p) => `Part ${p}`).join(", ")}</strong>
        </div>
      )}
    </div>
  );
};

export default PracticeModeTest;
