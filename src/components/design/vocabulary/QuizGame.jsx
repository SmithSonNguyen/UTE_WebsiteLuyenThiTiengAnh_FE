import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Star,
} from "lucide-react";

const QuizGame = ({ words, onComplete, onRetry, onNextLesson }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);

  // Generate questions from words
  useEffect(() => {
    const generateQuestions = () => {
      const normalizedWords = words.map((w, index) => ({
        id: index,
        vocab: w.vocab || w.english, // tên từ vựng
        meaning: w.meaning_vi || w.vietnamese, // nghĩa tiếng Việt
        example: w.example_en || w.exampleEn || "", // câu ví dụ tiếng anh
      }));

      const questionsGenerated = [];

      normalizedWords.forEach((word) => {
        // Nếu có example_en → tạo dạng Điền vào chỗ trống
        if (word.example && word.example.trim() !== "") {
          // Regex xóa phiên âm và chỉ lấy chữ cái trong vocab để thay thế
          const baseVocab = word.vocab.replace(/\/.*?\//g, "").trim();

          const exampleWithBlank = word.example.replace(
            new RegExp(baseVocab, "gi"),
            "______"
          );

          const allWrongChoices = normalizedWords
            .filter((w) => w.id !== word.id)
            .map((w) => w.vocab);

          const options = [
            word.vocab,
            ...allWrongChoices.sort(() => Math.random() - 0.5).slice(0, 3),
          ].sort(() => Math.random() - 0.5);

          questionsGenerated.push({
            type: "fillBlank",
            question: exampleWithBlank,
            correctAnswer: word.vocab,
            options,
          });
        } else {
          // Trường hợp không có example_en → Quiz chọn nghĩa
          const allWrongMeanings = normalizedWords
            .filter((w) => w.id !== word.id)
            .map((w) => w.meaning);

          const options = [
            word.meaning,
            ...allWrongMeanings.sort(() => Math.random() - 0.5).slice(0, 3),
          ].sort(() => Math.random() - 0.5);

          questionsGenerated.push({
            type: "meaning",
            question: `What does "${word.vocab}" mean in Vietnamese?`,
            correctAnswer: word.meaning,
            options,
          });
        }
      });

      return questionsGenerated.sort(() => Math.random() - 0.5);
    };

    setQuestions(generateQuestions());
  }, [words]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress =
    questions.length > 0
      ? ((currentQuestionIndex + 1) / questions.length) * 100
      : 0;

  const handleAnswerSelect = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correctAnswer;
    setAnswerStatus(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAnswerStatus(null);
    } else {
      setGameComplete(true);
      onComplete(score);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 60) return "Good job! Keep it up! 👏";
    return "Keep practicing! You'll get there! 💪";
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "gradient-success";
    if (percentage >= 60) return "gradient-warm";
    return "gradient-secondary";
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Preparing your quiz...</p>
      </div>
    );
  }

  if (gameComplete) {
    const percentage = (score / questions.length) * 100;
    const isPassed = percentage >= 60;

    const getTextColor = () => {
      if (percentage >= 80) return "text-white"; // For gradient-success
      if (percentage >= 60) return "text-gray-900"; // For gradient-warm
      return "text-white"; // For gradient-secondary
    };

    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card
          className={`p-8 shadow-elevated ${getScoreColor()} ${getTextColor()} bg-gray-800`}
        >
          <div className="celebrate">
            <Trophy className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-bold mb-4">
            {score}/{questions.length}
          </div>
          <p className="text-xl mb-6">{getScoreMessage()}</p>
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-6 h-6 ${
                  i < Math.floor(percentage / 20)
                    ? "fill-current"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={onRetry}
              className="gap-2 border-white/20 text-inherit hover:bg-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              Retry Lesson
            </Button>
            {isPassed && (
              <Button
                variant="secondary"
                onClick={onNextLesson}
                className="gap-2"
              >
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Quiz Time! 📝</h2>
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-8 shadow-card mb-6">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-4">
            {currentQuestion.type === "meaning"
              ? "Translation"
              : "Fill in the Blank"}
          </Badge>
          <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;

            let cardClass =
              "p-4 border-2 cursor-pointer transition-all hover-lift";

            if (showResult) {
              if (isSelected && isCorrect) {
                cardClass += " border-success bg-success/10 text-success";
              } else if (isSelected && !isCorrect) {
                cardClass += " border-error bg-error/10 text-error shake";
              } else if (isCorrect) {
                cardClass += " border-success bg-success/10 text-success";
              } else {
                cardClass += " border-border opacity-50";
              }
            } else {
              cardClass += isSelected
                ? " border-primary bg-primary/10"
                : " border-border hover:border-primary/50";
            }

            return (
              <Card
                key={index}
                className={cardClass}
                onClick={() => handleAnswerSelect(option)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && (
                    <div>
                      {isSelected && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-error" />
                      )}
                      {!isSelected && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Result Feedback */}
        {showResult && (
          <div className="text-center mb-6">
            {answerStatus === "correct" ? (
              <div className="text-success">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">Correct! Well done! 🎉</p>
              </div>
            ) : (
              <div className="text-error">
                <XCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">
                  Not quite right. The correct answer is:{" "}
                  {currentQuestion.correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <div className="text-center">
            <Button
              onClick={handleNextQuestion}
              className="gradient-primary text-primary-foreground gap-2 px-8"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>

      {/* Score Display */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Current Score:{" "}
          <span className="font-semibold text-foreground">
            {score}/
            {currentQuestionIndex +
              (showResult && answerStatus === "correct" ? 1 : 0)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default QuizGame;
