import React, { useState } from "react";
import { Radio, Button } from "antd";
import HeaderToeicHome from "../components/layouts/HeaderToeicHome";
import Footer from "../components/common/Footer";

export default function FreeEntryTest() {
  const [selectedTest, setSelectedTest] = useState(null);

  const handleSubmit = () => {
    if (selectedTest) {
      alert(`You selected: ${selectedTest}`);
    } else {
      alert("Please select a test option before submitting.");
    }
  };

  const handleCardClick = (testName) => {
    setSelectedTest(testName);
  };

  return (
    <>
      <HeaderToeicHome />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Chọn Bài Thi TOEIC
        </h1>

        <div className="space-y-6">
          {/* TOEIC Full Test */}
          <label className="block">
            <div
              className="flex flex-col bg-white rounded-xl p-6 w-full border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCardClick("TOEIC Full Test")}
            >
              <div className="flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-row items-center">
                    <Radio
                      name="test-option"
                      className="w-6 h-6"
                      checked={selectedTest === "TOEIC Full Test"}
                      onChange={() => setSelectedTest("TOEIC Full Test")}
                    />
                    <p className="font-bold text-xl ml-4 text-gray-900">
                      TOEIC Full Test (Listening + Reading)
                    </p>
                  </div>
                </div>
                <div className="flex ml-10 text-sm text-gray-600 items-center mt-2">
                  Thời gian làm bài: 02:00:00
                </div>
              </div>
              <p className="text-sm text-gray-500 ml-10 mt-3 leading-relaxed">
                Bài thi gồm 2 phần - Bài Nghe (100 câu) và Bài Đọc (100 câu)
              </p>
            </div>
          </label>

          {/* TOEIC Quick Test */}
          <label className="block">
            <div
              className="flex flex-col bg-white rounded-xl p-6 w-full border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCardClick("TOEIC Quick Test")}
            >
              <div className="flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-row items-center">
                    <Radio
                      name="test-option"
                      className="w-6 h-6"
                      checked={selectedTest === "TOEIC Quick Test"}
                      onChange={() => setSelectedTest("TOEIC Quick Test")}
                    />
                    <p className="font-bold text-xl ml-4 text-gray-900">
                      TOEIC Quick Test (L+R: 30p)
                    </p>
                  </div>
                </div>
                <div className="flex ml-10 text-sm text-gray-600 items-center mt-2">
                  Thời gian làm bài: 00:30:00
                </div>
              </div>
              <p className="text-sm text-gray-500 ml-10 mt-3 leading-relaxed">
                Bài thi nhanh gồm 2 phần - Bài Nghe (15 câu) và Bài Đọc (15 câu)
              </p>
            </div>
          </label>

          {/* TOEIC Entry Test 4 KN */}
          <label className="block">
            <div
              className="flex flex-col bg-white rounded-xl p-6 w-full border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCardClick("TOEIC Entry Test 4 KN")}
            >
              <div className="flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex flex-row items-center">
                    <Radio
                      name="test-option"
                      className="w-6 h-6"
                      checked={selectedTest === "TOEIC Entry Test 4 KN"}
                      onChange={() => setSelectedTest("TOEIC Entry Test 4 KN")}
                    />
                    <p className="font-bold text-xl ml-4 text-gray-900">
                      TOEIC Entry Test 4 KN (30p)
                    </p>
                  </div>
                </div>
                <div className="flex ml-10 text-sm text-gray-600 items-center mt-2">
                  Thời gian làm bài: 00:30:00
                </div>
              </div>
              <p className="text-sm text-gray-500 ml-10 mt-3 leading-relaxed">
                Bài thi kiểm tra 4 kỹ năng - Nghe, Đọc, Nói, Viết (15 câu mỗi
                phần)
              </p>
            </div>
          </label>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-colors duration-200"
          >
            Bắt Đầu Bài Thi
          </Button>
        </div>
      </div>

      {/* Footer */}
      <a>
        <Footer />
      </a>
    </>
  );
}
