import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";

const VocabTranslator = () => {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Config chỉ cho Groq
  const GROQ_CONFIG = {
    name: "Groq",
    key: import.meta.env.VITE_GROQ_KEY,
    url: import.meta.env.VITE_GROQ_URL,
    model: "llama-3.3-70b-versatile",
  };

  // Hàm dịch chỉ dùng Groq
  const translate = async () => {
    if (!text.trim()) {
      setError("Vui lòng nhập từ cần dịch");
      return;
    }

    setLoading(true);
    setError("");
    setTranslation(null);

    try {
      const response = await fetch(GROQ_CONFIG.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_CONFIG.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_CONFIG.model,
          messages: [
            {
              role: "system",
              content: `You are a professional dictionary and translator. Translate the English word or phrase to Vietnamese.
Return ONLY a valid JSON object matching exactly this structure (no markdown, no extra text):
{
  "vietnamese": "Vietnamese translation",
  "partOfSpeech": "noun / verb / adjective / adverb / etc.",
  "englishDefinition": "English explanation of the meaning",
  "wordFamily": "Synonyms or related word forms (e.g., verb, adjective, noun)",
  "englishExample": "An example sentence in English using the word",
  "vietnameseExample": "The translation of the example sentence"
}`
            },
            {
              role: "user",
              content: `Translate this English word or phrase to Vietnamese: "${text.trim()}"`,
            },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        const rawContent = data.choices[0].message.content.trim();
        const cleanJson = rawContent.replace(/^```[\w]*\n?/g, "").replace(/```$/g, "").trim();
        try {
          const parsed = JSON.parse(cleanJson);
          setTranslation(parsed);
        } catch (e) {
          throw new Error("API trả về định dạng không hợp lệ");
        }
      } else {
        throw new Error("Không nhận được bản dịch từ API");
      }
    } catch (err) {
      console.error("Translation error:", err);
      const errMsg = err?.message || "Lỗi không xác định";
      if (/network|fetch|failed to fetch/i.test(errMsg)) {
        setError("🌐 Lỗi kết nối. Vui lòng kiểm tra internet.");
      } else if (/unauthorized|401|invalid.*key/i.test(errMsg)) {
        setError("🔑 API key không hợp lệ.");
      } else {
        setError("❌ Lỗi: " + errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Lưu từ vựng (giữ nguyên)
  const saveToMyVocabulary = async () => {
    if (!text.trim() || !translation || !translation.vietnamese) {
      toast.error("Vui lòng dịch từ trước khi lưu");
      return;
    }

    setSaving(true);
    try {
      let fullExplanation = translation.vietnamese;
      if (translation.partOfSpeech) fullExplanation = `(${translation.partOfSpeech}) ${fullExplanation}`;
      if (translation.englishDefinition) fullExplanation += `\n- Def: ${translation.englishDefinition}`;
      if (translation.wordFamily) fullExplanation += `\n- Family/Synonyms: ${translation.wordFamily}`;

      let exampleText = "";
      if (translation.englishExample) {
        exampleText = translation.englishExample;
        if (translation.vietnameseExample) exampleText += `\n(${translation.vietnameseExample})`;
      }

      const payload = {
        word: text.trim(),
        explanation: fullExplanation.trim(),
        contextExample: exampleText.trim(),
        sourceLanguage: "en",
      };

      const res = await axiosInstance.post(`/lessons/my-vocabulary`, payload);
      const respData = res?.data ? res.data : res;

      toast.success(
        respData.data?.isNew || respData.isNew
          ? "✅ Đã lưu từ vựng mới!"
          : "✅ Đã cập nhật từ vựng!"
      );
    } catch (err) {
      console.error("Error saving vocabulary:", err);
      const msg = err?.message || "Không thể lưu từ vựng";
      toast.error("❌ Lỗi khi lưu từ vựng: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setText("");
    setTranslation(null);
    setError("");
  };

  return (
    <>
      {/* Nút floating */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 group"
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
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Dịch từ vựng (AI miễn phí)
          </span>
        </button>
      )}

      {/* Popup */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
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
              className="text-white hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nhập từ tiếng Anh:
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ví dụ: Hello, beautiful, knowledge..."
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                onKeyPress={(e) => e.key === "Enter" && !loading && translate()}
              />
            </div>

            <button
              onClick={translate}
              disabled={loading || !text.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-md hover:shadow-lg"
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
                <span className="flex items-center justify-center gap-2">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Dịch
                </span>
              )}
            </button>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-sm flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {translation && typeof translation === 'object' && (
              <div className="space-y-2.5">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-green-200 pb-2 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-xs font-medium text-green-700">
                      Từ điển Groq AI:
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold text-green-900 capitalize">{text}</span>
                      {translation.partOfSpeech && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-200 text-green-800 uppercase tracking-wider">
                          {translation.partOfSpeech}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-semibold text-green-800 mb-1">
                      {translation.vietnamese}
                    </p>
                    {translation.englishDefinition && (
                      <p className="text-sm text-green-700 italic border-l-2 border-green-300 pl-2 my-2">
                        {translation.englishDefinition}
                      </p>
                    )}
                    {translation.wordFamily && (
                      <p className="text-sm text-green-800 mt-2 bg-green-100/50 p-2 rounded">
                        <span className="font-semibold text-green-900">Gia đình từ / Đồng nghĩa:</span> {translation.wordFamily}
                      </p>
                    )}
                  </div>

                  {(translation.englishExample || translation.vietnameseExample) && (
                    <div className="bg-white/60 p-3 rounded-lg text-sm border border-green-100">
                      <p className="text-gray-800 font-bold mb-1 text-xs uppercase tracking-wider">Ví dụ:</p>
                      {translation.englishExample && (
                        <p className="text-gray-800 mb-1">• {translation.englishExample}</p>
                      )}
                      {translation.vietnameseExample && (
                        <p className="text-gray-600 italic ml-2">{translation.vietnameseExample}</p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={saveToMyVocabulary}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
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
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
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
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
              <span className="font-medium">Powered by</span>
              <span className="font-semibold text-indigo-600">Groq AI</span>
            </p>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .overflow-y-auto::-webkit-scrollbar { width: 6px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #a0aec0; }
      `}</style>
    </>
  );
};

export default VocabTranslator;
