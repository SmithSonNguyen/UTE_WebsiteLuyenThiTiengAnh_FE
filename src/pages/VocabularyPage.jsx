import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LessonCarousel from "@/components/design/vocabulary/LessonCarousel";
import { FlashcardView } from "@/components/design/vocabulary/FlashcardView";
import QuizGame from "@/components/design/vocabulary/QuizGame";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const VocabularyPage = () => {
  const [appState, setAppState] = useState("lessons");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Lấy user từ Redux (giống FreeEntryTest_FullTest)
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);
  const accessToken = useSelector((state) => state?.auth?.login?.accessToken);

  // Debug
  useEffect(() => {
    console.log("VocabularyPage - Current user:", currentUser);
    console.log("VocabularyPage - Access token exists:", !!accessToken);
  }, [currentUser, accessToken]);

  // ✅ Check authentication - đơn giản hơn, không cần fetch /users/me
  const isAuthenticated = !!(currentUser || accessToken);

  // ✅ Fetch lessons với progress
  useEffect(() => {
    const fetchLessonsWithProgress = async () => {
      if (!isAuthenticated) {
        console.log("User not authenticated, skipping fetch");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("=== FETCHING VOCABULARY DATA ===");
        console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

        // 1. Fetch vocabulary data (public route)
        const vocabUrl = `${
          import.meta.env.VITE_BACKEND_URL
        }/lessons/six-hundred-new-vocabulary`;
        console.log("Fetching vocabulary from:", vocabUrl);

        const vocabRes = await fetch(vocabUrl);
        console.log("Vocabulary response status:", vocabRes.status);

        if (!vocabRes.ok) {
          throw new Error(
            `Vocabulary API error: ${vocabRes.status} ${vocabRes.statusText}`
          );
        }

        const vocabJson = await vocabRes.json();
        console.log("Vocabulary raw response:", vocabJson);
        console.log("Vocabulary response type:", typeof vocabJson);
        console.log("Is array?", Array.isArray(vocabJson));

        const vocabData = vocabJson.data || vocabJson;
        console.log("Extracted vocabData:", vocabData);
        console.log("VocabData length:", vocabData?.length);

        if (!Array.isArray(vocabData)) {
          console.error(
            "Invalid vocabulary data format. Expected array, got:",
            typeof vocabData
          );
          throw new Error("Invalid vocabulary data format - not an array");
        }

        if (vocabData.length === 0) {
          console.warn("Vocabulary data is empty!");
          toast({
            title: "No Data",
            description: "No vocabulary lessons available yet.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        console.log("Sample vocabulary item:", vocabData[0]);

        // 2. Fetch user progress - dùng axiosInstance (tự động thêm auth header)
        console.log("=== FETCHING USER PROGRESS ===");
        let userProgress = [];

        try {
          const progressRes = await axiosInstance.get(
            `/lessons/progress/lessons`
          );
          console.log("Progress raw response:", progressRes);

          userProgress = Array.isArray(progressRes)
            ? progressRes
            : progressRes?.data || [];

          console.log("User progress array:", userProgress);
          console.log("Progress count:", userProgress.length);
        } catch (progressError) {
          console.warn(
            "Could not fetch progress (might be first time):",
            progressError
          );
          // Không throw error - cho phép tiếp tục với progress rỗng
          userProgress = [];
        }

        // 3. Group vocabulary theo lesson
        console.log("=== GROUPING VOCABULARY ===");
        const grouped = vocabData.reduce((acc, item, index) => {
          const lessonNumber = item.lesson;

          if (!lessonNumber) {
            console.warn(`Item ${index} missing lesson number:`, item);
            return acc;
          }

          if (!acc[lessonNumber]) {
            acc[lessonNumber] = {
              id: lessonNumber,
              title: `Lesson ${lessonNumber}`,
              words: [],
            };
          }

          acc[lessonNumber].words.push({
            english: item.vocab,
            vietnamese: item.meaning_vi,
            pronunciation: item.explanation_en,
            exampleEn: item.example_en,
            exampleVi: item.example_vi,
          });
          return acc;
        }, {});

        console.log("Grouped lessons:", Object.keys(grouped));
        console.log("Total lessons:", Object.keys(grouped).length);

        // 4. Merge với user progress
        console.log("=== MERGING WITH PROGRESS ===");
        const mergedLessons = Object.values(grouped).map((lesson) => {
          const progressData = userProgress.find((p) => p.id === lesson.id);
          return {
            ...lesson,
            progress: progressData?.progress || 0,
            completed: progressData?.completed || false,
            unlocked: progressData?.unlocked || lesson.id === 1,
            quizAttempts: progressData?.quizAttempts || 0,
            bestScore: progressData?.bestScore || 0,
          };
        });

        console.log("=== FINAL LESSONS ===");
        console.log("Merged lessons count:", mergedLessons.length);
        console.log("Sample lesson:", mergedLessons[0]);

        setLessons(mergedLessons);

        toast({
          title: "Lessons Loaded",
          description: `${mergedLessons.length} lessons ready to learn!`,
        });
      } catch (error) {
        console.error("=== ERROR FETCHING DATA ===");
        console.error("Error type:", error.constructor.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error:", error);

        // Kiểm tra nếu là lỗi 401 (authentication)
        if (error?.response?.status === 401 || error?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please login again to continue.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          toast({
            title: "Error Loading Data",
            description:
              error.message || "Could not fetch vocabulary or progress.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLessonsWithProgress();
  }, [isAuthenticated]);

  // ✅ Track thời gian học
  useEffect(() => {
    if (!currentLesson || appState === "lessons" || !isAuthenticated) return;

    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 60000); // minutes
      if (timeSpent > 0) {
        console.log(
          `Tracking time for lesson ${currentLesson.id}: ${timeSpent} minutes`
        );

        axiosInstance
          .patch(`/lessons/progress/lessons/${currentLesson.id}/time`, {
            timeSpent,
          })
          .catch((err) => console.error("Error tracking time:", err));
      }
    };
  }, [currentLesson, appState, isAuthenticated]);

  const handleLessonSelect = (lesson) => {
    if (!lesson.unlocked) {
      toast({
        title: "Lesson Locked 🔒",
        description: "Complete the previous lesson to unlock this one!",
        variant: "destructive",
      });
      return;
    }

    setCurrentLesson(lesson);
    setAppState("flashcards");
    toast({
      title: "Lesson Started!",
      description: `Beginning ${lesson.title} with ${lesson.words.length} words.`,
    });
  };

  const handleFlashcardsComplete = () => {
    setAppState("quiz");
    toast({
      title: "Flashcards Complete!",
      description: "Ready for the quiz? Let's test your knowledge!",
    });
  };

  const handleQuizComplete = async (score, totalQuestions) => {
    if (!currentLesson) {
      console.error("Missing lesson:", { currentLesson });
      return;
    }

    try {
      console.log("=== SUBMITTING QUIZ RESULT ===");
      console.log("Submitting quiz result:", {
        lessonId: currentLesson.id,
        score,
        totalQuestions,
      });

      // Gửi kết quả quiz lên server - dùng axiosInstance
      const result = await axiosInstance.post(`/lessons/progress/quiz`, {
        lessonId: currentLesson.id,
        lessonTitle: currentLesson.title,
        score,
        totalQuestions,
        totalWords: currentLesson.words.length,
      });

      console.log("Quiz result response:", result);

      // Check success từ response
      const isSuccess = result?.success !== false;

      if (isSuccess) {
        const percentage = (score / totalQuestions) * 100;
        const isPassed = percentage >= 80 || score >= 5;

        console.log("Quiz result:", {
          percentage,
          isPassed,
          score,
          totalQuestions,
        });

        // Cập nhật UI local
        const updatedLessons = lessons.map((lesson) => {
          if (lesson.id === currentLesson.id) {
            return {
              ...lesson,
              progress: Math.max(lesson.progress, Math.round(percentage)),
              completed: isPassed,
              quizAttempts: (lesson.quizAttempts || 0) + 1,
              bestScore: Math.max(lesson.bestScore || 0, score),
            };
          }
          // Mở khóa lesson tiếp theo
          if (isPassed && lesson.id === currentLesson.id + 1) {
            return {
              ...lesson,
              unlocked: true,
            };
          }
          return lesson;
        });

        console.log("Updated lessons:", updatedLessons);
        setLessons(updatedLessons);

        // Toast notification
        if (isPassed) {
          toast({
            title: "Congratulations! 🎉",
            description: `You scored ${score}/${totalQuestions}. Next lesson unlocked!`,
          });
        } else {
          toast({
            title: "Good Effort! 👏",
            description: `You scored ${score}/${totalQuestions}. You need at least 5 correct answers or 80% to unlock the next lesson.`,
          });
        }
      } else {
        console.error("Quiz submission failed:", result);
        toast({
          title: "Error",
          description: "Could not save your progress. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("=== ERROR SUBMITTING QUIZ ===");
      console.error("Error updating progress:", error);
      console.error("Error details:", error?.response || error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Could not save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRetryLesson = () => setAppState("flashcards");

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson && nextLesson.unlocked) {
      setCurrentLesson(nextLesson);
      setAppState("flashcards");
      toast({
        title: "Next Lesson Started!",
        description: `Beginning ${nextLesson.title}`,
      });
    } else if (nextLesson && !nextLesson.unlocked) {
      toast({
        title: "Lesson Locked 🔒",
        description: "Complete the current lesson first.",
        variant: "destructive",
      });
    } else {
      setAppState("lessons");
      toast({
        title: "All Lessons Complete! 🎉",
        description: "Great job finishing all lessons!",
      });
    }
  };

  const handleBackToLessons = () => {
    setAppState("lessons");
    setCurrentLesson(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading lessons...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để truy cập vào thư viện bài học từ vựng và theo
            dõi tiến độ của bạn.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            📚 Vocabulary Master
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Master English vocabulary with interactive flashcards and quizzes.
          </p>
          {currentUser && (
            <p className="text-sm text-muted-foreground mt-2">
              Logged in as:{" "}
              <span className="font-semibold">
                {currentUser.email || currentUser.username || currentUser.name}
              </span>
            </p>
          )}
        </header>

        <main>
          {appState === "lessons" && (
            <>
              {lessons.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Lessons Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Please check the console for error details or contact
                    support.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              ) : (
                <LessonCarousel
                  lessons={lessons}
                  currentLessonId={currentLesson?.id || null}
                  onLessonSelect={handleLessonSelect}
                />
              )}
            </>
          )}

          {appState === "flashcards" && currentLesson && (
            <FlashcardView
              words={currentLesson.words}
              lessonTitle={currentLesson.title}
              onComplete={handleFlashcardsComplete}
              onBack={handleBackToLessons}
            />
          )}

          {appState === "quiz" && currentLesson && (
            <QuizGame
              words={currentLesson.words}
              onComplete={handleQuizComplete}
              onRetry={handleRetryLesson}
              onNextLesson={handleNextLesson}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default VocabularyPage;
