import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

const PART_INFO = {
  1: { name: "Photographs", hasImage: true },
  2: { name: "Question–Response", hasImage: false },
  3: { name: "Conversations", hasImage: false },
  4: { name: "Short Talks", hasImage: false },
  5: { name: "Incomplete Sentences", hasImage: false },
  6: { name: "Text Completion", hasImage: false },
  7: { name: "Reading Comprehension", hasImage: false },
};

const FreeEntryTest_FullTest = () => {
  const [questions, setQuestions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const currentQ = questions[currentIndex];
  const currentPart = PART_INFO[currentQ?.part] || {};

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching test data...");
        const res = await axiosInstance.get("/tests/ETS-2024-01/questions");

        console.log("Full response:", res);
        console.log("Response data:", res?.data);

        // Kiểm tra response structure
        if (!res) {
          throw new Error(
            "Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng."
          );
        }

        // Xử lý nhiều format response khác nhau
        // axiosInstance có thể trả về res trực tiếp (không có .data) hoặc res.data
        let rawData = [];
        const responseData = res.data || res; // Nếu không có res.data thì dùng res

        console.log("Response data to parse:", responseData);

        if (Array.isArray(responseData)) {
          // Trường hợp 1: responseData là array trực tiếp
          rawData = responseData;
        } else if (responseData.result && Array.isArray(responseData.result)) {
          // Trường hợp 2: responseData.result là array
          rawData = responseData.result;
        } else if (responseData.data && Array.isArray(responseData.data)) {
          // Trường hợp 3: responseData.data là array
          rawData = responseData.data;
        } else if (
          responseData.questions &&
          Array.isArray(responseData.questions)
        ) {
          // Trường hợp 4: responseData.questions là array
          rawData = responseData.questions;
        }

        console.log("Raw data after parsing:", rawData);

        if (!Array.isArray(rawData) || rawData.length === 0) {
          throw new Error(
            "Không tìm thấy câu hỏi nào cho bài test này. Dữ liệu API có thể chưa được load."
          );
        }

        // Flatten dữ liệu: chuyển từ sections sang danh sách câu hỏi
        const flattened = rawData.flatMap((section) => {
          // Kiểm tra section có questions không
          if (!section.questions || !Array.isArray(section.questions)) {
            console.warn("Section không có questions:", section);
            return [];
          }

          return section.questions.map((q, idx) => ({
            ...q,
            _id: `${section._id || section.id || "section"}-${q.number}`,
            part: section.part || 1,
            mediaUrl: section.mediaUrl || "",
            imageUrls: Array.isArray(section.imageUrl)
              ? section.imageUrl
              : section.imageUrls
              ? section.imageUrls
              : [],
            paragraph: section.paragraph || "",
            groupId: section._id || section.id || `group-${idx}`,
            groupIndex: idx,
          }));
        });

        console.log("Flattened questions:", flattened);

        if (flattened.length === 0) {
          throw new Error(
            "Không thể xử lý dữ liệu câu hỏi. Vui lòng kiểm tra format API."
          );
        }

        // Sắp xếp câu hỏi theo number
        flattened.sort((a, b) => (a.number || 0) - (b.number || 0));
        setQuestions(flattened);

        // Gom nhóm cho part 3–7
        const grouped = [];
        rawData.forEach((section) => {
          if (!section.questions || !Array.isArray(section.questions)) return;

          const sectionPart = section.part || 1;

          if (sectionPart < 3) {
            // Part 1-2: mỗi câu là một nhóm
            section.questions.forEach((q) => {
              const found = flattened.find(
                (fq) =>
                  fq._id ===
                  `${section._id || section.id || "section"}-${q.number}`
              );
              if (found) grouped.push([found]);
            });
          } else {
            // Part 3-7: nhóm theo section
            const group = flattened.filter(
              (q) => q.groupId === (section._id || section.id)
            );
            if (group.length) grouped.push(group);
          }
        });

        console.log("Grouped questions:", grouped);
        setGroups(grouped);

        console.log("Data loaded successfully:", {
          totalQuestions: flattened.length,
          totalGroups: grouped.length,
        });
      } catch (err) {
        console.error("Fetch error details:", {
          message: err.message,
          stack: err.stack,
          response: err.response
            ? {
                status: err.response.status,
                statusText: err.response.statusText,
                data: err.response.data,
              }
            : "No response available",
        });

        // Hiển thị lỗi chi tiết hơn
        let errorMessage = "Không thể tải đề thi. ";

        if (err.response) {
          // Server trả về lỗi
          if (err.response.status === 401) {
            errorMessage +=
              "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.";
          } else if (err.response.status === 404) {
            errorMessage += "Không tìm thấy đề thi này.";
          } else if (err.response.status === 500) {
            errorMessage += "Lỗi server. Vui lòng thử lại sau.";
          } else {
            errorMessage += `Lỗi: ${err.response.statusText || err.message}`;
          }
        } else if (err.request) {
          // Request được gửi nhưng không nhận được response
          errorMessage +=
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
        } else {
          // Lỗi khác
          errorMessage += err.message;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Tự động phát audio
  useEffect(() => {
    if (audioRef.current && currentQ?.mediaUrl) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.log("Audio autoplay prevented:", err);
      });
    }
  }, [currentIndex, currentQ?.mediaUrl]);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleFlag = (id) => {
    setFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIndex(idx);
      // Scroll to top khi chuyển câu
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
              />
            </svg>
            <span className="text-gray-700 text-xl font-semibold">
              Đang tải đề thi...
            </span>
          </div>
          <p className="text-gray-500 text-sm">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 text-center mb-3">
            Có lỗi xảy ra
          </h2>
          <p className="text-red-600 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  // No questions state
  if (!currentQ || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
          <p className="text-gray-600 text-lg">Không tìm thấy câu hỏi nào.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow">
        <h1 className="font-bold text-2xl text-gray-800">TOEIC Full Test</h1>
        <button
          onClick={() => {
            if (
              window.confirm(
                "Bạn có chắc muốn thoát? Dữ liệu sẽ không được lưu."
              )
            ) {
              window.history.back();
            }
          }}
          className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium shadow-sm hover:shadow"
        >
          Thoát
        </button>
      </div>

      {/* Tabs - 7 parts */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <div className="flex flex-wrap gap-3 max-w-7xl mx-auto">
          {Object.entries(PART_INFO).map(([partNum, info]) => {
            const isActive = currentQ.part === parseInt(partNum);
            const questionsInPart = questions.filter(
              (q) => q.part === parseInt(partNum)
            );
            const answeredCount = questionsInPart.filter(
              (q) => answers[q._id]
            ).length;
            const totalCount = questionsInPart.length;

            if (totalCount === 0) return null;

            return (
              <button
                key={partNum}
                onClick={() => {
                  const idx = questions.findIndex(
                    (q) => q.part === parseInt(partNum)
                  );
                  if (idx !== -1) goToQuestion(idx);
                }}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md border border-gray-200"
                }`}
              >
                <div className="text-center">
                  <div className="font-bold">Part {partNum}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isActive ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {info.name}
                  </div>
                  <div
                    className={`text-xs mt-1 font-semibold ${
                      isActive ? "text-white" : "text-blue-600"
                    }`}
                  >
                    {answeredCount}/{totalCount}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left side: Question content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {/* Part 1 & 2: Hiển thị từng câu */}
          {currentQ.part < 3 && (
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
              {currentQ.paragraph && (
                <p className="mb-6 text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {currentQ.paragraph}
                </p>
              )}
              {currentQ.mediaUrl && (
                <audio
                  ref={audioRef}
                  controls
                  className="mb-6 w-full rounded-lg"
                >
                  <source src={currentQ.mediaUrl} type="audio/mpeg" />
                </audio>
              )}
              {currentPart.hasImage && currentQ.imageUrls?.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6 justify-center">
                  {currentQ.imageUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`question-image-${idx}`}
                      className="border rounded-xl max-h-80 object-contain shadow-sm"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              <p className="mb-6 font-bold text-xl text-gray-800">
                Câu {currentQ.number}: {currentQ.questionText || ""}
              </p>
              <div className="space-y-3">
                {currentQ.options?.map((opt, idx) => {
                  const optionLabel = String.fromCharCode(65 + idx);
                  const showFullText = currentQ.part >= 3;
                  const isSelected = answers[currentQ._id] === opt;
                  return (
                    <label
                      key={idx}
                      className={`block border-2 rounded-xl px-5 py-4 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-500 shadow-md"
                          : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQ._id}`}
                        checked={isSelected}
                        onChange={() => handleAnswer(currentQ._id, opt)}
                        className="mr-3 w-4 h-4 accent-blue-600"
                      />
                      <span
                        className={`font-medium ${
                          isSelected ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {showFullText ? opt : optionLabel}
                      </span>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={() => handleFlag(currentQ._id)}
                className={`mt-6 px-6 py-3 flex items-center gap-2 rounded-xl font-medium transition-all shadow-sm ${
                  flags[currentQ._id]
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                <Flag className="w-5 h-5" />
                {flags[currentQ._id] ? "Bỏ Flag" : "Đặt Flag"}
              </button>
            </div>
          )}

          {/* Part 3–7: Nhóm câu hỏi */}
          {currentQ.part >= 3 &&
            groups
              .filter((grp) => grp[0]?.groupId === currentQ.groupId)
              .map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="border rounded-xl p-8 mb-6 bg-white shadow-sm max-w-6xl mx-auto"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Media/Image/Paragraph */}
                    <div className="w-full lg:w-1/2">
                      {grp[0]?.paragraph && (
                        <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {grp[0].paragraph}
                          </p>
                        </div>
                      )}
                      {grp[0]?.imageUrls?.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-6 justify-center">
                          {grp[0].imageUrls.map((url, idx) => (
                            <img
                              key={idx}
                              src={url}
                              alt={`group-image-${idx}`}
                              className="border rounded-xl max-h-[500px] object-contain shadow-sm"
                              loading="lazy"
                            />
                          ))}
                        </div>
                      )}
                      {grp[0]?.mediaUrl && (
                        <audio controls className="w-full mb-6 rounded-lg">
                          <source src={grp[0].mediaUrl} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                    {/* Questions */}
                    <div className="w-full lg:w-1/2 space-y-6">
                      {grp.map((q) => (
                        <div
                          key={q._id}
                          className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100"
                        >
                          <p className="font-bold text-lg mb-4 text-gray-800">
                            Câu {q.number}: {q.questionText}
                          </p>
                          <div className="space-y-2">
                            {q.options?.map((opt, i) => {
                              const isSelected = answers[q._id] === opt;
                              return (
                                <label
                                  key={i}
                                  className={`block border-2 rounded-lg px-4 py-3 cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-blue-50 border-blue-500 shadow-sm"
                                      : "border-gray-200 hover:bg-white hover:border-gray-300 bg-white"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q._id}`}
                                    checked={isSelected}
                                    onChange={() => handleAnswer(q._id, opt)}
                                    className="mr-3 w-4 h-4 accent-blue-600"
                                  />
                                  <span
                                    className={`${
                                      isSelected
                                        ? "text-blue-700 font-medium"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {opt}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => handleFlag(q._id)}
                            className={`mt-4 px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-all ${
                              flags[q._id]
                                ? "bg-red-500 text-white hover:bg-red-600 shadow-sm"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                            }`}
                          >
                            <Flag className="w-4 h-4" />
                            {flags[q._id] ? "Bỏ Flag" : "Đặt Flag"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 max-w-3xl mx-auto">
            <button
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar: Navigation 200 câu */}
        <div className="w-72 border-l bg-white shadow-lg">
          <div className="sticky top-0 p-5 h-screen overflow-y-auto">
            <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200">
              <p className="font-semibold text-gray-700 text-sm mb-1">
                Thời gian còn lại
              </p>
              <p className="text-2xl text-red-600 font-bold">
                {formatTime(timeLeft)}
              </p>
            </div>
            <button className="w-full mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl text-sm font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
              NỘP BÀI
            </button>
            <div className="space-y-5">
              {Object.entries(PART_INFO).map(([partNum, info]) => {
                const partQuestions = questions.filter(
                  (q) => q.part === parseInt(partNum)
                );
                if (partQuestions.length === 0) return null;

                return (
                  <div
                    key={partNum}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <p className="font-bold text-gray-800 mb-3 text-sm">
                      Part {partNum}: {info.name}
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {partQuestions.map((q) => {
                        const globalIndex = questions.findIndex(
                          (x) => x._id === q._id
                        );
                        const isAnswered = !!answers[q._id];
                        const isFlagged = !!flags[q._id];
                        const isCurrent = currentIndex === globalIndex;

                        return (
                          <button
                            key={q._id}
                            onClick={() => goToQuestion(globalIndex)}
                            className={`relative w-10 h-10 rounded-lg text-xs font-bold transition-all ${
                              isAnswered
                                ? "bg-green-500 text-white shadow-sm hover:bg-green-600"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400"
                            } ${
                              isCurrent ? "ring-4 ring-blue-400 scale-110" : ""
                            }`}
                          >
                            {q.number}
                            {isFlagged && (
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeEntryTest_FullTest;
