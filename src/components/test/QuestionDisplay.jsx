import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAllQuestions } from "@/api/questionApi";
import { Play, Image as ImageIcon } from "lucide-react";

const QuestionDisplay = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    if (!examId) {
      setError("Không tìm thấy ID bài thi.");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await getAllQuestions(examId);
        const { result } = response;
        if (!result || !Array.isArray(result)) {
          throw new Error(
            "Phản hồi API không hợp lệ: result không tồn tại hoặc không phải mảng"
          );
        }
        const sortedQuestions = result.sort((a, b) => {
          const keyA = a.sortKey || "";
          const keyB = b.sortKey || "";
          return keyA.localeCompare(keyB);
        });
        setQuestions(sortedQuestions);
      } catch {
        setError("Không thể tải câu hỏi. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center py-8">Không có câu hỏi nào.</div>;
  }

  return (
    <div className="w-full px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">TOEIC Test Questions</h1>
      {questions.map((questionGroup) => (
        <div
          key={questionGroup._id}
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="flex flex-col md:flex-row md:space-x-4 w-full">
            {/* Cột trái: Hiển thị hình ảnh (nếu có) hoặc để trống */}
            <div className="md:w-1/2 w-full mb-4 md:mb-0">
              {questionGroup.type === "group" &&
              questionGroup.group &&
              Array.isArray(questionGroup.group.images) &&
              questionGroup.group.images.length > 0 ? (
                <div className="w-full">
                  {questionGroup.group.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Question group ${questionGroup.group.groupNumber}`}
                      className="w-full h-auto mb-2 rounded"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center min-h-[200px]"></div>
              )}
            </div>

            {/* Cột phải: Câu hỏi, audio và đáp án */}
            <div className="md:w-1/2 w-full">
              {/* Audio của nhóm (nếu có) */}
              {questionGroup.type === "group" &&
                questionGroup.group &&
                questionGroup.group.audioUrl && (
                  <div className="mb-4 w-full">
                    <audio
                      controls
                      src={questionGroup.group.audioUrl}
                      className="w-full mb-2"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}

              {/* Danh sách câu hỏi */}
              {questionGroup.questions.map((question) => (
                <div key={question._id} className="mb-6 w-full pl-5">
                  <h3 className="text-lg font-semibold">
                    Câu {question.questionNumber} (Part {question.part})
                  </h3>
                  {question.questionText ? (
                    <p className="text-gray-700 mb-2">
                      {question.questionText}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic mb-2">
                      {(typeof question.audioUrl === "string" &&
                        question.audioUrl) ||
                      (Array.isArray(question.audioUrl) &&
                        question.audioUrl.length > 0)
                        ? "Nghe audio và chọn đáp án đúng"
                        : "Xem nội dung phía trên và chọn đáp án đúng"}
                    </p>
                  )}

                  {/* Audio cho câu hỏi riêng lẻ */}
                  {(typeof question.audioUrl === "string" &&
                    question.audioUrl) ||
                  (Array.isArray(question.audioUrl) &&
                    question.audioUrl.length > 0) ? (
                    <audio
                      controls
                      src={
                        typeof question.audioUrl === "string"
                          ? question.audioUrl
                          : question.audioUrl[0]
                      }
                      className="w-full mb-2"
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : null}

                  <div className="space-y-2 w-full">
                    {question.options.map((option) => (
                      <label
                        key={option.label}
                        className="flex items-center space-x-2 w-full"
                      >
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option.label}
                          checked={
                            selectedAnswers[question._id] === option.label
                          }
                          onChange={() =>
                            handleAnswerSelect(question._id, option.label)
                          }
                          className="form-radio"
                        />
                        <span>
                          {option.label}. {option.text} ({option.vietsub})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => console.log("Submitted answers:", selectedAnswers)}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Nộp bài
      </button>
    </div>
  );
};

export default QuestionDisplay;
