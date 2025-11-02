import React, { useState, useEffect } from "react";
import { Radio, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function FreeEntryTest() {
  const [selectedTest, setSelectedTest] = useState(null);
  const navigate = useNavigate();

  // ✅ Lấy user từ Redux
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);
  const accessToken = useSelector((state) => state?.auth?.login?.accessToken);

  // ✅ Check authentication
  const isAuthenticated = !!(currentUser || accessToken);

  // Debug
  useEffect(() => {
    console.log("FreeEntryTest - Current user:", currentUser);
    console.log("FreeEntryTest - Access token exists:", !!accessToken);
    console.log("FreeEntryTest - Is authenticated:", isAuthenticated);
  }, [currentUser, accessToken, isAuthenticated]);

  const handleSubmit = () => {
    if (selectedTest == "TOEIC Full Test") {
      navigate("/toeic-home/free-entry-test/full-test");
    } else if (selectedTest == "TOEIC Quick Test") {
      navigate("/toeic-home/free-entry-test/quick-test");
    } else if (selectedTest == "TOEIC Entry Test 4 KN") {
      navigate("/toeic-home/free-entry-test/entry-test-4kn");
    } else {
      alert("Vui lòng chọn một bài thi trước khi bắt đầu.");
    }
  };

  const handleCardClick = (testName) => {
    setSelectedTest(testName);
  };

  // ✅ Not authenticated screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để làm bài thi đầu vào và theo dõi kết quả của
            bạn.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with user info */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 text-center">
            Chọn Bài Thi TOEIC
          </h1>
          {currentUser && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Đang đăng nhập:{" "}
              <span className="font-semibold text-gray-700">
                {currentUser.email || currentUser.username || currentUser.name}
              </span>
            </p>
          )}
        </div>

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
    </div>
  );
}
