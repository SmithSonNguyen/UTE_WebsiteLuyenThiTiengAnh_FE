import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Play, Lock } from "lucide-react";

const LessonCarousel = ({ lessons, currentLessonId, onLessonSelect }) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
        <p className="text-gray-600">
          Choose a lesson to continue your vocabulary practice
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {lessons.map((lesson, index) => {
          const isActive = currentLessonId === lesson.id;
          const isLocked = index > 0 && lessons[index - 1].progress < 80;

          return (
            <Card
              key={lesson.id}
              className={`
                min-w-[280px] p-6 cursor-pointer border-2 transition-all hover:shadow-lg
                ${
                  isActive
                    ? "border-blue-500 bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                    : ""
                }
                ${
                  isLocked
                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    : "border-gray-200 hover:border-blue-300"
                }
              `}
              onClick={() => !isLocked && onLessonSelect(lesson)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={isActive ? "secondary" : "outline"}>
                      Lesson {lesson.id}
                    </Badge>
                    {lesson.completed && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <h3
                    className={`font-semibold text-lg mb-2 ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {lesson.title}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      isActive ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    {lesson.words.length} words
                  </p>
                </div>

                {!isLocked && (
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className="ml-2"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span
                    className={isActive ? "text-white/80" : "text-gray-600"}
                  >
                    Progress: {lesson.progress}%
                  </span>
                </div>
                <Progress value={lesson.progress} className="h-2" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LessonCarousel;
