import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "react-hot-toast"; // hoặc notification library bạn đang dùng
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axiosInstance";

const VocabTranslator = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [saving, setSaving] = useState(false); // ⭐ State mới cho nút lưu
  const accessTokenFromStore = useSelector(
    (state) => state?.auth?.login?.accessToken
  );

  // Lấy tất cả API keys từ env
  const API_KEYS = [
    import.meta.env.VITE_GEMINI_API_KEY_1,
    import.meta.env.VITE_GEMINI_API_KEY_2,
    import.meta.env.VITE_GEMINI_API_KEY_3,
    import.meta.env.VITE_GEMINI_API_KEY_4,
    import.meta.env.VITE_GEMINI_API_KEY_5,
  ].filter(Boolean); // Lọc bỏ key undefined/null

  // Hàm lấy API key hiện tại và rotate sang key tiếp theo
  const getNextApiKey = () => {
    const key = API_KEYS[currentKeyIndex];
    setCurrentKeyIndex((prev) => (prev + 1) % API_KEYS.length);
    return key;
  };

  // Nhận diện lỗi giới hạn tốc độ (429) từ nhiều dạng lỗi khác nhau của SDK/fetch
  const isRateLimitError = (err) => {
    try {
      if (!err) return false;
      if (err.status === 429 || err?.response?.status === 429) return true;
      const text = typeof err === "string" ? err : JSON.stringify(err);
      return /429|resource exhausted/i.test(text);
    } catch {
      return false;
    }
  };

  // Hàm delay để retry
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const translate = async (retry = 0) => {
    if (!text.trim()) {
      setError("Vui lòng nhập từ cần dịch");
      return;
    }

    // Kiểm tra có API key không
    if (API_KEYS.length === 0) {
      setError("❌ Không tìm thấy API key. Vui lòng cấu hình trong .env");
      return;
    }

    setLoading(true);
    setError("");
    setTranslation("");

    try {
      // Lấy API key tiếp theo trong vòng rotation
      const apiKey = getNextApiKey();
      const genAI = new GoogleGenerativeAI(apiKey);

      // Dùng model ổn định thay vì experimental để tránh lỗi quota/permission
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Translate the following English word or phrase to Vietnamese, and return ONLY the translated word or phrase. Do not include any explanations, definitions, or extra text. The phrase to translate is: "${text}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translated = response.text().trim();

      setTranslation(translated);
    } catch (err) {
      console.error("Gemini API Error:", err);

      // Xử lý lỗi 429 với retry (tự động đổi sang key khác)
      if (isRateLimitError(err)) {
        if (retry < API_KEYS.length - 1) {
          setError(
            `⏳ API key bị giới hạn. Đang thử key khác... (${retry + 1}/${
              API_KEYS.length
            })`
          );
          await delay(1000); // Chờ 1 giây trước khi thử key khác
          return translate(retry + 1); // Retry với key tiếp theo
        }
        setError(
          `⏳ Tất cả ${API_KEYS.length} API keys đều bị giới hạn. Vui lòng thử lại sau vài phút.`
        );
        return;
      }

      // Một số lỗi phổ biến khác
      const errText =
        err?.message ||
        err?.error?.message ||
        err?.response?.statusText ||
        "Lỗi không xác định";

      if (/api key/i.test(errText)) {
        setError("🔑 API key không hợp lệ hoặc chưa được cấp quyền.");
      } else if (/permission|forbidden|403/i.test(errText)) {
        setError(
          "⛔ API chưa được bật hoặc key không có quyền với model này. Kiểm tra Google Cloud."
        );
      } else if (/not found|404|model/i.test(errText)) {
        setError(
          "❌ Model không khả dụng. Vui lòng dùng 'gemini-1.5-flash' hoặc kiểm tra tên model."
        );
      } else if (/fetch|network|cors/i.test(errText)) {
        setError(
          "🌐 Lỗi mạng/CORS. Hãy thử lại, kiểm tra kết nối hoặc cấu hình CORS."
        );
      } else {
        setError("❌ Lỗi: " + errText);
      }
    } finally {
      setLoading(false);
    }
  };

  // ⭐ HÀM MỚI: Lưu từ vựng vào database
  const saveToMyVocabulary = async () => {
    if (!text.trim() || !translation.trim()) {
      toast.error("Vui lòng dịch từ trước khi lưu");
      return;
    }
    if (!accessTokenFromStore) {
      toast.error("Vui lòng đăng nhập để lưu từ vựng");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        word: text.trim(),
        explanation: translation.trim(),
        sourceLanguage: "en",
      };

      const res = await axiosInstance.post(`/lessons/my-vocabulary`, payload);
      const respData = res?.data ? res.data : res;

      if (respData && (respData.success || respData.isNew !== undefined)) {
        toast.success(
          respData.data?.isNew || respData.isNew
            ? "✅ Đã lưu từ vựng mới!"
            : "✅ Đã cập nhật từ vựng!"
        );
      } else {
        toast.success("✅ Đã lưu từ vựng!");
      }
    } catch (err) {
      console.error("Error saving vocabulary:", err);
      const msg =
        err?.message ||
        (err?.data && err.data.message) ||
        "Không thể lưu từ vựng";
      toast.error("❌ Lỗi khi lưu từ vựng: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setText("");
    setTranslation("");
    setError("");
  };

  return (
    <>
      {/* Nút floating ở góc dưới bên trái */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50 group"
          title="Dịch từ vựng"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
          <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Dịch từ vựng
          </span>
        </button>
      )}

      {/* Popup window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
              Dịch từ vựng
            </h3>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhập từ tiếng Anh:
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ví dụ: Hello"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === "Enter" && translate()}
              />
            </div>

            <button
              onClick={translate}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang dịch...
                </span>
              ) : (
                "Dịch"
              )}
            </button>

            {/* Hiển thị số API keys đang dùng */}
            {API_KEYS.length > 1 && (
              <div className="text-xs text-gray-500 text-center">
                🔑 Bấm dịch để xem bản dịch
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {translation && (
              <div className="space-y-2">
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Bản dịch:</p>
                  <p className="text-base font-semibold text-green-900">
                    {translation}
                  </p>
                </div>

                {/* ⭐ NÚT MỚI: Lưu vào từ vựng của tôi */}
                <button
                  onClick={saveToMyVocabulary}
                  disabled={saving}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Lưu vào từ vựng của tôi
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Powered by DTT Toeic
            </p>
          </div>
        </div>
      )}

      {/* Styles cho animation */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default VocabTranslator;
