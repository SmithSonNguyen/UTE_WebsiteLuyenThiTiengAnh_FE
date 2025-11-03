import React, { useState } from "react";
import DisplayFullTest from "@/components/test/DisplayFullTest";

const FullTestSection = () => {
  const [isStarted, setIsStarted] = useState(false);

  // Khi bấm nút "BẮT ĐẦU THI" thì hiển thị component DisplayFullTest
  if (isStarted) {
    return <DisplayFullTest />;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-gray-800">
      <div className="mb-4">
        ⚠️ Sẵn sàng để bắt đầu làm full test? Để đạt được kết quả tốt nhất, bạn
        cần dành ra <strong>120 phút</strong> cho bài test này.
      </div>

      <button
        onClick={() => setIsStarted(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
      >
        BẮT ĐẦU THI
      </button>
    </div>
  );
};

export default FullTestSection;
