import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FileText,
  Upload,
  Search,
  Save,
  Image as ImageIcon,
  Loader2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

const TestManagement = () => {
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  // --- States ---
  const [selectedFiles, setSelectedFiles] = useState([]); // [{file, previewUrl, status: 'pending'|'scanning'|'done'|'error'}]
  const [scanProgress, setScanProgress] = useState({ current: 0, total: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null); // {sections: [...]}
  const [testTitle, setTestTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Groq Vision Config - llama-4-scout hỗ trợ Vision
  const GROQ_CONFIG = {
    key: import.meta.env.VITE_GROQ_KEY,
    url: import.meta.env.VITE_GROQ_URL,
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
  };

  // --- Helpers ---
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const scanSingleImage = async (file) => {
    const base64Image = await fileToBase64(file);
    const mimeType = file.type || "image/jpeg";

    const prompt = `Hãy trích xuất toàn bộ câu hỏi TOEIC từ ảnh này và trả về ĐÚNG định dạng JSON sau:
{
  "sections": [
    {
      "part": <số part 1-7>,
      "paragraph": "<đoạn văn/hướng dẫn nếu có, để trống nếu không>",
      "questions": [
        {
          "number": <số thứ tự câu>,
          "questionText": "<nội dung câu hỏi>",
          "options": ["<phương án A>", "<phương án B>", "<phương án C>", "<phương án D>"],
          "answer": "<A hoặc B hoặc C hoặc D, để trống nếu không rõ>"
        }
      ]
    }
  ]
}
Chỉ trả về JSON thuần túy, không thêm markdown hay giải thích.`;

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
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64Image}` },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Lỗi HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content;
    if (!rawText) throw new Error("Không nhận được dữ liệu từ AI");

    const cleanText = rawText
      .replace(/^```[\w]*\n?/g, "")
      .replace(/```$/g, "")
      .trim();
    return JSON.parse(cleanText);
  };

  // --- Handlers ---
  const handleFilesChange = (e) => {
    const newFiles = Array.from(e.target.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (newFiles.length === 0) {
      toast.error("Vui lòng chọn file ảnh (JPG, PNG...)");
      return;
    }
    const fileItems = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
      error: null,
    }));
    setSelectedFiles((prev) => [...prev, ...fileItems]);
    // Reset kết quả cũ nếu thêm ảnh mới
    setScannedData(null);
    e.target.value = ""; // allow re-selecting same files
  };

  const handleRemoveFile = (idx) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[idx].previewUrl);
      updated.splice(idx, 1);
      return updated;
    });
    setScannedData(null);
  };

  const scanAllImages = async () => {
    if (selectedFiles.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một ảnh");
      return;
    }

    setIsScanning(true);
    setScanProgress({ current: 0, total: selectedFiles.length });

    const allSections = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      // Cập nhật trạng thái từng ảnh
      setSelectedFiles((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "scanning" } : item,
        ),
      );
      setScanProgress({ current: i + 1, total: selectedFiles.length });

      try {
        const result = await scanSingleImage(selectedFiles[i].file);
        allSections.push(...(result.sections || []));

        setSelectedFiles((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "done" } : item,
          ),
        );
      } catch (err) {
        console.error(`Lỗi quét ảnh ${i + 1}:`, err);
        setSelectedFiles((prev) =>
          prev.map((item, idx) =>
            idx === i ? { ...item, status: "error", error: err.message } : item,
          ),
        );
        toast.error(`Ảnh ${i + 1}: ${err.message}`);
      }
    }

    if (allSections.length > 0) {
      // Merge và sắp xếp theo part
      allSections.sort((a, b) => (a.part || 0) - (b.part || 0));
      setScannedData({ sections: allSections });
      toast.success(
        `✅ Hoàn tất! Đã quét ${selectedFiles.length} ảnh, tìm thấy ${allSections.length} phần thi.`,
      );
    } else {
      toast.error("Không trích xuất được câu hỏi nào từ các ảnh đã chọn.");
    }

    setIsScanning(false);
  };

  const handleUpdateQuestion = (sectionIdx, qIdx, field, value) => {
    setScannedData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev)); // deep clone
      if (field === "options") {
        newData.sections[sectionIdx].questions[qIdx].options[value.idx] =
          value.text;
      } else {
        newData.sections[sectionIdx].questions[qIdx][field] = value;
      }
      return newData;
    });
  };

  const handleSaveTest = async () => {
    if (!testTitle.trim()) {
      toast.warn("Vui lòng nhập tên bài test");
      return;
    }
    if (!scannedData?.sections?.length) {
      toast.warn("Không có dữ liệu để lưu");
      return;
    }

    setIsSaving(true);
    try {
      await axiosInstance.post(
        "/admin/tests",
        { title: testTitle, sections: scannedData.sections },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      toast.success("✅ Lưu bài test thành công!");
      setScannedData(null);
      setSelectedFiles([]);
      setTestTitle("");
      setScanProgress({ current: 0, total: 0 });
    } catch (error) {
      console.error("Save Test Error:", error);
      toast.error("Lỗi khi lưu bài test: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Status icon helper ---
  const StatusIcon = ({ status }) => {
    if (status === "scanning")
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (status === "done")
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "error")
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <span className="w-4 h-4 rounded-full bg-gray-300 block" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="w-10 h-10 text-blue-600" />
          AI Test Management
        </h1>
        <p className="text-gray-500 mt-2">
          Tải nhiều ảnh đề thi TOEIC — AI sẽ đọc từng ảnh và ghép kết quả lại
          thành một bài test hoàn chỉnh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ========== LEFT: Upload & Image List ========== */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Tải ảnh đề thi ({selectedFiles.length} ảnh)
            </h2>

            {/* Drop zone */}
            <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-xl p-6 text-center transition-all">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                disabled={isScanning}
              />
              <label
                htmlFor="file-upload"
                className={`cursor-pointer block ${isScanning ? "cursor-not-allowed opacity-60" : ""}`}
              >
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-7 h-7 text-blue-500" />
                </div>
                <p className="text-gray-700 font-medium">
                  Nhấn để thêm ảnh (nhiều ảnh)
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  JPG, PNG — có thể chọn nhiều file cùng lúc
                </p>
              </label>
            </div>

            {/* Image thumbnails list */}
            {selectedFiles.length > 0 && (
              <div className="mt-5 space-y-3 max-h-[440px] overflow-y-auto pr-1">
                {selectedFiles.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      item.status === "scanning"
                        ? "border-blue-300 bg-blue-50"
                        : item.status === "done"
                          ? "border-green-200 bg-green-50/40"
                          : item.status === "error"
                            ? "border-red-200 bg-red-50/40"
                            : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <img
                      src={item.previewUrl}
                      alt={`ảnh ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        Ảnh {idx + 1}: {item.file.name}
                      </p>
                      {item.error && (
                        <p className="text-xs text-red-500 mt-0.5 truncate">
                          {item.error}
                        </p>
                      )}
                      {item.status === "scanning" && (
                        <p className="text-xs text-blue-500 mt-0.5">
                          Đang quét...
                        </p>
                      )}
                      {item.status === "done" && (
                        <p className="text-xs text-green-600 mt-0.5">
                          Quét thành công ✓
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon status={item.status} />
                      {!isScanning && (
                        <button
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {isScanning && scanProgress.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Đang quét ảnh...</span>
                  <span>
                    {scanProgress.current}/{scanProgress.total}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${(scanProgress.current / scanProgress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Scan button */}
            <button
              onClick={scanAllImages}
              disabled={selectedFiles.length === 0 || isScanning}
              className="w-full mt-5 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:scale-100 flex items-center justify-center gap-3"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang quét {scanProgress.current}/{scanProgress.total}...
                </>
              ) : (
                <>
                  <Eye className="w-6 h-6" />
                  Bắt đầu quét AI ({selectedFiles.length} ảnh)
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========== RIGHT: Results & Editing ========== */}
        <div className="lg:col-span-7">
          {scannedData ? (
            <div className="space-y-6">
              {/* Save bar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-6 z-10 backdrop-blur-md bg-white/90">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Tên bài thi
                    </label>
                    <input
                      type="text"
                      value={testTitle}
                      onChange={(e) => setTestTitle(e.target.value)}
                      placeholder="Ví dụ: TOEIC Practice Test 2024 - Vol 1"
                      className="w-full text-lg font-bold bg-transparent border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-1 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSaveTest}
                    disabled={isSaving}
                    className="py-3 px-8 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 hover:scale-105 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Lưu bài thi
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  {scannedData.sections.length} phần thi •{" "}
                  {scannedData.sections.reduce(
                    (acc, s) => acc + (s.questions?.length || 0),
                    0,
                  )}{" "}
                  câu hỏi tổng cộng
                </p>
              </div>

              {/* Sections */}
              {scannedData.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8"
                >
                  <div className="flex items-center gap-3 border-l-4 border-blue-500 pl-4 py-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      Part {section.part}
                    </h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold">
                      {section.questions?.length || 0} câu hỏi
                    </span>
                  </div>

                  {section.paragraph && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                        Đoạn văn / Hướng dẫn
                      </label>
                      <textarea
                        value={section.paragraph}
                        onChange={(e) => {
                          setScannedData((prev) => {
                            const newData = JSON.parse(JSON.stringify(prev));
                            newData.sections[sIdx].paragraph = e.target.value;
                            return newData;
                          });
                        }}
                        className="w-full bg-transparent border-none focus:ring-0 text-gray-700 leading-relaxed resize-none min-h-[80px]"
                      />
                    </div>
                  )}

                  <div className="space-y-10">
                    {section.questions?.map((q, qIdx) => (
                      <div key={qIdx} className="relative">
                        <div className="mb-4 flex items-center gap-4">
                          <span className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {q.number}
                          </span>
                          <input
                            type="text"
                            value={q.questionText}
                            onChange={(e) =>
                              handleUpdateQuestion(
                                sIdx,
                                qIdx,
                                "questionText",
                                e.target.value,
                              )
                            }
                            className="flex-1 text-base font-semibold text-gray-800 border border-transparent hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 rounded-lg py-1.5 px-2 transition-all outline-none"
                            placeholder="Nội dung câu hỏi..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-14">
                          {q.options?.map((option, oIdx) => (
                            <div
                              key={oIdx}
                              className={`flex items-center border rounded-xl overflow-hidden transition-all ${
                                q.answer === String.fromCharCode(65 + oIdx)
                                  ? "border-green-400 bg-green-50/50"
                                  : "border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <button
                                onClick={() =>
                                  handleUpdateQuestion(
                                    sIdx,
                                    qIdx,
                                    "answer",
                                    String.fromCharCode(65 + oIdx),
                                  )
                                }
                                title="Đánh dấu là đáp án đúng"
                                className={`w-10 h-full min-h-[44px] flex items-center justify-center font-bold border-r flex-shrink-0 transition-all ${
                                  q.answer === String.fromCharCode(65 + oIdx)
                                    ? "bg-green-500 text-white border-green-500"
                                    : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </button>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  handleUpdateQuestion(sIdx, qIdx, "options", {
                                    idx: oIdx,
                                    text: e.target.value,
                                  })
                                }
                                className="flex-1 py-2.5 px-3 outline-none bg-transparent text-gray-700"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có kết quả quét
              </h3>
              <p className="max-w-sm mx-auto">
                Thêm ảnh đề thi bên trái, sau đó nhấn{" "}
                <strong>"Bắt đầu quét AI"</strong> để xem kết quả tại đây.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestManagement;
