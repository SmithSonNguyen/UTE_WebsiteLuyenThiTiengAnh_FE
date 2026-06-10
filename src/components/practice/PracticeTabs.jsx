import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PracticeModeTest from "@/components/practice/PracticeModeTest";
import FullTestSection from "@/components/practice/FullTestSection";
import DiscussionSection from "@/components/practice/DiscussionSection";
import axiosInstance from "@/utils/axiosInstance";
import score from "@/utils/score";

const PracticeTabs = () => {
  const [subTab, setSubTab] = useState("practice");
  const [testAttempts, setTestAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [testName, setTestName] = useState("Đề thi TOEIC");
  const [testLoadingName, setTestLoadingName] = useState(true);

  const { examId } = useParams();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);

  // ✅ Wrap in useCallback to avoid infinite dependency loops
  const fetchTestAttempts = useCallback(async () => {
    if (!examId || !currentUser) return;

    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/tests/${examId}/attempts`);

      if (response.result) {
        setTestAttempts(response.result);
      }
    } catch (err) {
      console.error("Error fetching test attempts:", err);
      setError("Không thể tải kết quả làm bài. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, [examId, currentUser]);

  // ✅ Fetch test details (name) khi component mount
  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!examId) return;
      try {
        setTestLoadingName(true);
        const response = await axiosInstance.get(`/tests/${examId}`);
        if (response.result?.title || response.result?.name) {
          setTestName(response.result.title || response.result.name);
        }
      } catch (err) {
        console.error("Error fetching test details:", err);
      } finally {
        setTestLoadingName(false);
      }
    };
    fetchTestDetails();
  }, [examId]);

  // ✅ Fetch attempts khi component mount
  useEffect(() => {
    fetchTestAttempts();
  }, [fetchTestAttempts]);

  // Format date to Vietnamese format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format result display
  const formatResult = (rightAnswerNumber, totalQuestions = 200) => {
    if (rightAnswerNumber === null || rightAnswerNumber === undefined) {
      return "Chưa chấm";
    }
    return `${rightAnswerNumber}/${totalQuestions}`;
  };

  // Calculate score if mark is available
  const formatScore = (mark) => {
    if (mark === null || mark === undefined) {
      return "Chưa có điểm";
    }
    return `${Math.round(mark)}/990`;
  };

  // ✅ View detailed results
  const handleViewDetails = async (attempt) => {
    try {
      setDetailsLoading(true);

      // Fetch correct answers from API
      const correctAnswersRes = await axiosInstance.get(
        `/tests/${examId}/result`,
      );
      const correctAnswersSections =
        correctAnswersRes.result?.correctAnswers || [];

      // Build map: number -> userAnswer from attempt
      const numberToUserAnswer = new Map();
      const numberToAttemptData = new Map();
      attempt.answers.forEach((ans) => {
        numberToUserAnswer.set(ans.number, ans.answer);
        // ✅ Lưu toàn bộ data của câu để lấy questionText, options, images...
        numberToAttemptData.set(ans.number, ans);
      });

      // Build detailed answers array from correctAnswersSections (include all 200 questions)
      const detailedAnswers = [];
      correctAnswersSections.forEach((section) => {
        section.questions?.forEach((q) => {
          const userAnswer = numberToUserAnswer.get(q.number);
          const attemptData = numberToAttemptData.get(q.number) || {};
          // ✅ Compare with trim() and String() conversion
          const isCorrect =
            userAnswer &&
            q.answer &&
            String(userAnswer).trim() === String(q.answer).trim();

          detailedAnswers.push({
            number: q.number,
            part: section.part,
            userAnswer: userAnswer || null,
            correctAnswer: q.answer || null,
            isCorrect: isCorrect,
            // ✅ Thêm các field từ attempt data (đã được lưu vào DB)
            questionText: attemptData.questionText || "",
            options: attemptData.options || [],
            imageUrl: attemptData.imageUrl || "",
            mediaUrl: attemptData.mediaUrl || "",
            paragraph: attemptData.paragraph || "",
          });
        });
      });

      // Calculate listening vs reading scores
      const listeningAnswers = detailedAnswers.filter((a) => a.part <= 4);
      const readingAnswers = detailedAnswers.filter((a) => a.part > 4);

      const listeningCorrect = listeningAnswers.filter(
        (a) => a.isCorrect,
      ).length;
      const readingCorrect = readingAnswers.filter((a) => a.isCorrect).length;

      // ✅ Use score module to calculate correct scores (matching TOEIC lookup table)
      const listeningScore = score.calculateListeningScore(listeningCorrect);
      const readingScore = score.calculateReadingScore(readingCorrect);
      const totalScore = listeningScore + readingScore;

      // Build summary object
      const summary = {
        listeningCorrect,
        readingCorrect,
        listeningScore,
        readingScore,
        totalScore,
      };

      // Build meta object
      const meta = {
        examId: examId,
        answeredCount: attempt.answers.length,
        totalQuestions: 200,
      };

      // Build complete payload for DisplayResultTest
      const resultPayload = {
        summary,
        detailedAnswers,
        meta,
      };

      // Store in sessionStorage as backup
      sessionStorage.setItem(
        `toeic_result_${examId}`,
        JSON.stringify(resultPayload),
      );

      // Navigate to result page with data in location.state
      navigate(`/toeic-home/test-online/${examId}/result`, {
        state: resultPayload,
      });
    } catch (err) {
      console.error("Error viewing details:", err);
      alert(
        "Không thể tải chi tiết kết quả. Vui lòng thử lại sau: " +
          (err.message || "Unknown error"),
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* MAIN CONTENT - FULL WIDTH */}
        <div className="w-full bg-white shadow rounded-lg p-6 sm:p-8">
          {/* Tag + Title */}
          <div className="mb-4">
            <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
              TOEIC
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-4 flex items-center">
            {testLoadingName ? (
              <span className="text-gray-400">Đang tải tên đề thi...</span>
            ) : (
              <>
                {testName}
                <span className="ml-2 text-green-500">
                  <i className="fas fa-check-circle"></i>
                </span>
              </>
            )}
          </h1>

          {/* MAIN NAV PILLS */}
          <ul className="flex border-b mb-6">
            <li className="mr-6 pb-2 border-b-2 border-blue-600 text-blue-600 font-semibold">
              Thông tin đề thi
            </li>
          </ul>

          {/* TAB CONTENT */}
          <div>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <div>
                <i className="far fa-clock mr-1"></i> Thời gian làm bài:{" "}
                <span className="font-medium">120 phút</span> | 7 phần thi | 200
                câu hỏi | <span>4108 bình luận</span>
              </div>
              <div>
                <i className="fad fa-user-edit mr-1"></i> 2,100,201 người đã
                luyện tập đề thi này
              </div>
            </div>

            <p className="text-red-500 italic text-sm mb-6">
              Chú ý: để được quy đổi sang scaled score (ví dụ trên thang điểm
              990 TOEIC), vui lòng chọn chế độ làm FULL TEST.
            </p>

            {/* BẢNG KẾT QUẢ LÀM BÀI */}
            <div className="border-t py-6">
              <h2 className="text-lg font-semibold mb-4">
                Kết quả làm bài của bạn
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Đang tải kết quả...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                  {error}
                </div>
              ) : testAttempts.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <p>Bạn chưa làm bài này lần nào. Hãy bắt đầu luyện tập!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border text-sm border-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 border text-left">Ngày làm</th>
                        <th className="px-3 py-2 border text-center">
                          Kết quả
                        </th>
                        <th className="px-3 py-2 border text-center">Điểm</th>
                        <th className="px-3 py-2 border text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {testAttempts.map((attempt, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border px-3 py-2">
                            <div className="font-medium">
                              {formatDate(attempt.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(attempt.createdAt).toLocaleTimeString(
                                "vi-VN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </div>
                          </td>
                          <td className="border px-3 py-2 text-center font-semibold text-blue-600">
                            {formatResult(attempt.rightAnswerNumber)}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            {formatScore(attempt.mark)}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            <button
                              onClick={() => handleViewDetails(attempt)}
                              disabled={detailsLoading}
                              className="text-blue-600 hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* SECONDARY TAB */}
          <ul className="flex border-b mb-6">
            {[
              { id: "practice", label: "Luyện tập" },
              { id: "fulltest", label: "Làm full test" },
              { id: "discussion", label: "Thảo luận" },
            ].map((tab) => (
              <li
                key={tab.id}
                className={`mr-6 pb-2 cursor-pointer ${
                  subTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                    : "text-gray-500 hover:text-blue-600"
                }`}
                onClick={() => setSubTab(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </ul>

          {/* SUB TAB CONTENT */}
          {subTab === "practice" && (
            <div className="space-y-6">
              <PracticeModeTest testName={testName} />
            </div>
          )}
          {subTab === "fulltest" && <FullTestSection testName={testName} />}
          {subTab === "discussion" && <DiscussionSection />}
        </div>
      </div>
    </div>
  );
};

export default PracticeTabs;
