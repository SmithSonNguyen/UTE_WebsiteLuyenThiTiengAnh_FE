import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  CheckCircle,
  Clock,
  MessageSquare,
  ThumbsUp,
  Send,
  Menu,
  X,
  ChevronRight,
  Star,
  BookOpen,
  ArrowLeft,
  Lock,
} from "lucide-react";

const CourseLearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const accessTokenFromStore = useSelector(
    (state) => state?.auth?.login?.accessToken
  );

  useEffect(() => {
    if (!accessTokenFromStore) {
      setError("Vui lòng đăng nhập để xem khóa học");
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    if (courseId) {
      fetchCourseData();
      fetchComments();
    }
  }, [courseId, accessTokenFromStore]);

  const fetchCourseData = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/courses/enrolled/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${accessTokenFromStore}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Xử lý các trường hợp lỗi khác nhau
      if (response.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      if (response.status === 403) {
        setError(
          "Bạn chưa mua khóa học này. Vui lòng mua khóa học để tiếp tục."
        );
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      if (response.status === 404) {
        setError("Không tìm thấy khóa học.");
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Không thể tải khóa học");
      }

      const data = await response.json();

      // Kiểm tra data có hợp lệ không
      if (!data || !data.videoLessons) {
        setError("Dữ liệu khóa học không hợp lệ.");
        setAccessDenied(true);
        setLoading(false);
        return;
      }

      setCourse(data);

      if (data.videoLessons && data.videoLessons.length > 0) {
        setCurrentVideo(data.videoLessons[0]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching course:", error);
      setError(error.message || "Có lỗi xảy ra khi tải khóa học");
      setAccessDenied(true);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    const mockComments = [
      {
        id: 1,
        userId: "1",
        userName: "Nguyễn Văn A",
        avatar:
          "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=4F46E5&color=fff",
        content: "Bài giảng rất hay và dễ hiểu. Cảm ơn thầy!",
        timestamp: "2 giờ trước",
        likes: 15,
        replies: [
          {
            id: 11,
            userId: "2",
            userName: "Giảng viên",
            avatar:
              "https://ui-avatars.com/api/?name=Teacher&background=10B981&color=fff",
            content: "Cảm ơn bạn đã theo dõi. Chúc bạn học tốt!",
            timestamp: "1 giờ trước",
            likes: 3,
          },
        ],
      },
      {
        id: 2,
        userId: "3",
        userName: "Trần Thị B",
        avatar:
          "https://ui-avatars.com/api/?name=Tran+Thi+B&background=EF4444&color=fff",
        content:
          "Phần ngữ pháp ở phút thứ 15 em chưa hiểu lắm. Thầy có thể giải thích thêm được không ạ?",
        timestamp: "5 giờ trước",
        likes: 8,
        replies: [],
      },
    ];

    setComments(mockComments);
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setSidebarOpen(false);

    if (currentVideo && !completedVideos.includes(currentVideo.order)) {
      setCompletedVideos([...completedVideos, currentVideo.order]);
    }
  };

  const handleNextVideo = () => {
    if (!course || !currentVideo) return;

    const currentIndex = course.videoLessons.findIndex(
      (v) => v.order === currentVideo.order
    );

    if (currentIndex < course.videoLessons.length - 1) {
      handleVideoSelect(course.videoLessons[currentIndex + 1]);
    }
  };

  const handlePreviousVideo = () => {
    if (!course || !currentVideo) return;

    const currentIndex = course.videoLessons.findIndex(
      (v) => v.order === currentVideo.order
    );

    if (currentIndex > 0) {
      handleVideoSelect(course.videoLessons[currentIndex - 1]);
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      userId: "current-user",
      userName: "Bạn",
      avatar:
        "https://ui-avatars.com/api/?name=You&background=6366F1&color=fff",
      content: newComment,
      timestamp: "Vừa xong",
      likes: 0,
      replies: [],
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleReply = (commentId) => {
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      userId: "current-user",
      userName: "Bạn",
      avatar:
        "https://ui-avatars.com/api/?name=You&background=6366F1&color=fff",
      content: replyText,
      timestamp: "Vừa xong",
      likes: 0,
    };

    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, replies: [...(c.replies || []), reply] };
        }
        return c;
      })
    );

    setReplyText("");
    setReplyTo(null);
  };

  const calculateProgress = () => {
    if (!course || !course.videoLessons) return 0;
    return Math.round(
      (completedVideos.length / course.videoLessons.length) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  // Hiển thị lỗi khi không có quyền truy cập
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
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
                        className="h-full bg-indigo-500 transition-all duration-300"
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
        {/* Sidebar - Video List */}
        <div
          className={`
          fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-80 bg-gray-950 border-r border-gray-800 
          transform transition-transform duration-300 z-30 overflow-hidden flex flex-col
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
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

              return (
                <button
                  key={video.order}
                  onClick={() => handleVideoSelect(video)}
                  className={`
                    w-full p-4 border-b border-gray-800 hover:bg-gray-800 transition-colors text-left
                    ${
                      isActive ? "bg-gray-800 border-l-4 border-indigo-500" : ""
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-sm
                      ${
                        isCompleted
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-800 text-gray-400"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Play className="w-4 h-4" fill="currentColor" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium line-clamp-2 ${
                          isActive ? "text-white" : "text-gray-300"
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

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto p-4 lg:p-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
              <iframe
                src={getYouTubeEmbedUrl(currentVideo?.url)}
                title={currentVideo?.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
              />
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button
                onClick={handlePreviousVideo}
                disabled={currentVideo?.order === 1}
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
                disabled={currentVideo?.order === course.videoLessons?.length}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-800/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Bài tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-gray-950 rounded-lg shadow-xl">
              <div className="border-b border-gray-800">
                <div className="flex gap-1 p-1">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeTab === "overview"
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    Tổng quan
                  </button>
                  <button
                    onClick={() => setActiveTab("qa")}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === "qa"
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Q&A ({comments.length})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">
                        Về khóa học này
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {course.targetScoreRange && (
                      <div className="bg-gray-800/50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-white mb-2">
                          Mục tiêu điểm số
                        </h4>
                        <p className="text-gray-300">
                          {course.targetScoreRange.min} -{" "}
                          {course.targetScoreRange.max} điểm
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "qa" && (
                  <div className="space-y-6">
                    {/* Post Comment */}
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Đặt câu hỏi hoặc chia sẻ suy nghĩ của bạn..."
                        className="w-full bg-gray-900 text-white rounded-lg p-3 min-h-24 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          onClick={handlePostComment}
                          disabled={!newComment.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>Đăng</span>
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-800/30 rounded-lg p-4"
                        >
                          <div className="flex gap-3">
                            <img
                              src={comment.avatar}
                              alt={comment.userName}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-white">
                                  {comment.userName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {comment.timestamp}
                                </span>
                              </div>

                              <p className="text-gray-300 mb-3">
                                {comment.content}
                              </p>

                              <div className="flex items-center gap-4">
                                <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{comment.likes}</span>
                                </button>

                                <button
                                  onClick={() => setReplyTo(comment.id)}
                                  className="text-gray-400 hover:text-white transition-colors text-sm"
                                >
                                  Trả lời
                                </button>
                              </div>

                              {/* Reply Form */}
                              {replyTo === comment.id && (
                                <div className="mt-3 ml-4 space-y-2">
                                  <textarea
                                    value={replyText}
                                    onChange={(e) =>
                                      setReplyText(e.target.value)
                                    }
                                    placeholder="Viết câu trả lời..."
                                    className="w-full bg-gray-900 text-white rounded-lg p-3 min-h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setReplyTo(null)}
                                      className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                      Hủy
                                    </button>
                                    <button
                                      onClick={() => handleReply(comment.id)}
                                      disabled={!replyText.trim()}
                                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                      Trả lời
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Replies */}
                              {comment.replies &&
                                comment.replies.length > 0 && (
                                  <div className="mt-4 ml-4 space-y-3 border-l-2 border-gray-700 pl-4">
                                    {comment.replies.map((reply) => (
                                      <div
                                        key={reply.id}
                                        className="flex gap-3"
                                      >
                                        <img
                                          src={reply.avatar}
                                          alt={reply.userName}
                                          className="w-8 h-8 rounded-full flex-shrink-0"
                                        />

                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-white text-sm">
                                              {reply.userName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {reply.timestamp}
                                            </span>
                                          </div>

                                          <p className="text-gray-300 text-sm mb-2">
                                            {reply.content}
                                          </p>

                                          <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm">
                                            <ThumbsUp className="w-3 h-3" />
                                            <span>{reply.likes}</span>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
