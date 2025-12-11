import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Check,
  MonitorPlay,
  BookOpen,
  ChevronRightSquare,
  Menu,
} from "lucide-react";

// Component Video Player
const VideoPlayer = ({ videoUrl, title }) => {
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="space-y-4">
      <iframe
        src={getYouTubeEmbedUrl(videoUrl)}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] xl:h-[600px] 2xl:h-[700px] rounded-lg"
      />
    </div>
  );
};

// Component Lesson Item trong Sidebar
const LessonItem = ({ lesson, isActive, onSelect, isCompleted }) => {
  return (
    <li>
      <button
        onClick={() => onSelect(lesson)}
        className={`flex gap-2 hover:underline w-full text-left items-start ${
          isActive ? "font-semibold underline" : ""
        }`}
      >
        <MonitorPlay className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex gap-2 items-start flex-1">
          <span className="flex-1">{lesson.title}</span>
          <span className="text-gray-500">{lesson.duration || "(0:00)"}</span>
        </div>
        {isCompleted && (
          <Check
            className="ml-1 mt-[2px] w-4 h-4 flex-shrink-0 text-green-500"
            strokeWidth={2.5}
          />
        )}
      </button>
    </li>
  );
};

// Component Chapter Accordion
const ChapterAccordion = ({
  chapter,
  currentLesson,
  onLessonSelect,
  completedLessons,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasCurrentLesson = chapter.lessons.some(
    (l) => l.order === currentLesson?.order
  );

  useEffect(() => {
    if (hasCurrentLesson) {
      setIsOpen(true);
    }
  }, [hasCurrentLesson]);

  const allLessonsCompleted = chapter.lessons.every((l) =>
    completedLessons.includes(l.order)
  );

  return (
    <div className="border-b">
      <h3 className="flex">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-1 justify-between py-4 text-sm font-medium transition-all hover:underline text-left items-start"
        >
          <div className="flex">
            <div className="flex items-start gap-2">
              <span>{chapter.title}</span>
              <span className="text-gray-500">
                ({chapter.duration || "0:00"})
              </span>
            </div>
            {allLessonsCompleted && (
              <Check
                className="ml-1 mt-[2px] flex-shrink-0 w-4 h-4 text-green-500"
                strokeWidth={2.5}
              />
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      {isOpen && (
        <div className="pb-4 pt-0">
          <ul className="space-y-4">
            {chapter.lessons.map((lesson) => (
              <LessonItem
                key={lesson.order}
                lesson={lesson}
                isActive={currentLesson?.order === lesson.order}
                onSelect={onLessonSelect}
                isCompleted={completedLessons.includes(lesson.order)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Component chính - Trang Học
const FreeTrialVideoCourse = () => {
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      // Giả lập API call
      // const response = await fetch('/api/courses/:id');
      // const data = await response.json();

      // Dữ liệu mẫu theo schema TOEIC Beginner
      const mockData = {
        _id: "68eca309c199768eb93d5c9f",
        title: "TOEIC Beginner Essentials",
        description: "Khóa học cơ bản dành cho người mới bắt đầu",
        videoLessons: [
          {
            title: "TOEIC Beginner Essentials Day 1",
            url: "https://www.youtube.com/watch?v=ejwUQMuP394",
            order: 1,
          },
          {
            title: "TOEIC Beginner Essentials Day 2",
            url: "https://www.youtube.com/watch?v=0TCUcpLXqg8",
            order: 2,
          },
          {
            title: "TOEIC Beginner Essentials Day 3",
            url: "https://www.youtube.com/watch?v=njrI-66Tp1E",
            order: 3,
          },
          {
            title: "TOEIC Beginner Essentials Day 4",
            url: "https://www.youtube.com/watch?v=hDBFp0haNFc",
            order: 4,
          },
          {
            title: "TOEIC Beginner Essentials Day 5",
            url: "https://www.youtube.com/watch?v=TV_-9PIg39c",
            order: 5,
          },
        ],
        chapters: [
          {
            title: "Chương 1: Thông tin khóa học và hướng dẫn học",
            duration: "1:52:11",
            lessons: [
              {
                title: "TOEIC Beginner Essentials Day 1",
                url: "https://www.youtube.com/watch?v=ejwUQMuP394",
                order: 1,
                duration: "1:52:11",
              },
            ],
          },
          {
            title: "Chương 2: Bài học từ ngày 2-5",
            duration: "7:33:34",
            lessons: [
              {
                title: "TOEIC Beginner Essentials Day 2",
                url: "https://www.youtube.com/watch?v=0TCUcpLXqg8",
                order: 2,
                duration: "1:47:52",
              },
              {
                title: "TOEIC Beginner Essentials Day 3",
                url: "https://www.youtube.com/watch?v=njrI-66Tp1E",
                order: 3,
                duration: "1:51:16",
              },
              {
                title: "TOEIC Beginner Essentials Day 4",
                url: "https://www.youtube.com/watch?v=hDBFp0haNFc",
                order: 4,
                duration: "1:48:52",
              },
              {
                title: "TOEIC Beginner Essentials Day 5",
                url: "https://www.youtube.com/watch?v=TV_-9PIg39c",
                order: 5,
                duration: "2:05:34",
              },
            ],
          },
        ],
      };

      setTimeout(() => {
        setCourse(mockData);
        setCurrentLesson(mockData.videoLessons[0]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching course:", error);
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);

    // Đánh dấu bài học trước đó là đã hoàn thành
    if (currentLesson && !completedLessons.includes(currentLesson.order)) {
      setCompletedLessons([...completedLessons, currentLesson.order]);
    }
  };

  const handleNextLesson = () => {
    if (!course || !currentLesson) return;

    const allLessons = course.videoLessons;
    const currentIndex = allLessons.findIndex(
      (l) => l.order === currentLesson.order
    );

    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      handleLessonSelect(nextLesson);
    }
  };

  const calculateProgress = () => {
    if (!course) return 0;
    const total = course.videoLessons.length;
    const completed = completedLessons.length;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy khóa học</p>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto max-w-7xl py-10 px-4">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-semibold">{course.title}</h2>
              <div className="space-y-2 space-x-2 mt-4">
                <strong>Tiến độ:</strong>
                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">
                  {completedLessons.length}/{course.videoLessons.length} bài
                </div>
                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-blue-600 text-white shadow">
                  {progress}%
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="flex justify-end lg:hidden mt-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-white hover:bg-gray-50 h-10 px-4 py-2"
                  title="Mở menu bài học"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:grid lg:grid-cols-12 gap-6">
              {/* Video Section */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <VideoPlayer
                      videoUrl={currentLesson.url}
                      title={currentLesson.title}
                    />

                    <div className="flex gap-5 justify-between lg:justify-start">
                      <div className="lg:block hidden flex-grow">
                        <div className="space-y-2">
                          <h1 className="text-xl font-semibold">
                            {currentLesson.title}
                          </h1>
                          <p className="text-sm text-gray-600">
                            Bài {currentLesson.order} /{" "}
                            {course.videoLessons.length}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleNextLesson}
                        className="min-w-[120px] flex-shrink-0 inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 px-4 py-2"
                      >
                        Bài tiếp
                        <ChevronRightSquare className="w-5 h-5 ml-1" />
                      </button>
                    </div>

                    <div className="lg:hidden">
                      <div className="space-y-2">
                        <h1 className="text-xl font-semibold">
                          {currentLesson.title}
                        </h1>
                        <p className="text-sm text-gray-600">
                          Bài {currentLesson.order} /{" "}
                          {course.videoLessons.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white rounded-lg p-6 border shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">
                      Mô tả khóa học
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar - Desktop */}
              <div className="hidden lg:block lg:col-span-4 xl:col-span-3">
                <div className="sticky top-4 max-h-[calc(100vh-120px)] overflow-auto border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="font-semibold mb-4">Nội dung khóa học</h3>
                  <div>
                    {course.chapters.map((chapter, index) => (
                      <ChapterAccordion
                        key={index}
                        chapter={chapter}
                        currentLesson={currentLesson}
                        onLessonSelect={handleLessonSelect}
                        completedLessons={completedLessons}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar - Mobile */}
              {sidebarOpen && (
                <div
                  className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div
                    className="bg-white h-full max-w-sm w-full ml-auto overflow-auto p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Nội dung khóa học</h3>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-gray-500"
                      >
                        ✕
                      </button>
                    </div>
                    <div>
                      {course.chapters.map((chapter, index) => (
                        <ChapterAccordion
                          key={index}
                          chapter={chapter}
                          currentLesson={currentLesson}
                          onLessonSelect={handleLessonSelect}
                          completedLessons={completedLessons}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialVideoCourse;
