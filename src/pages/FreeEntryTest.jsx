import React, { useState } from "react";
import { Radio, Button } from "antd";
import HeaderToeicHome from "../components/layouts/HeaderToeicHome";

export default function FreeEntryTest() {
  const [selectedTest, setSelectedTest] = useState(null);

  const handleSubmit = () => {
    if (selectedTest) {
      alert(`You selected: ${selectedTest}`);
    } else {
      alert("Please select a test option before submitting.");
    }
  };

  return (
    <>
      <div>
        <HeaderToeicHome />
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">TOEIC Entry Test</h1>

        <div className="space-y-4">
          {/* TOEIC Full Test */}
          <div className="flex flex-col bg-white rounded-2xl p-3 my-3 w-full md:w-1/2 border-2 border-blue-500 shadow-lg">
            <div className="flex flex-col justify-between w-auto cursor-pointer">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div className="flex flex-row items-center">
                  <Radio
                    name="test-option"
                    className="w-5 h-5"
                    checked={selectedTest === "TOEIC Full Test"}
                    onChange={() => setSelectedTest("TOEIC Full Test")}
                  />
                  <p className="font-bold text-xl ml-3 text-black">
                    TOEIC Full Test (Listening + Reading)
                  </p>
                </div>
              </div>
              <div className="flex ml-7 text-left text-sm items-center">
                Thời gian làm bài: 02:00:00
              </div>
            </div>
            <p className="text-left text-sm mx-7 mt-2 whitespace-pre-line">
              Bài thi gồm 2 phần - Bài Nghe (100 câu) và Bài Đọc (100 câu)
            </p>
          </div>

          {/* TOEIC Quick Test */}
          <div className="flex flex-col bg-white rounded-2xl p-3 my-3 w-full md:w-1/2 border-2 border-blue-500 shadow-lg">
            <div className="flex flex-col justify-between w-auto cursor-pointer">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div className="flex flex-row items-center">
                  <Radio
                    name="test-option"
                    className="w-5 h-5"
                    checked={selectedTest === "TOEIC Quick Test"}
                    onChange={() => setSelectedTest("TOEIC Quick Test")}
                  />
                  <p className="font-bold text-xl ml-3 text-black">
                    TOEIC Quick Test (L+R: 30p)
                  </p>
                </div>
              </div>
              <div className="flex ml-7 text-left text-sm items-center">
                Thời gian làm bài: 00:30:00
              </div>
            </div>
            <p className="text-left text-sm mx-7 mt-2 whitespace-pre-line">
              Bài thi nhanh gồm 2 phần - Bài Nghe (15 câu) và Bài Đọc (15 câu)
            </p>
          </div>

          {/* TOEIC Entry Test 4 KN */}
          <div className="flex flex-col bg-white rounded-2xl p-3 my-3 w-full md:w-1/2 border-2 border-blue-500 shadow-lg">
            <div className="flex flex-col justify-between w-auto cursor-pointer">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div className="flex flex-row items-center">
                  <Radio
                    name="test-option"
                    className="w-5 h-5"
                    checked={selectedTest === "TOEIC Entry Test 4 KN"}
                    onChange={() => setSelectedTest("TOEIC Entry Test 4 KN")}
                  />
                  <p className="font-bold text-xl ml-3 text-black">
                    TOEIC Entry Test 4 KN (30p)
                  </p>
                </div>
              </div>
              <div className="flex ml-7 text-left text-sm items-center">
                Thời gian làm bài: 00:30:00
              </div>
            </div>
            <p className="text-left text-sm mx-7 mt-2 whitespace-pre-line">
              Bài thi kiểm tra 4 kỹ năng - Nghe, Đọc, Nói, Viết (15 câu mỗi
              phần)
            </p>
          </div>
        </div>

        <div className="flex justify-end items-center">
          <Button type="primary" onClick={handleSubmit}>
            Start Test
          </Button>
        </div>
      </div>
    </>
  );
}
