import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search, Clock, Users, Star, Play, Check } from "lucide-react";
import { getFilteredTests } from "@/api/testApi";
import ToeicOnline_RightSidebar from "./TestOnline_RightSidebar";

const TestOnline = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("tat-ca");
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const navigate = useNavigate();

  // ✅ Lấy user từ Redux
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);
  const accessToken = useSelector((state) => state?.auth?.login?.accessToken);

  // ✅ Check authentication
  const isAuthenticated = !!(currentUser || accessToken);

  // Debug
  useEffect(() => {
    console.log("TestOnline - Current user:", currentUser);
    console.log("TestOnline - Access token exists:", !!accessToken);
    console.log("TestOnline - Is authenticated:", isAuthenticated);
  }, [currentUser, accessToken, isAuthenticated]);

  // Categories theo yêu cầu TOEIC
  const categories = [
    { id: "tat-ca", name: "Tất cả" },
    { id: "ETS", name: "ETS" },
    { id: "New Economy", name: "New Economy" },
    { id: "Y1", name: "Y1" },
    { id: "Y2", name: "Y2" },
    { id: "Y3", name: "Y3" },
  ];

  // Fetch tests with filters
  const fetchTests = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("User not authenticated, skipping fetch");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const filters = {
        category: selectedCategory,
        year: selectedYear,
        search: searchTerm,
      };

      const response = await getFilteredTests(filters);

      if (response && response.result) {
        setExams(response.result);

        // Set available filters if provided
        if (response.filters) {
          setAvailableYears(response.filters.availableYears || []);
        }
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      setError("Không thể tải danh sách đề thi. Vui lòng thử lại sau.");
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedYear, searchTerm, isAuthenticated]);

  // Fetch data when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTests();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchTests]);

  const handleStartExam = (examId) => {
    navigate(`/toeic-home/test-online/${examId}`);
  };

  // ✅ Not authenticated screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để truy cập thư viện đề thi và theo dõi tiến độ
            học tập của bạn.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Đến trang đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đề thi...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content with padding on sides */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Header */}
            <div className="bg-white shadow-sm rounded-lg mb-6">
              <div className="px-6 py-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  Thư viện đề thi
                </h1>
                <p className="mt-2 text-gray-600">
                  Chọn đề thi phù hợp và bắt đầu luyện tập
                </p>
                {currentUser && (
                  <p className="text-sm text-gray-500 mt-2">
                    Đang đăng nhập:{" "}
                    <span className="font-semibold text-gray-700">
                      {currentUser.email ||
                        currentUser.username ||
                        currentUser.name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Years Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedYear("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedYear === ""
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Tất cả năm
                </button>
                {availableYears.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year.toString())}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedYear === year.toString()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="flex gap-3 max-w-4xl">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Nhập từ khóa bạn muốn tìm kiếm: tên sách, dạng câu hỏi ..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button className="py-3 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                    Tất cả
                  </button>
                  <button className="py-3 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                    Đề rút gọn
                  </button>
                </nav>
              </div>
            </div>

            {/* Exam Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {exams.map((exam) => (
                <div
                  key={exam.testId || exam.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4 w-full"
                >
                  {/* Category badge */}
                  <div className="flex items-center mb-3">
                    <Check className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600 text-sm font-medium">
                      {exam.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    {exam.name}
                  </h3>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {exam.duration} phút
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {exam.completedCount}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">
                    {exam.totalQuestions} câu hỏi | {exam.year}
                  </div>

                  {/* Hashtag */}
                  <div className="text-xs text-blue-600 mb-2">
                    #{exam.category.toUpperCase()} - {exam.year}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-600 mb-4">
                    {exam.description}
                  </p>

                  {/* Start Button */}
                  <button
                    onClick={() => handleStartExam(exam.testId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Bắt đầu làm bài
                  </button>
                </div>
              ))}
            </div>

            {/* No Results */}
            {exams.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy đề thi
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi từ khóa tìm kiếm của bạn
                </p>
              </div>
            )}
          </div>

          {/* ToeicOnline_RightSidebar */}
          <ToeicOnline_RightSidebar
            currentUser={currentUser}
            targetScore={750}
            examDate={"20-11-2025"}
            daysUntilExam={60}
            avatarColor={"#000000"}
          />
        </div>
      </div>
    </div>
  );
};

export default TestOnline;
