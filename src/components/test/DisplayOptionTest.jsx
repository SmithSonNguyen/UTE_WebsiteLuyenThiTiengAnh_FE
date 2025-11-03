import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import score from "@/utils/score";

const PART_INFO = {
  1: { name: "Photographs", hasImage: true },
  2: { name: "Question–Response", hasImage: false },
  3: { name: "Conversations", hasImage: false },
  4: { name: "Short Talks", hasImage: false },
  5: { name: "Incomplete Sentences", hasImage: false },
  6: { name: "Text Completion", hasImage: false },
  7: { name: "Reading Comprehension", hasImage: false },
};

const DisplayOptionTest = ({
  examId: propExamId,
  selectedParts = [],
  timeLimitMinutes = 0,
}) => {
  const { examId: paramExamId } = useParams();
  const examId = propExamId || paramExamId;
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);

  const [questions, setQuestions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const audioRef = useRef(null);

  const currentQ = questions[currentIndex];
  const currentPart = PART_INFO[currentQ?.part] || {};

  // === FETCH DATA ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (!examId) throw new Error("Không tìm thấy ID bài thi.");

        const res = await axiosInstance.get(`/tests/${examId}/questions`);
        const responseData = res.data || res;

        let rawData = [];
        if (Array.isArray(responseData)) rawData = responseData;
        else if (responseData.result && Array.isArray(responseData.result))
          rawData = responseData.result;
        else if (responseData.data && Array.isArray(responseData.data))
          rawData = responseData.data;
        else if (
          responseData.questions &&
          Array.isArray(responseData.questions)
        )
          rawData = responseData.questions;

        if (!rawData.length) throw new Error("Không có dữ liệu câu hỏi.");

        // === FLATTEN & FILTER BY selectedParts ===
        const flattened = rawData
          .flatMap((section) => {
            if (!section.questions?.length) return [];
            return section.questions.map((q) => ({
              ...q,
              _id: `${section._id || section.id}-${q.number}`,
              part: section.part || 1,
              mediaUrl: section.mediaUrl || "",
              imageUrls: section.imageUrls || section.imageUrl || [],
              paragraph: section.paragraph || "",
              groupId: section._id || section.id,
            }));
          })
          .filter(
            (q) => selectedParts.length === 0 || selectedParts.includes(q.part)
          );

        if (flattened.length === 0)
          throw new Error("Không có câu hỏi nào phù hợp với Part đã chọn.");

        flattened.sort((a, b) => a.number - b.number);
        setQuestions(flattened);

        // === REBUILD GROUPS AFTER FILTERING ===
        const grouped = [];
        const includedGroupIds = new Set(
          flattened.filter((q) => q.part >= 3).map((q) => q.groupId)
        );

        rawData.forEach((section) => {
          const sectionPart = section.part || 1;
          if (!selectedParts.length || selectedParts.includes(sectionPart)) {
            if (sectionPart < 3) {
              section.questions.forEach((q) => {
                const found = flattened.find((fq) => fq.number === q.number);
                if (found) grouped.push([found]);
              });
            } else if (includedGroupIds.has(section._id || section.id)) {
              const group = flattened.filter(
                (q) => q.groupId === (section._id || section.id)
              );
              if (group.length) grouped.push(group);
            }
          }
        });

        setGroups(grouped);
      } catch (err) {
        setError(err.message || "Lỗi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [examId, selectedParts]);

  // === TIMER ===
  useEffect(() => {
    if (timeLimitMinutes === 0 || timeLeft <= 0) return;
    const timer = setInterval(
      () => setTimeLeft((prev) => Math.max(0, prev - 1)),
      1000
    );
    return () => clearInterval(timer);
  }, [timeLeft, timeLimitMinutes]);

  // === AUTO PLAY AUDIO ===
  useEffect(() => {
    if (audioRef.current && currentQ?.mediaUrl) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentIndex, currentQ?.mediaUrl]);

  const handleAnswer = (id, value) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleFlag = (id) => setFlags((prev) => ({ ...prev, [id]: !prev[id] }));

  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIndex(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // === SUBMIT ===
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const numberToUserAnswer = new Map();
      questions.forEach((q) => {
        if (answers[q._id]) numberToUserAnswer.set(q.number, answers[q._id]);
      });

      const res = await axiosInstance.get(`/tests/${examId}/result`);
      const responseData = res?.data || res;

      let sections = [];
      if (Array.isArray(responseData)) sections = responseData;
      else if (Array.isArray(responseData.result))
        sections = responseData.result;
      else if (Array.isArray(responseData.data)) sections = responseData.data;
      else if (Array.isArray(responseData.sections))
        sections = responseData.sections;

      let listeningCorrect = 0,
        readingCorrect = 0;
      const detailedAnswers = [];

      sections.forEach((section) => {
        const isListening = (section.part || section.type) <= 4;
        (section.questions || []).forEach((q) => {
          const userAnswer = numberToUserAnswer.get(q.number);
          const correctAnswer = q.answer;
          const isCorrect =
            String(userAnswer).trim() === String(correctAnswer).trim();

          if (isListening && isCorrect) listeningCorrect++;
          else if (!isListening && isCorrect) readingCorrect++;

          const foundQ = questions.find((x) => x.number === q.number);

          detailedAnswers.push({
            number: q.number,
            part: foundQ?.part || section.part || "Unknown",
            type: isListening ? "listening" : "reading",
            userAnswer: userAnswer || null,
            correctAnswer,
            isCorrect,
          });
        });
      });

      const listeningScore = score.calculateListeningScore(listeningCorrect);
      const readingScore = score.calculateReadingScore(readingCorrect);
      const totalScore = listeningScore + readingScore;

      const resultState = {
        summary: {
          listeningCorrect,
          readingCorrect,
          listeningScore,
          readingScore,
          totalScore,
        },
        detailedAnswers,
        meta: {
          examId,
          answeredCount: Object.keys(answers).length,
          totalQuestions: questions.length,
        },
        practiceParts: selectedParts.length < 7 ? selectedParts : null, // thêm dòng này
      };

      sessionStorage.setItem(
        `toeic_result_${examId}`,
        JSON.stringify(resultState)
      );
      navigate(`/toeic-home/test-online/${examId}/result`, {
        state: resultState,
      });
    } catch (err) {
      alert("Lỗi nộp bài: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // === RENDER ===
  if (isLoading)
    return (
      <div className="flex justify-center p-10 text-lg">Đang tải đề thi...</div>
    );
  if (error)
    return <div className="text-red-600 text-center p-10">{error}</div>;
  if (!currentQ)
    return <div className="text-center p-10">Không có câu hỏi.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow">
        <h1 className="font-bold text-2xl text-gray-800">
          {timeLimitMinutes > 0
            ? `Luyện Tập - ${timeLimitMinutes} phút`
            : "Làm Bài Tùy Chỉnh"}
        </h1>
        <button
          onClick={() =>
            window.confirm("Thoát sẽ mất dữ liệu!") && navigate(-1)
          }
          className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
        >
          Thoát
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex flex-wrap gap-3">
          {selectedParts.map((partNum) => {
            const info = PART_INFO[partNum];
            const partQs = questions.filter((q) => q.part === partNum);
            const answered = partQs.filter((q) => answers[q._id]).length;
            return (
              <button
                key={partNum}
                onClick={() =>
                  goToQuestion(questions.findIndex((q) => q.part === partNum))
                }
                className={`px-4 py-3 rounded-xl font-semibold text-sm ${
                  currentQ.part === partNum
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Part {partNum} ({answered}/{partQs.length})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1">
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {/* Part 1 & 2 */}
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
                      alt={`img-${idx}`}
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
                  const label = String.fromCharCode(65 + idx);
                  const isSelected = answers[currentQ._id] === label;
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
                        onChange={() => handleAnswer(currentQ._id, label)}
                        className="mr-3 w-4 h-4 accent-blue-600"
                      />
                      <span
                        className={`font-medium ${
                          isSelected ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {currentQ.part >= 3 ? opt : label}
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

          {/* Part 3–7: Group */}
          {currentQ.part >= 3 &&
            groups
              .filter((grp) => grp[0]?.groupId === currentQ.groupId)
              .map((grp, gIdx) => (
                <div
                  key={gIdx}
                  className="border rounded-xl p-8 mb-6 bg-white shadow-sm max-w-6xl mx-auto"
                >
                  <div className="flex flex-col lg:flex-row gap-8">
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
                              alt={`group-img-${idx}`}
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
                              const label = String.fromCharCode(65 + i);
                              const isSelected = answers[q._id] === label;
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
                                    onChange={() => handleAnswer(q._id, label)}
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

          {/* Navigation */}
          <div className="flex justify-between mt-8 max-w-3xl mx-auto">
            <button
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-72 border-l bg-white p-5 sticky top-0 h-screen overflow-y-auto">
          {timeLimitMinutes > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="font-bold text-2xl text-red-600">
                {formatTime(timeLeft)}
              </p>
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Đang nộp..." : "NỘP BÀI"}
          </button>
          <div className="mt-6 space-y-5">
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
                      const idx = questions.findIndex((x) => x._id === q._id);
                      const isAnswered = !!answers[q._id];
                      const isFlagged = !!flags[q._id];
                      const isCurrent = currentIndex === idx;

                      return (
                        <button
                          key={q._id}
                          onClick={() => goToQuestion(idx)}
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
  );
};

export default DisplayOptionTest;
