import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Save,
  ArrowLeft,
  Search,
  Music,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  BookOpen,
  Headphones,
  AlertTriangle,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

// ─── Constants ───────────────────────────────────────────────────────────────

const PART_INFO = {
  1: { label: "Part 1 – Photographs", type: "listening", desc: "6 câu, ảnh + MP3, questionText để trống" },
  2: { label: "Part 2 – Question-Response", type: "listening", desc: "25 câu, MP3, 3 options (A/B/C)" },
  3: { label: "Part 3 – Conversations", type: "listening", desc: "Nhóm 3 câu / đoạn hội thoại, MP3" },
  4: { label: "Part 4 – Talks", type: "listening", desc: "Nhóm 3 câu / bài nói, MP3" },
  5: { label: "Part 5 – Incomplete Sentences", type: "reading", desc: "1 câu / section, 4 options" },
  6: { label: "Part 6 – Text Completion", type: "reading", desc: "Nhóm 4 câu / đoạn văn, có paragraph" },
  7: { label: "Part 7 – Reading Comprehension", type: "reading", desc: "Nhóm câu / bài đọc, có paragraph" },
};

const LISTENING_PARTS = [1, 2, 3, 4];
const IMAGE_PARTS = [1, 6, 7]; // parts that might have imageUrl

const emptyQuestion = (number = 1, part = 5) => ({
  number,
  questionText: "",
  options: part === 2 ? ["A. ", "B. ", "C. "] : ["A. ", "B. ", "C. ", "D. "],
  answer: "A",
  explanation: "",
});

const emptySection = (part = 5) => ({
  part,
  mediaUrl: "",
  imageUrl: [],
  paragraph: "",
  explanation: "",
  questions: [emptyQuestion(1, part)],
});

const defaultTestMeta = () => ({
  title: "",
  description: "",
  difficulty: "intermediate",
  category: "Full Test",
  year: new Date().getFullYear(),
  duration: 120,
});

// ─── Sub-components ───────────────────────────────────────────────────────────

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

const DifficultyBadge = ({ value }) => {
  const map = { beginner: ["green", "Beginner"], intermediate: ["blue", "Intermediate"], advanced: ["red", "Advanced"] };
  const [color, label] = map[value] || ["gray", value];
  return <Badge color={color}>{label}</Badge>;
};

// ─── Section Builder Card ─────────────────────────────────────────────────────

const SectionCard = ({ section, sIdx, onUpdate, onDelete, onAddQuestion, onDeleteQuestion }) => {
  const [collapsed, setCollapsed] = useState(false);
  const part = section.part;
  const info = PART_INFO[part] || {};
  const isListening = LISTENING_PARTS.includes(part);
  const hasImage = IMAGE_PARTS.includes(part);

  const updateField = (field, value) => onUpdate(sIdx, field, value);
  const updateImageUrl = (idx, value) => {
    const arr = [...(section.imageUrl || [])];
    arr[idx] = value;
    updateField("imageUrl", arr);
  };
  const addImageUrl = () => updateField("imageUrl", [...(section.imageUrl || []), ""]);
  const removeImageUrl = (idx) => updateField("imageUrl", (section.imageUrl || []).filter((_, i) => i !== idx));

  const updateQuestion = (qIdx, field, value) => {
    const questions = section.questions.map((q, i) => (i === qIdx ? { ...q, [field]: value } : q));
    updateField("questions", questions);
  };
  const updateOption = (qIdx, oIdx, value) => {
    const questions = section.questions.map((q, i) => {
      if (i !== qIdx) return q;
      const opts = [...q.options];
      opts[oIdx] = value;
      return { ...q, options: opts };
    });
    updateField("questions", questions);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            P{part}
          </span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">{info.label}</p>
            <p className="text-xs text-gray-400">{info.desc}</p>
          </div>
          <Badge color={isListening ? "orange" : "purple"}>
            {isListening ? "Listening" : "Reading"}
          </Badge>
          <Badge color="gray">{section.questions.length} câu</Badge>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(sIdx)}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
            title="Xóa section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-5 space-y-5">
          {/* Media / Image / Paragraph fields */}
          <div className="grid grid-cols-1 gap-4">
            {isListening && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <Headphones className="w-3.5 h-3.5 text-orange-500" /> Link MP3 (mediaUrl)
                </label>
                <input
                  type="url"
                  value={section.mediaUrl}
                  onChange={(e) => updateField("mediaUrl", e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            )}

            {hasImage && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-500" /> Link ảnh (imageUrl)
                </label>
                <div className="space-y-2">
                  {(section.imageUrl || []).map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(idx, e.target.value)}
                        placeholder={`https://example.com/image${idx + 1}.jpg`}
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                      />
                      <button
                        onClick={() => removeImageUrl(idx)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all border border-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addImageUrl}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-3 py-2 rounded-lg border border-dashed border-indigo-300 hover:border-indigo-500 transition-all w-full justify-center"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm link ảnh
                  </button>
                </div>
              </div>
            )}

            {(part === 5 || part === 6 || part === 7) && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-green-500" /> Đoạn văn / Hướng dẫn (paragraph)
                </label>
                <textarea
                  value={section.paragraph}
                  onChange={(e) => updateField("paragraph", e.target.value)}
                  placeholder="Nhập nội dung đoạn văn, câu hướng dẫn... (có thể để trống)"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-y"
                />
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Câu hỏi ({section.questions.length})</p>
            </div>

            {section.questions.map((q, qIdx) => (
              <div key={qIdx} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                {/* Q Header */}
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {q.number}
                  </span>
                  <input
                    type="number"
                    value={q.number}
                    onChange={(e) => updateQuestion(qIdx, "number", Number(e.target.value))}
                    className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400 text-center"
                    title="Số thứ tự câu"
                  />
                  <button
                    onClick={() => onDeleteQuestion(sIdx, qIdx)}
                    disabled={section.questions.length === 1}
                    className="ml-auto p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Xóa câu hỏi"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Text */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1 block">
                    Nội dung câu hỏi {(part === 1 || part === 2) ? "(có thể để trống)" : ""}
                  </label>
                  <textarea
                    value={q.questionText}
                    onChange={(e) => updateQuestion(qIdx, "questionText", e.target.value)}
                    placeholder={
                      part === 1
                        ? "Part 1: để trống nếu câu hỏi chỉ là ảnh"
                        : part === 2
                        ? "Part 2: để trống nếu câu hỏi chỉ là audio"
                        : "Nhập nội dung câu hỏi..."
                    }
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isCorrect = q.answer === letter;
                    return (
                      <div
                        key={oIdx}
                        className={`flex items-center rounded-xl overflow-hidden border transition-all ${
                          isCorrect
                            ? "border-green-400 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <button
                          onClick={() => updateQuestion(qIdx, "answer", letter)}
                          title="Đặt làm đáp án đúng"
                          className={`w-9 min-h-[40px] flex items-center justify-center font-bold text-sm flex-shrink-0 border-r transition-all ${
                            isCorrect
                              ? "bg-green-500 text-white border-green-400"
                              : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {letter}
                        </button>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          placeholder={`Phương án ${letter}...`}
                          className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-gray-700"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 mb-1 block">
                    Giải thích đáp án (explanation – tuỳ chọn)
                  </label>
                  <textarea
                    value={q.explanation}
                    onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                    placeholder="Nhập giải thích cho đáp án đúng..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() =>
                onAddQuestion(sIdx, emptyQuestion(
                  Math.max(...section.questions.map((q) => q.number)) + 1,
                  part
                ))
              }
              className="w-full py-2.5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Thêm câu hỏi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TestManagement = () => {
  // ── View state ──────────────────────────────────────────────────────────────
  const [view, setView] = useState("list"); // "list" | "builder"
  const [editingTestId, setEditingTestId] = useState(null); // null = creating new

  // ── List view state ─────────────────────────────────────────────────────────
  const [tests, setTests] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [deleteConfirm, setDeleteConfirm] = useState(null); // testId to delete
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Builder state ────────────────────────────────────────────────────────────
  const [meta, setMeta] = useState(defaultTestMeta());
  const [sections, setSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [addPartOpen, setAddPartOpen] = useState(false);
  const [builderLoading, setBuilderLoading] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const fetchTests = useCallback(async (page = 1, search = "") => {
    setListLoading(true);
    try {
      const res = await axiosInstance.get(
        `/admin/tests?page=${page}&limit=20&search=${encodeURIComponent(search)}`
      );
      setTests(res.data.tests || []);
      setPagination(res.data.pagination || { page: 1, total: 0, totalPages: 1 });
    } catch (err) {
      toast.error("Lỗi tải danh sách đề thi: " + err.message);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "list") fetchTests(1, searchQuery);
  }, [view]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => {
      if (view === "list") fetchTests(1, searchQuery);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const openBuilder = async (testId = null) => {
    setEditingTestId(testId);
    setSections([]);
    if (testId) {
      setBuilderLoading(true);
      setView("builder");
      try {
        const res = await axiosInstance.get(`/admin/tests/${testId}`);
        const { test, questions } = res.data;
        setMeta({
          title: test.name,
          description: test.description || "",
          difficulty: test.difficulty,
          category: test.category,
          year: test.year,
          duration: test.duration,
        });
        // Map questions docs → sections state
        setSections(
          questions.map((q) => ({
            part: q.part,
            mediaUrl: q.mediaUrl || "",
            imageUrl: q.imageUrl || [],
            paragraph: q.paragraph || "",
            explanation: q.explanation || "",
            questions: q.questions.map((sq) => ({
              number: sq.number,
              questionText: sq.questionText || "",
              options: sq.options || ["A. ", "B. ", "C. ", "D. "],
              answer: sq.answer || "A",
              explanation: sq.explanation || "",
            })),
          }))
        );
      } catch (err) {
        toast.error("Không tải được dữ liệu đề thi: " + err.message);
      } finally {
        setBuilderLoading(false);
      }
    } else {
      setMeta(defaultTestMeta());
      setSections([]);
      setView("builder");
    }
  };

  const handleDeleteTest = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/admin/tests/${deleteConfirm}`);
      toast.success("✅ Đã xóa đề thi thành công!");
      setDeleteConfirm(null);
      fetchTests(pagination.page, searchQuery);
    } catch (err) {
      toast.error("Lỗi khi xóa đề thi: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Section update helpers ─────────────────────────────────────────────────

  const updateSection = (sIdx, field, value) => {
    setSections((prev) =>
      prev.map((s, i) => (i === sIdx ? { ...s, [field]: value } : s))
    );
  };

  const deleteSection = (sIdx) => {
    setSections((prev) => prev.filter((_, i) => i !== sIdx));
  };

  const addQuestion = (sIdx, newQ) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx ? { ...s, questions: [...s.questions, newQ] } : s
      )
    );
  };

  const deleteQuestion = (sIdx, qIdx) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sIdx
          ? { ...s, questions: s.questions.filter((_, j) => j !== qIdx) }
          : s
      )
    );
  };

  const addSection = (part) => {
    setSections((prev) => [...prev, emptySection(part)]);
    setAddPartOpen(false);
  };

  // ── Save ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!meta.title.trim()) {
      toast.warn("Vui lòng nhập tên đề thi");
      return;
    }
    if (sections.length === 0) {
      toast.warn("Vui lòng thêm ít nhất 1 section câu hỏi");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: meta.title.trim(),
        description: meta.description.trim(),
        difficulty: meta.difficulty,
        category: meta.category,
        year: Number(meta.year),
        duration: Number(meta.duration),
        sections: sections.map((s) => ({
          part: s.part,
          mediaUrl: s.mediaUrl || "",
          imageUrl: s.imageUrl || [],
          paragraph: s.paragraph || "",
          explanation: s.explanation || "",
          questions: s.questions.map((q) => {
            // Ensure correct option count
            let opts = [...q.options];
            if (s.part === 2) {
              opts = opts.slice(0, 3);
              while (opts.length < 3) opts.push("");
            } else {
              opts = opts.slice(0, 4);
              while (opts.length < 4) opts.push("");
            }
            return {
              number: q.number,
              questionText: q.questionText || "",
              options: opts,
              answer: q.answer || "",
              explanation: q.explanation || "",
            };
          }),
        })),
      };

      if (editingTestId) {
        await axiosInstance.put(`/admin/tests/${editingTestId}`, payload);
        toast.success("✅ Cập nhật đề thi thành công!");
      } else {
        await axiosInstance.post("/admin/tests", payload);
        toast.success("✅ Tạo đề thi mới thành công!");
      }

      setView("list");
    } catch (err) {
      toast.error("Lỗi khi lưu đề thi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ── Render: List View ────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  if (view === "list") {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Quản lý đề thi TOEIC
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Tạo, chỉnh sửa và quản lý đề thi theo chuẩn ETS
            </p>
          </div>
          <button
            onClick={() => openBuilder(null)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> Tạo đề thi mới
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm đề thi theo tên..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {listLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="ml-3 text-gray-500">Đang tải...</span>
            </div>
          ) : tests.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Chưa có đề thi nào</p>
              <p className="text-gray-400 text-sm mt-1">Bấm "Tạo đề thi mới" để bắt đầu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Tên đề thi
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Danh mục
                    </th>
                    <th className="text-left px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Độ khó
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Năm
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Số câu
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Sections
                    </th>
                    <th className="text-center px-4 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="text-right px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tests.map((test) => (
                    <tr key={test._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                            {test.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 font-mono">{test.testId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge color="blue">{test.category}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <DifficultyBadge value={test.difficulty} />
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600 font-medium">{test.year}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-semibold text-gray-800">{test.actualQuestionCount ?? test.totalQuestions}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-gray-500">{test.sectionCount ?? "–"}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">{test.duration} phút</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openBuilder(test.testId)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-400 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(test.testId)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-400 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <span>Tổng {pagination.total} đề thi</span>
            <div className="flex gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => fetchTests(pg, searchQuery)}
                  className={`w-9 h-9 rounded-lg font-semibold transition-all ${
                    pg === pagination.page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Xác nhận xóa</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                Bạn có chắc chắn muốn xóa đề thi{" "}
                <strong className="text-gray-800 font-mono">{deleteConfirm}</strong>?<br />
                <span className="text-red-500">Tất cả câu hỏi liên quan sẽ bị xóa vĩnh viễn.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteTest}
                  disabled={deleteLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ── Render: Builder View ─────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Builder Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">
            {editingTestId ? `Chỉnh sửa: ${editingTestId}` : "Tạo đề thi mới"}
          </span>
        </div>
      </div>

      {builderLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <span className="ml-3 text-gray-500">Đang tải dữ liệu đề thi...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── Metadata Form ────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Thông tin đề thi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Tên đề thi *
                </label>
                <input
                  type="text"
                  value={meta.title}
                  onChange={(e) => setMeta((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Ví dụ: ETS 2024 – Test 1"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base font-semibold focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={meta.description}
                  onChange={(e) => setMeta((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả ngắn về đề thi..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Độ khó
                </label>
                <select
                  value={meta.difficulty}
                  onChange={(e) => setMeta((p) => ({ ...p, difficulty: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all bg-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Danh mục
                </label>
                <select
                  value={meta.category}
                  onChange={(e) => setMeta((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all bg-white"
                >
                  <option value="Full Test">Full Test</option>
                  <option value="Practice Test">Practice Test</option>
                  <option value="Mini Test">Mini Test</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Năm đề thi
                </label>
                <input
                  type="number"
                  value={meta.year}
                  onChange={(e) => setMeta((p) => ({ ...p, year: e.target.value }))}
                  min="2000"
                  max="2100"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Thời gian (phút)
                </label>
                <input
                  type="number"
                  value={meta.duration}
                  onChange={(e) => setMeta((p) => ({ ...p, duration: e.target.value }))}
                  min="1"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Sections ─────────────────────────────────────────────────── */}
          <div className="space-y-4">
            {sections.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl py-16 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Plus className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-gray-500 font-semibold">Chưa có section nào</p>
                <p className="text-gray-400 text-sm mt-1">Bấm "+ Thêm section" để thêm câu hỏi</p>
              </div>
            ) : (
              sections.map((section, sIdx) => (
                <SectionCard
                  key={sIdx}
                  section={section}
                  sIdx={sIdx}
                  onUpdate={updateSection}
                  onDelete={deleteSection}
                  onAddQuestion={addQuestion}
                  onDeleteQuestion={deleteQuestion}
                />
              ))
            )}

            {/* Add Section Button */}
            <div className="relative">
              <button
                onClick={() => setAddPartOpen((p) => !p)}
                className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-xl text-sm font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Thêm section / Part mới
                <ChevronDown className={`w-4 h-4 transition-transform ${addPartOpen ? "rotate-180" : ""}`} />
              </button>

              {addPartOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                  <div className="p-3 grid grid-cols-1 gap-1">
                    {Object.entries(PART_INFO).map(([partNum, info]) => (
                      <button
                        key={partNum}
                        onClick={() => addSection(Number(partNum))}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 transition-all text-left group"
                      >
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-indigo-700">
                          P{partNum}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm">{info.label}</p>
                          <p className="text-xs text-gray-400 truncate">{info.desc}</p>
                        </div>
                        <Badge color={LISTENING_PARTS.includes(Number(partNum)) ? "orange" : "purple"}>
                          {LISTENING_PARTS.includes(Number(partNum)) ? "Listening" : "Reading"}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats + Save bar ─────────────────────────────────────────── */}
          <div className="sticky bottom-4 z-10">
            <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>
                  <strong className="text-gray-800 font-bold">{sections.length}</strong> sections
                </span>
                <span className="text-gray-300">|</span>
                <span>
                  <strong className="text-gray-800 font-bold">
                    {sections.reduce((a, s) => a + s.questions.length, 0)}
                  </strong>{" "}
                  câu hỏi
                </span>
                {sections.length > 0 && (
                  <>
                    <span className="text-gray-300">|</span>
                    <span className="flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-orange-500" />
                      {sections.filter((s) => LISTENING_PARTS.includes(s.part)).reduce((a, s) => a + s.questions.length, 0)} listening
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                      {sections.filter((s) => !LISTENING_PARTS.includes(s.part)).reduce((a, s) => a + s.questions.length, 0)} reading
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:scale-100"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {editingTestId ? "Cập nhật đề thi" : "Lưu đề thi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close part picker */}
      {addPartOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setAddPartOpen(false)}
        />
      )}
    </div>
  );
};

export default TestManagement;
