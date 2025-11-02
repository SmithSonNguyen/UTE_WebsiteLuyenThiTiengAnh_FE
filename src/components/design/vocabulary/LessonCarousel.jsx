import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, Lock, Play } from "lucide-react";

const LessonCarousel = ({ lessons, currentLessonId, onLessonSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {lessons.map((lesson) => {
        const isActive = currentLessonId === lesson.id;
        const isLocked = !lesson.unlocked;

        return (
          <Card
            key={lesson.id}
            className={`p-6 transition-all hover:shadow-lg ${
              isActive ? "ring-2 ring-primary" : ""
            } ${isLocked ? "opacity-60" : "hover-lift cursor-pointer"}`}
            onClick={() => !isLocked && onLessonSelect(lesson)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isLocked
                      ? "bg-gray-200"
                      : lesson.completed
                      ? "bg-success/10"
                      : "bg-primary/10"
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-6 h-6 text-gray-400" />
                  ) : lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <BookOpen className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lesson.words.length} words
                  </p>
                </div>
              </div>
              {lesson.completed && (
                <Badge variant="success" className="bg-success/10 text-success">
                  Completed
                </Badge>
              )}
              {isLocked && (
                <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                  Locked
                </Badge>
              )}
            </div>

            {/* Progress */}
            {!isLocked && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {lesson.progress}%
                  </span>
                </div>
                <Progress value={lesson.progress} className="h-2" />
              </div>
            )}

            {/* Lock Message */}
            {isLocked && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  🔒 Complete the previous lesson to unlock
                </p>
              </div>
            )}

            {/* Action Button */}
            <Button
              className={`w-full gap-2 ${
                isLocked
                  ? "bg-gray-300 cursor-not-allowed"
                  : lesson.completed
                  ? "gradient-success"
                  : "gradient-primary"
              }`}
              disabled={isLocked}
              onClick={(e) => {
                e.stopPropagation();
                if (!isLocked) onLessonSelect(lesson);
              }}
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4" />
                  Locked
                </>
              ) : lesson.completed ? (
                <>
                  <Play className="w-4 h-4" />
                  Review Lesson
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Lesson
                </>
              )}
            </Button>
          </Card>
        );
      })}
    </div>
  );
};

export default LessonCarousel;