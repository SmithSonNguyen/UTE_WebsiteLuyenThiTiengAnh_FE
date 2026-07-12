import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  CheckCircle,
  Clock,
  Menu,
  X,
  ChevronRight,
  Star,
  BookOpen,
  ArrowLeft,
  Lock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trophy,
  ChevronDown,
} from "lucide-react";

// ─── Quiz Component ──────────────────────────────────────────────────────────
const VideoQuiz = ({ questions, onPassed }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  if (!questions || questions.length === 0) return null;

  const handleSelect = (qIndex, label) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: label }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const detail = questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      return { isCorrect, chosen: answers[i], correct: q.correctAnswer };
    });
    const passed = correct === questions.length;
    setResults({ correct, total: questions.length, passed, detail });
    setSubmitted(true);
    if (passed) onPassed();
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="mt-6 bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gradient-to-r from-indigo-900/40 to-purple-900/40">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Kiểm tra sau video</h3>
          <p className="text-xs text-gray-400">
            Trả lời đúng tất cả {questions.length} câu hỏi để tiếp tục
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {questions.map((q, qIndex) => {
          const chosen = answers[qIndex];
          const result = results?.detail[qIndex];
          return (
            <div key={qIndex} className="space-y-3">
              {/* Question text */}
              <p className="text-white font-medium leading-relaxed">
                <span className="text-indigo-400 mr-2">Câu {qIndex + 1}.</span>
                {q.questionText}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt) => {
                  let optClass =
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all";

                  if (!submitted) {
                    optClass +=
                      chosen === opt.label
                        ? " border-indigo-500 bg-indigo-500/10 text-white"
                        : " border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800";
                  } else {
                    // After submit
                    if (opt.label === q.correctAnswer) {
                      optClass +=
                        " border-green-500 bg-green-500/10 text-green-300";
                    } else if (opt.label === chosen && !result?.isCorrect) {
                      optClass += " border-red-500 bg-red-500/10 text-red-300";
                    } else {
                      optClass +=
                        " border-gray-700 bg-gray-800/30 text-gray-500";
                    }
                  }

                  return (
                    <div
                      key={opt.label}
                      className={optClass}
                      onClick={() => handleSelect(qIndex, opt.label)}
                    >
                      <span
                        className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-bold
                          ${
                            !submitted
                              ? chosen === opt.label
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-700 text-gray-400"
                              : opt.label === q.correctAnswer
                                ? "bg-green-500 text-white"
                                : opt.label === chosen && !result?.isCorrect
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-700 text-gray-500"
                          }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-sm leading-snug">{opt.text}</span>
                      {submitted && opt.label === q.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
                      )}
                      {submitted &&
                        opt.label === chosen &&
                        !result?.isCorrect && (
                          <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Result banner */}
        {submitted && results && (
          <div
            className={`flex items-center gap-3 p-4 rounded-xl border ${
              results.passed
                ? "border-green-500/50 bg-green-500/10"
                : "border-red-500/50 bg-red-500/10"
            }`}
          >
            {results.passed ? (
              <Trophy className="w-6 h-6 text-green-400 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            )}
            <div className="flex-1">
              {results.passed ? (
                <p className="text-green-300 font-semibold">
                  Xuất sắc! Bạn đã trả lời đúng {results.correct}/
                  {results.total} câu — có thể chuyển sang bài tiếp!
                </p>
              ) : (
                <p className="text-red-300 font-semibold">
                  Bạn trả lời đúng {results.correct}/{results.total} câu. Cần
                  đúng tất cả để tiếp tục.
                </p>
              )}
            </div>
            {!results.passed && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Làm lại
              </button>
            )}
          </div>
        )}

        {/* Submit button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {allAnswered
              ? "Nộp câu trả lời"
              : `Còn ${questions.length - Object.keys(answers).length} câu chưa trả lời`}
          </button>
        )}
      </div>
    </div>
  );
};

// THAY ĐỔI THỜI GIAN XEM BẮT BUỘC TẠI ĐÂY (đơn vị: giây)
// Mặc định: 90 * 60 = 5400 giây (90 phút). Bạn có thể đổi thành ví dụ: 5 để test nhanh.
const REQUIRED_WATCH_TIME = 1 * 60;

// ─── Main Page ────────────────────────────────────────────────────────────────
const CourseLearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]); // orders already completed
  const [currentVideoPassed, setCurrentVideoPassed] = useState(false); // quiz passed for current video
  const [watchTime, setWatchTime] = useState(0); // watch time for current video (seconds)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progressLoading, setProgressLoading] = useState(false);

  const accessTokenFromStore = useSelector(
    (state) => state?.auth?.login?.accessToken,
  );

  // Synchronous references to prevent race conditions during state updates on video switch
  const watchTimeRef = useRef(0);
  const currentVideoPassedRef = useRef(false);
  const currentVideoRef = useRef(null);

  // Keep references synced with their state equivalents
  useEffect(() => {
    currentVideoPassedRef.current = currentVideoPassed;
  }, [currentVideoPassed]);

  useEffect(() => {
    currentVideoRef.current = currentVideo;
  }, [currentVideo]);

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!accessTokenFromStore) {
      setError("Vui lòng đăng nhập để xem khóa học");
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, accessTokenFromStore]);

  // Reset quiz state whenever video changes
  useEffect(() => {
    if (!currentVideo) return;
    const hasQuestions =
      currentVideo.questions && currentVideo.questions.length > 0;
    // If no questions or already completed → auto-pass
    setCurrentVideoPassed(
      !hasQuestions || completedVideos.includes(currentVideo.order),
    );
  }, [currentVideo, completedVideos]);

  // Watch Time Timer logic
  useEffect(() => {
    if (!currentVideo) return;

    // Reset watchTime ref and state synchronously
    const isCompleted = completedVideos.includes(currentVideo.order);
    if (isCompleted) {
      watchTimeRef.current = REQUIRED_WATCH_TIME;
      setWatchTime(REQUIRED_WATCH_TIME);
      return;
    }

    watchTimeRef.current = 0;
    setWatchTime(0);

    const interval = setInterval(() => {
      // Only increment if document is active / visible
      if (document.visibilityState === "visible") {
        watchTimeRef.current += 1;
        setWatchTime(watchTimeRef.current);

        // Check if both watch time and quiz requirements are met
        if (watchTimeRef.current >= REQUIRED_WATCH_TIME) {
          clearInterval(interval);
          if (currentVideoPassedRef.current) {
            triggerVideoCompletion();
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentVideo, completedVideos]);

  // Separate trigger when quiz passes after watch time is already met
  useEffect(() => {
    if (!currentVideo) return;
    if (completedVideos.includes(currentVideo.order)) return;

    if (currentVideoPassed && watchTimeRef.current >= REQUIRED_WATCH_TIME) {
      triggerVideoCompletion();
    }
  }, [currentVideoPassed]);

  const fetchCourseData = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        fetch(
          `${import.meta.env.VITE_BACKEND_URL}/courses/enrolled/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${accessTokenFromStore}`,
              "Content-Type": "application/json",
            },
          },
        ),
        fetch(
          `${import.meta.env.VITE_BACKEND_URL}/courses/progress/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${accessTokenFromStore}`,
            },
          },
        ),
      ]);

      if (courseRes.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      if (courseRes.status === 403) {
        setError(
          "Bạn chưa mua khóa học này. Vui lòng mua khóa học để tiếp tục.",
        );
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      if (courseRes.status === 404) {
        setError("Không tìm thấy khóa học.");
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      if (!courseRes.ok) throw new Error("Không thể tải khóa học");

      const data = await courseRes.json();
      console.log("Course API Response:", data);
      if (!data || !data.videoLessons) {
        setError("Dữ liệu khóa học không hợp lệ.");
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setCourse(data);

      // Load progress
      let completed = [];
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        console.log("Progress API Response:", progressData);
        completed = progressData.result?.completedVideoOrders || [];
        setCompletedVideos(completed);
      }

      // Set first video
      if (data.videoLessons.length > 0) {
        const firstVideo = data.videoLessons[0];
        console.log("Setting first video:", firstVideo);
        setCurrentVideo(firstVideo);
        const hasQ = firstVideo.questions && firstVideo.questions.length > 0;
        setCurrentVideoPassed(!hasQ || completed.includes(firstVideo.order));
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching course:", err);
      setError(err.message || "Có lỗi xảy ra khi tải khóa học");
      setAccessDenied(true);
      setLoading(false);
    }
  };

  // ── Navigation helpers ────────────────────────────────────────────────────
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleVideoSelect = (video) => {
    console.log("Selected video details:", video);
    setCurrentVideo(video);
    setSidebarOpen(false);
    const hasQ = video.questions && video.questions.length > 0;
    setCurrentVideoPassed(!hasQ || completedVideos.includes(video.order));
  };

  /** Called by VideoQuiz when user answers all correctly */
  const handleQuizPassed = () => {
    setCurrentVideoPassed(true);
  };

  const triggerVideoCompletion = async () => {
    if (!currentVideo || completedVideos.includes(currentVideo.order)) return;

    // Optimistic update
    const newCompleted = [...completedVideos, currentVideo.order];
    setCompletedVideos(newCompleted);

    // Persist to backend
    try {
      setProgressLoading(true);
      await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/courses/progress/${courseId}/complete-video`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessTokenFromStore}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoOrder: currentVideo.order }),
        },
      );
      console.log(
        "Successfully saved progress for video order:",
        currentVideo.order,
      );
    } catch (err) {
      console.error("Failed to save progress:", err);
    } finally {
      setProgressLoading(false);
    }
  };

  const handleNextVideo = () => {
    if (
      !course ||
      !currentVideo ||
      !completedVideos.includes(currentVideo.order)
    )
      return;
    const currentIndex = course.videoLessons.findIndex(
      (v) => v.order === currentVideo.order,
    );
    if (currentIndex < course.videoLessons.length - 1) {
      handleVideoSelect(course.videoLessons[currentIndex + 1]);
    }
  };

  const handlePreviousVideo = () => {
    if (!course || !currentVideo) return;
    const currentIndex = course.videoLessons.findIndex(
      (v) => v.order === currentVideo.order,
    );
    if (currentIndex > 0) {
      handleVideoSelect(course.videoLessons[currentIndex - 1]);
    }
  };

  const calculateProgress = () => {
    if (!course || !course.videoLessons) return 0;
    return Math.round(
      (completedVideos.length / course.videoLessons.length) * 100,
    );
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto" />
          <p className="mt-4 text-gray-300">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (accessDenied || error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-950 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mx-auto">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              Không thể truy cập
            </h2>
            <p className="text-gray-300 mb-6">
              {error || "Bạn chưa mua khóa học này."}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/toeic-home/all-course")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Khám phá khóa học</span>
              </button>
              <button
                onClick={() => navigate("/my-enrolled-courses")}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Quay lại khóa học của tôi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-300">
          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Không tìm thấy khóa học</p>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const currentVideoHasQuestions =
    currentVideo?.questions && currentVideo.questions.length > 0;
  const isLastVideo = currentVideo?.order === course.videoLessons?.length;
  const isFirstVideo = currentVideo?.order === 1;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-900">
      {/* ── Header ── */}
      <div className="bg-gray-950 border-b border-gray-800 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => navigate("/my-courses")}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                title="Quay lại khóa học của tôi"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-300" />
              </button>

              <div className="flex-1 min-w-0">
                <h1 className="text-white font-semibold truncate text-sm lg:text-base">
                  {course.title}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>
                      {completedVideos.length}/
                      {course.videoLessons?.length || 0} bài
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-32 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{progress}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
                <Star className="w-4 h-4" />
                <span>Đánh giá</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* ── Sidebar ── */}
        <div
          className={`
            fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-80 bg-gray-950 border-r border-gray-800
            transform transition-transform duration-300 z-30 overflow-hidden flex flex-col
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="p-4 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold">Nội dung khóa học</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-800 rounded"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {course.videoLessons?.length || 0} bài học
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.videoLessons?.map((video, index) => {
              const isActive = currentVideo?.order === video.order;
              const isCompleted = completedVideos.includes(video.order);
              const isUnlocked =
                video.order === 1 || completedVideos.includes(video.order - 1);
              const hasQ = video.questions && video.questions.length > 0;

              return (
                <button
                  key={video.order}
                  disabled={!isUnlocked}
                  onClick={() => isUnlocked && handleVideoSelect(video)}
                  className={`
                    w-full p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors text-left
                    ${isActive ? "bg-gray-800 border-l-4 border-indigo-500" : ""}
                    ${!isUnlocked ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-sm
                        ${
                          isCompleted
                            ? "bg-green-500/20 text-green-400"
                            : !isUnlocked
                              ? "bg-gray-900 text-gray-600"
                              : "bg-gray-800 text-gray-400"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" fill="currentColor" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium line-clamp-2 ${
                          isActive
                            ? "text-white"
                            : !isUnlocked
                              ? "text-gray-500"
                              : "text-gray-300"
                        }`}
                      >
                        {index + 1}. {video.title}
                      </p>
                      {video.duration && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{video.duration}</span>
                        </div>
                      )}
                      {hasQ && (
                        <div
                          className={`flex items-center gap-1 mt-1 text-xs ${!isUnlocked ? "text-gray-600" : "text-indigo-400"}`}
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>{video.questions.length} câu hỏi</span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-4">
              <iframe
                src={getYouTubeEmbedUrl(currentVideo?.url)}
                title={currentVideo?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              />
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between mb-4 gap-4">
              <button
                onClick={handlePreviousVideo}
                disabled={isFirstVideo}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span className="hidden sm:inline">Bài trước</span>
              </button>

              <div className="flex-1 text-center">
                <h2 className="text-xl font-bold text-white mb-1">
                  {currentVideo?.title}
                </h2>
                <p className="text-sm text-gray-400">
                  Bài {currentVideo?.order} / {course.videoLessons?.length || 0}
                </p>
              </div>

              <button
                onClick={handleNextVideo}
                disabled={
                  isLastVideo || !completedVideos.includes(currentVideo?.order)
                }
                title={
                  !completedVideos.includes(currentVideo?.order)
                    ? "Hoàn thành các yêu cầu (xem video & trả lời quiz) để tiếp tục"
                    : ""
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${
                  isLastVideo || !completedVideos.includes(currentVideo?.order)
                    ? "bg-gray-800/50 cursor-not-allowed opacity-60"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                <span className="hidden sm:inline">Bài tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Watch progress banner */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Yêu cầu xem video
                  </h4>
                  <p className="text-xs text-gray-400">
                    Bắt buộc xem ít nhất {Math.floor(REQUIRED_WATCH_TIME / 60)}{" "}
                    phút
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                <div className="flex justify-between w-full sm:justify-end text-xs text-gray-400 gap-2">
                  <span>Tiến độ xem:</span>
                  <span className="font-semibold text-white">
                    {Math.floor(watchTime / 60)} phút {watchTime % 60} giây /{" "}
                    {Math.floor(REQUIRED_WATCH_TIME / 60)} phút
                  </span>
                </div>
                <div className="w-full sm:w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-300"
                    style={{
                      width: `${Math.min((watchTime / REQUIRED_WATCH_TIME) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Lock notice */}
            {((currentVideoHasQuestions && !currentVideoPassed) ||
              watchTime < REQUIRED_WATCH_TIME) &&
              !completedVideos.includes(currentVideo?.order) && (
                <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="text-sm text-amber-300">
                    {watchTime < REQUIRED_WATCH_TIME && (
                      <p>
                        • Bạn cần xem thêm{" "}
                        {Math.ceil((REQUIRED_WATCH_TIME - watchTime) / 60)} phút
                        để đạt thời lượng yêu cầu.
                      </p>
                    )}
                    {currentVideoHasQuestions && !currentVideoPassed && (
                      <p>
                        • Bạn cần trả lời đúng tất cả câu hỏi trắc nghiệm bên
                        dưới.
                      </p>
                    )}
                  </div>
                </div>
              )}

            {/* Completed badge */}
            {completedVideos.includes(currentVideo?.order) && (
              <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <p className="text-sm text-green-300">
                  Bạn đã hoàn thành đầy đủ yêu cầu cho bài học này! (Đã xem đủ{" "}
                  {Math.floor(REQUIRED_WATCH_TIME / 60)} phút & vượt qua quiz).
                  {progressLoading && (
                    <span className="text-gray-400 text-xs ml-1">
                      Đang lưu...
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Course completion banner */}
            {completedVideos.length > 0 &&
              course.videoLessons &&
              completedVideos.length === course.videoLessons.length && (
                <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-pink-900/60 border border-indigo-500/50 rounded-2xl p-6 mb-6 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl" />

                  <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-pink-500 text-white text-3xl shadow-lg animate-bounce">
                      🎉
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">
                        Chúc mừng! Bạn đã hoàn thành khóa học!
                      </h3>
                      <p className="text-sm text-gray-300 mt-1 max-w-lg mx-auto leading-relaxed">
                        Bạn đã xem toàn bộ các bài học và trả lời đúng tất cả
                        quiz. Hãy làm bài test cuối khóa ngay bây giờ để đánh
                        giá năng lực và thăng cấp trình độ của bạn!
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/course-end-test")}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white font-extrabold rounded-xl transition-all shadow-md hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 text-sm"
                    >
                      <Trophy className="w-5 h-5" />
                      Làm bài test cuối khóa ngay
                    </button>
                  </div>
                </div>
              )}

            {/* Course overview */}
            <div className="bg-gray-950 rounded-xl border border-gray-800 p-6 mb-2">
              <h3 className="text-lg font-semibold text-white mb-3">
                Về khóa học này
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {course.description}
              </p>
              {course.targetScoreRange && (
                <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Mục tiêu điểm số
                  </h4>
                  <p className="text-gray-300">
                    {course.targetScoreRange.min} –{" "}
                    {course.targetScoreRange.max} điểm
                  </p>
                </div>
              )}
            </div>

            {/* Quiz section */}
            <VideoQuiz
              key={currentVideo?.order}
              questions={currentVideo?.questions || []}
              onPassed={handleQuizPassed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
