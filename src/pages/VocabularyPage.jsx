import { useState, useEffect } from "react";
import LessonCarousel from "@/components/design/vocabulary/LessonCarousel";
import { FlashcardView } from "@/components/design/vocabulary/FlashcardView";
import QuizGame from "@/components/design/vocabulary/QuizGame";
import { toast } from "@/hooks/use-toast";

const VocabularyPage = () => {
  const [appState, setAppState] = useState("lessons");
  const [currentLesson, setCurrentLesson] = useState(null);
  const [lessons, setLessons] = useState([]);

  // ✅ Fetch from API
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/lessons/six-hundred-new-vocabulary"
        );
        const json = await res.json();
        const data = json.data;

        // Group theo lesson
        const grouped = data.reduce((acc, item) => {
          const lessonNumber = item.lesson;
          if (!acc[lessonNumber]) {
            acc[lessonNumber] = {
              id: lessonNumber,
              title: `Lesson ${lessonNumber}`,
              progress: 0,
              completed: false,
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

        setLessons(Object.values(grouped));
      } catch {
        toast({
          title: "Error Loading Vocabulary",
          description: "Could not fetch vocabulary from API.",
        });
      }
    };

    fetchVocabulary();
  }, []);

  const handleLessonSelect = (lesson) => {
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

  const handleQuizComplete = (score) => {
    if (!currentLesson) return;
    const totalQuestions = Math.min(6, currentLesson.words.length * 2);
    const percentage = (score / totalQuestions) * 100;

    const updatedLessons = lessons.map((lesson) => {
      if (lesson.id === currentLesson.id) {
        return {
          ...lesson,
          progress: Math.max(lesson.progress, Math.round(percentage)),
          completed: percentage >= 80,
        };
      }
      return lesson;
    });

    setLessons(updatedLessons);

    toast({
      title: percentage >= 80 ? "Congratulations! 🎉" : "Good Effort! 👏",
      description: `You scored ${score}/${totalQuestions}. ${
        percentage >= 80 ? "Lesson completed!" : "Keep practicing!"
      }`,
    });
  };

  const handleRetryLesson = () => setAppState("flashcards");

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === currentLesson.id);
    const nextLesson = lessons[currentIndex + 1];

    if (nextLesson) {
      setCurrentLesson(nextLesson);
      setAppState("flashcards");
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
        </header>

        <main>
          {appState === "lessons" && (
            <LessonCarousel
              lessons={lessons}
              currentLessonId={currentLesson?.id || null}
              onLessonSelect={handleLessonSelect}
            />
          )}

          {appState === "flashcards" && currentLesson && (
            <FlashcardView
              words={currentLesson.words}
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
