import React, { useState, useEffect } from "react";
import {
  Newspaper,
  TrendingUp,
  Briefcase,
  Sparkles,
  Heart,
  Atom,
  Trophy,
  Laptop,
  Search,
  ChevronRight,
  Clock,
  Loader2,
  X,
  Languages,
} from "lucide-react";

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/news`;
const EXTRACT_API_URL = `${import.meta.env.VITE_BACKEND_URL}/extract`;

// Groq API configuration
const GROQ_CONFIG = {
  apiKey: import.meta.env.VITE_GROQ_KEY,
  url: import.meta.env.VITE_GROQ_URL,
  model: "llama-3.3-70b-versatile",
};

const categories = [
  { id: "general", name: "Tổng hợp", icon: Newspaper, color: "bg-blue-500" },
  {
    id: "business",
    name: "Kinh doanh",
    icon: Briefcase,
    color: "bg-green-500",
  },
  { id: "technology", name: "Công nghệ", icon: Laptop, color: "bg-purple-500" },
  {
    id: "entertainment",
    name: "Giải trí",
    icon: Sparkles,
    color: "bg-pink-500",
  },
  { id: "health", name: "Sức khỏe", icon: Heart, color: "bg-red-500" },
  { id: "science", name: "Khoa học", icon: Atom, color: "bg-indigo-500" },
  { id: "sports", name: "Thể thao", icon: Trophy, color: "bg-orange-500" },
];

export default function NewsPortal() {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredArticles, setFeaturedArticles] = useState([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [extractedArticle, setExtractedArticle] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Translation state
  const [translatedContent, setTranslatedContent] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState("");

  useEffect(() => {
    fetchFeaturedNews();
  }, []);

  useEffect(() => {
    if (selectedCategory) fetchNewsByCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isModalOpen]);

  const fetchFeaturedNews = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/top-headlines?country=us&pageSize=3`
      );
      const json = await res.json();
      setFeaturedArticles(json.data?.articles || []);
    } catch (err) {
      console.error("Lỗi load tin nổi bật:", err);
    }
  };

  const fetchNewsByCategory = async (category) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/top-headlines?country=us&category=${category}&pageSize=20`
      );
      const json = await res.json();
      setArticles(json.data?.articles || []);
    } catch (err) {
      console.error("Lỗi load tin theo danh mục:", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/everything?q=${encodeURIComponent(
          searchQuery
        )}&pageSize=20`
      );
      const json = await res.json();
      setArticles(json.data?.articles || []);
      setSelectedCategory("");
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };

  const openArticle = async (e, url) => {
    e.preventDefault();
    e.stopPropagation();

    setIsModalOpen(true);
    setIsExtracting(true);
    setExtractedArticle(null);
    setTranslatedContent("");
    setTranslationError("");

    try {
      const response = await fetch(
        `${EXTRACT_API_URL}?url=${encodeURIComponent(url)}`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setExtractedArticle(result.data);
    } catch (err) {
      console.error("Extract thất bại:", err);
      setExtractedArticle({
        error:
          "Không thể tải nội dung bài báo. Có thể trang bị chặn hoặc lỗi mạng.",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation();
    setIsModalOpen(false);
    setExtractedArticle(null);
    setTranslatedContent("");
    setTranslationError("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHrs < 1) return "Vừa xong";
    if (diffHrs < 24) return `${diffHrs} giờ trước`;
    if (diffHrs < 48) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const translateArticle = async () => {
    if (!extractedArticle?.content) {
      setTranslationError("Không có nội dung để dịch");
      return;
    }

    setIsTranslating(true);
    setTranslationError("");
    setTranslatedContent("");

    try {
      // Chia nhỏ nội dung
      const content = extractedArticle.content;
      const maxChunkSize = 6000;
      const chunks = [];

      for (let i = 0; i < content.length; i += maxChunkSize) {
        chunks.push(content.substring(i, i + maxChunkSize));
      }

      let fullTranslation = "";

      for (let i = 0; i < chunks.length; i++) {
        try {
          const response = await fetch(GROQ_CONFIG.url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GROQ_CONFIG.apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: GROQ_CONFIG.model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a professional news translator. Translate English articles to Vietnamese accurately, maintaining the original tone and structure. Return ONLY the Vietnamese translation without any explanations.",
                },
                {
                  role: "user",
                  content: `Translate this English article section to Vietnamese:\n\n${chunks[i]}`,
                },
              ],
              temperature: 0.3,
              max_tokens: 4000,
            }),
          });

          if (response.status === 429) {
            throw new Error("RATE_LIMITED");
          }

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.error?.message || `HTTP ${response.status}`
            );
          }

          const data = await response.json();

          if (data.choices && data.choices[0]?.message?.content) {
            const translated = data.choices[0].message.content.trim();
            fullTranslation += translated + "\n\n";
            setTranslatedContent(fullTranslation);
          } else {
            throw new Error("Không nhận được bản dịch từ API");
          }

          // Delay giữa các chunks
          if (i < chunks.length - 1) {
            await delay(1000);
          }
        } catch (err) {
          console.error(`Lỗi dịch chunk ${i + 1}:`, err);
          throw err;
        }
      }
    } catch (err) {
      console.error("Translation error:", err);
      const errMsg = err?.message || "Lỗi không xác định";

      if (errMsg === "RATE_LIMITED") {
        setTranslationError(
          "⏳ API Groq đang bị giới hạn tốc độ. Vui lòng thử lại sau 1-2 phút."
        );
      } else if (/network|fetch|failed to fetch/i.test(errMsg)) {
        setTranslationError(
          "🌐 Lỗi kết nối. Vui lòng kiểm tra internet và thử lại."
        );
      } else if (/unauthorized|401|invalid.*key/i.test(errMsg)) {
        setTranslationError(
          "🔑 API key không hợp lệ. Vui lòng kiểm tra cấu hình GROQ_KEY."
        );
      } else {
        setTranslationError("❌ Lỗi dịch: " + errMsg);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <header className="bg-white shadow-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    NewsHub
                  </h1>
                  <p className="text-sm text-gray-500">
                    Đọc báo không rời trang • Dịch nhanh • Highlight • Lưu bài
                  </p>
                </div>
              </div>

              <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm tin tức..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none transition"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </form>
            </div>

            <nav className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                      selectedCategory === cat.id
                        ? `${cat.color} text-white shadow-lg scale-105`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{cat.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {featuredArticles.length > 0 && selectedCategory === "general" && (
            <section className="mb-12">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-gray-800">
                  Tin nổi bật
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArticles.map((article, i) => (
                  <div
                    key={i}
                    onClick={(e) => openArticle(e, article.url)}
                    className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  >
                    <div className="aspect-[16/10] relative">
                      <img
                        src={article.urlToImage || "/placeholder.jpg"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(article.publishedAt)}
                          </span>
                          <span>{article.source.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name
                : "Kết quả tìm kiếm"}
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="aspect-video bg-gray-300" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-gray-300 rounded" />
                      <div className="h-4 bg-gray-300 rounded w-11/12" />
                      <div className="h-4 bg-gray-300 rounded w-8/12" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <Newspaper className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Không tìm thấy bài viết nào
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article, i) => (
                  <div
                    key={i}
                    onClick={(e) => openArticle(e, article.url)}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={article.urlToImage || "/placeholder.jpg"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.description || "Nhấn để đọc chi tiết"}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(article.publishedAt)}
                        </span>
                        <span className="text-blue-600 font-medium flex items-center gap-1">
                          Đọc ngay
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* MODAL ĐỌC BÀI BÁO */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={closeModal}
          />

          <div
            className="fixed top-0 right-0 h-full w-full md:w-3/5 lg:w-1/2 bg-white z-50 shadow-2xl flex flex-col transform transition-all duration-300 ease-out"
            style={{ maxWidth: "800px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b z-10 p-6 flex items-center justify-between shadow-sm">
              <h1 className="text-xl font-bold pr-10 line-clamp-2 flex-1">
                {extractedArticle?.title || "Đang tải..."}
              </h1>

              <div className="flex items-center gap-2 mr-4 flex-shrink-0">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Giảm cỡ chữ"
                >
                  <span className="text-lg font-bold">A-</span>
                </button>
                <span className="text-sm text-gray-500 min-w-[3rem] text-center">
                  {fontSize}px
                </span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Tăng cỡ chữ"
                >
                  <span className="text-xl font-bold">A+</span>
                </button>
              </div>

              <button
                onClick={closeModal}
                className="p-3 hover:bg-gray-100 rounded-full transition flex-shrink-0"
                title="Đóng (ESC)"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Nội dung */}
            <div className="overflow-y-auto p-8 flex-1 bg-gray-50">
              {isExtracting ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-600">Đang tải nội dung bài báo...</p>
                </div>
              ) : extractedArticle?.error ? (
                <div className="text-center py-20 text-red-600 text-lg">
                  {extractedArticle.error}
                </div>
              ) : extractedArticle ? (
                <>
                  {/* Metadata bar */}
                  {extractedArticle.length && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-gray-700">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <strong>Thời gian đọc:</strong> ~
                            {Math.ceil(extractedArticle.length / 1000)} phút
                          </span>
                          <span className="flex items-center gap-2">
                            <Newspaper className="w-4 h-4" />
                            <strong>Độ dài:</strong>{" "}
                            {extractedArticle.length.toLocaleString()} ký tự
                          </span>
                        </div>

                        {/* Nút dịch bài */}
                        <button
                          onClick={translateArticle}
                          disabled={isTranslating || !extractedArticle?.content}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          {isTranslating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Đang dịch...
                            </>
                          ) : (
                            <>
                              <Languages className="w-4 h-4" />
                              Dịch bài (Groq AI)
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bài báo gốc */}
                  <article className="article-reader bg-white rounded-lg shadow-sm p-8 mb-6">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                      <span className="text-sm font-semibold text-gray-700 bg-blue-100 px-3 py-1 rounded-full">
                        📰 Bản gốc (English)
                      </span>
                    </div>
                    <style
                      dangerouslySetInnerHTML={{
                        __html: `
                        .article-reader {
                          font-family: 'Georgia', 'Times New Roman', serif;
                          line-height: 1.8;
                          color: #1a1a1a;
                        }
                        .article-reader p {
                          margin-bottom: 1.5rem;
                          font-size: ${fontSize}px;
                          color: #2d3748;
                        }
                        .article-reader h1 {
                          font-size: 2rem;
                          font-weight: 700;
                          margin-bottom: 1.5rem;
                          line-height: 1.3;
                          color: #1a202c;
                        }
                        .article-reader h2 {
                          font-size: 1.75rem;
                          font-weight: 700;
                          margin-top: 2.5rem;
                          margin-bottom: 1.25rem;
                          color: #2d3748;
                          border-left: 4px solid #3b82f6;
                          padding-left: 1rem;
                        }
                        .article-reader h3 {
                          font-size: 1.5rem;
                          font-weight: 600;
                          margin-top: 2rem;
                          margin-bottom: 1rem;
                          color: #374151;
                        }
                        .article-reader a {
                          color: #2563eb;
                          text-decoration: none;
                          border-bottom: 1px solid #93c5fd;
                          transition: all 0.2s;
                        }
                        .article-reader a:hover {
                          color: #1d4ed8;
                          border-bottom-color: #2563eb;
                          background-color: #eff6ff;
                        }
                        .article-reader strong, .article-reader b {
                          font-weight: 600;
                          color: #1a202c;
                        }
                        .article-reader blockquote {
                          border-left: 4px solid #e5e7eb;
                          padding-left: 1.5rem;
                          margin: 2rem 0;
                          font-style: italic;
                          color: #4b5563;
                          background-color: #f9fafb;
                          padding: 1.5rem;
                          border-radius: 0.5rem;
                        }
                        .article-reader img {
                          max-width: 100%;
                          height: auto;
                          border-radius: 0.5rem;
                          margin: 2rem 0;
                          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                        }
                      `,
                      }}
                    />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: extractedArticle.html,
                      }}
                    />
                  </article>

                  {/* Phần dịch */}
                  {(translatedContent || isTranslating || translationError) && (
                    <article className="article-reader bg-white rounded-lg shadow-sm p-8">
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                        <span className="text-sm font-semibold text-white bg-purple-600 px-3 py-1 rounded-full">
                          🇻🇳 Bản dịch (Tiếng Việt) - Powered by Groq
                        </span>
                      </div>

                      {isTranslating && !translatedContent && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
                          <p className="text-gray-600">
                            Đang dịch bài báo bằng AI...
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Sử dụng Llama 3.3 70B (Groq)
                          </p>
                        </div>
                      )}

                      {translationError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                          {translationError}
                        </div>
                      )}

                      {translatedContent && (
                        <div
                          className="prose prose-lg max-w-none"
                          style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: "1.8",
                          }}
                        >
                          {translatedContent.split("\n").map(
                            (paragraph, idx) =>
                              paragraph.trim() && (
                                <p key={idx} className="mb-4 text-gray-700">
                                  {paragraph}
                                </p>
                              )
                          )}
                        </div>
                      )}
                    </article>
                  )}
                </>
              ) : null}
            </div>

            <div className="p-4 bg-gray-50 border-t text-center text-sm text-gray-500">
              Nội dung được trích xuất tự động – Dịch miễn phí bằng Groq AI
            </div>
          </div>
        </>
      )}
    </>
  );
}
