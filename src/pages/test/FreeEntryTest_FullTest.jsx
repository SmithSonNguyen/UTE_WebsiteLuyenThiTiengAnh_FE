import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

const PART_INFO = {
  1: { name: "Photographs", hasImage: true },
  2: { name: "Question–Response", hasImage: false },
  3: { name: "Conversations", hasImage: false },
  4: { name: "Short-Talks", hasImage: false },
  5: { name: "Incomplete Sentences", hasImage: false },
  6: { name: "Text Completion", hasImage: false },
  7: { name: "Reading Comprehension", hasImage: false },
};

const FreeEntryTest_FullTest = () => {
  const [questions, setQuestions] = useState([]);
  const [groups, setGroups] = useState([]); // nhóm câu part 3–4
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const audioRef = useRef(null);

  const currentQ = questions[currentIndex];
  const currentPart = PART_INFO[currentQ?.part] || {};

  // 🧠 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          "/toeic-home/free-entry-test/full-test"
        );
        console.log("res=", res);
        const rawData = Array.isArray(res) ? res : [];

        // 🔄 Flatten dữ liệu group => từng câu hỏi riêng
        const flattened = rawData.flatMap((group) =>
          group.questions.map((q, idx) => ({
            ...q,
            part: group.part,
            mediaUrl: group.mediaUrl,
            imageUrl: group.imageUrl,
            groupIndex: idx,
          }))
        );

        setQuestions(flattened);

        // 🔸 Gom nhóm theo mediaUrl hoặc imageUrl
        const grouped = [];
        let temp = [];

        flattened.forEach((q, i) => {
          // Part 1–2: không gom nhóm
          if (q.part < 3) {
            grouped.push([q]);
            return;
          }

          if (temp.length === 0) {
            temp.push(q);
            return;
          }

          const prev = temp[temp.length - 1];
          const sameMedia = prev.mediaUrl && prev.mediaUrl === q.mediaUrl;
          const sameImage = prev.imageUrl && prev.imageUrl === q.imageUrl;

          if (sameMedia || sameImage) {
            temp.push(q);
          } else {
            grouped.push([...temp]);
            temp = [q];
          }

          if (i === flattened.length - 1 && temp.length) grouped.push(temp);
        });

        setGroups(grouped);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };
    fetchData();
  }, []);

  // 🕒 Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔊 Tự động phát audio khi đổi câu
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (currentQ?.mediaUrl) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, currentQ?.mediaUrl]);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < questions.length) setCurrentIndex(idx);
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!currentQ) return <div className="p-6">Đang tải đề thi...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg">TOEIC Full Test</h1>
        <button className="px-4 py-1 border rounded">Thoát</button>
      </div>

      {/* Tabs */}
      <div className="border-b bg-gray-50 px-6 py-3 flex gap-2">
        {Object.entries(PART_INFO).map(([partNum, info]) => (
          <button
            key={partNum}
            onClick={() => {
              const idx = questions.findIndex(
                (q) => q.part === parseInt(partNum)
              );
              if (idx !== -1) goToQuestion(idx);
            }}
            className={`px-3 py-1 rounded ${
              currentQ.part === parseInt(partNum)
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {info.name}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left side */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* ✅ Part 1 & 2 hiển thị từng câu */}
          {currentQ.part < 3 && (
            <>
              {currentQ.mediaUrl && (
                <audio ref={audioRef} controls className="mb-4 w-full">
                  <source src={currentQ.mediaUrl} type="audio/mpeg" />
                </audio>
              )}

              {currentPart.hasImage && currentQ.imageUrl && (
                <img
                  src={currentQ.imageUrl}
                  alt="question"
                  className="border mb-4 max-h-60 object-contain"
                />
              )}

              <p className="mb-4 font-medium">
                {currentQ.number}.
                {currentQ.part >= 3 && ` ${currentQ.questionText || ""}`}
              </p>

              {currentQ.options?.map((opt, idx) => {
                const optionLabel = String.fromCharCode(65 + idx);
                const showFullText = currentQ.part >= 3;

                return (
                  <label
                    key={idx}
                    className="block border rounded px-3 py-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q-${currentIndex}`}
                      checked={answers[currentIndex] === opt}
                      onChange={() => handleAnswer(currentIndex, opt)}
                      className="mr-2"
                    />
                    {showFullText ? opt : optionLabel}
                  </label>
                );
              })}
            </>
          )}

          {/* ✅ Part 3–4: nhóm 3 câu */}
          {currentQ.part >= 3 &&
            groups
              .filter((grp) => grp[0].part === currentQ.part)
              .map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="border rounded-lg p-4 mb-6 bg-gray-50"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* LEFT — Hình ảnh nếu có */}
                    {grp[0].imageUrl ? (
                      <div className="w-full md:w-1/2 flex justify-center items-start">
                        <img
                          src={grp[0].imageUrl}
                          alt="context"
                          className="border rounded-lg max-h-[400px] object-contain"
                        />
                      </div>
                    ) : grp[0].mediaUrl ? (
                      <div className="w-full md:w-1/2">
                        <audio controls className="w-full">
                          <source src={grp[0].mediaUrl} type="audio/mpeg" />
                        </audio>
                      </div>
                    ) : null}

                    {/* RIGHT — Câu hỏi và đáp án */}
                    <div className="md:w-1/2 bg-white p-3 rounded-lg shadow-sm w-[400px] h-[500px] overflow-y-auto">
                      {grp.map((q, idx) => (
                        <div
                          key={q._id || `${q.part}-${q.number || idx}`}
                          className=" bg-white p-0 rounded-lg shadow-sm **max-w-sm**"
                        >
                          <p className="font-medium mb-2">
                            {q.number}. {q.questionText}
                          </p>
                          {q.options?.map((opt, i) => (
                            <label
                              key={i}
                              className="block border rounded px-3 py-2 mb-2 cursor-pointer hover:bg-gray-100"
                            >
                              <input
                                type="radio"
                                name={`q-${q._id}`}
                                checked={answers[q._id] === opt}
                                onChange={() => handleAnswer(q._id, opt)}
                                className="mr-2"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar cố định khi cuộn */}
        <div className="w-56 border-l bg-white text-sm">
          <div className="sticky top-0 p-3 h-screen overflow-y-auto">
            <div className="mb-3">
              <p className="font-bold text-gray-700">Thời gian còn lại:</p>
              <p className="text-lg text-red-600 font-semibold">
                {formatTime(timeLeft)}
              </p>
            </div>

            <button className="w-full mb-3 bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700">
              NỘP BÀI
            </button>

            <div className="space-y-2">
              {Object.entries(PART_INFO).map(([partNum, info]) => (
                <div key={partNum}>
                  <p className="font-semibold text-gray-700 mb-1">
                    {info.name}
                  </p>
                  <div className="grid grid-cols-5 gap-1">
                    {questions
                      .filter((q) => q.part === parseInt(partNum))
                      .map((q, idx) => {
                        const globalIndex = questions.findIndex((x) => x === q);
                        return (
                          <button
                            key={q._id || `p${partNum}-q${q.number || idx}`}
                            onClick={() => goToQuestion(globalIndex)}
                            className={`w-7 h-7 rounded text-xs font-medium ${
                              answers[q._id]
                                ? "bg-green-500 text-white"
                                : "bg-gray-200"
                            } ${
                              currentIndex === globalIndex
                                ? "ring-2 ring-blue-500"
                                : ""
                            }`}
                          >
                            {q.number}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeEntryTest_FullTest;
