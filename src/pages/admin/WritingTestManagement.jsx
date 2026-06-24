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
  Image as ImageIcon,
  Mail,
  BookOpen,
  X,
  Loader2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  PenLine,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_TYPES = {
  photo_description: {
    label: "Part 1 – Viết câu theo ảnh",
    part: 1,
    color: "bg-blue-100 text-blue-700",
    icon: "🖼️",
  },
  email_response: {
    label: "Part 2 – Phản hồi email",
    part: 2,
    color: "bg-purple-100 text-purple-700",
    icon: "📧",
  },
  opinion_essay: {
    label: "Part 3 – Viết luận",
    part: 3,
    color: "bg-green-100 text-green-700",
    icon: "✍️",
  },
};

const emptyQuestion = (type = "photo_description", qNum = 1) => ({
  questionNumber: qNum,
  part: QUESTION_TYPES[type].part,
  type,
  imageUrl: "",
  emailFrom: "",
  emailTo: "",
  emailSubject: "",
  emailSent: "",
  emailBody: "",
  emailDirections: "",
  essayPrompt: "",
});

const defaultMeta = () => ({
  writingTestId: "",
  name: "",
  description: "",
  duration: 60,
  difficulty: "intermediate",
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
  const map = {
    beginner: ["green", "Beginner"],
    intermediate: ["blue", "Intermediate"],
    advanced: ["red", "Advanced"],
  };
  const [color, label] = map[value] || ["gray", value];
  return <Badge color={color}>{label}</Badge>;
};

// ─── Question Card ────────────────────────────────────────────────────────────

const QuestionCard = ({ q, idx, onUpdate, onDelete, totalCount }) => {
  const [collapsed, setCollapsed] = useState(false);
  const typeInfo = QUESTION_TYPES[q.type] || {};

  const update = (field, val) => onUpdate(idx, { ...q, [field]: val });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
            {q.questionNumber}
          </span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {typeInfo.icon} {typeInfo.label}
            </p>
            <p className="text-xs text-gray-400">
              Part {q.part} · Câu số {q.questionNumber}
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeInfo.color}`}>
            {q.type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed((p) => !p)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-all"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(idx)}
            disabled={totalCount <= 1}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-5 space-y-4">
          {/* Question number + type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Số câu (questionNumber)
              </label>
              <input
                type="number"
                value={q.questionNumber}
                onChange={(e) => update("questionNumber", Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                min={1}
                max={8}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                Loại câu hỏi
              </label>
              <select
                value={q.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  onUpdate(idx, {
                    ...q,
                    type: newType,
                    part: QUESTION_TYPES[newType].part,
                  });
                }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                {Object.entries(QUESTION_TYPES).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.icon} {info.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Part 1: Photo Description */}
          {q.type === "photo_description" && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" /> URL Ảnh (imageUrl)
              </label>
              <input
                type="url"
                value={q.imageUrl || ""}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              {q.imageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 max-h-48">
                  <img
                    src={q.imageUrl}
                    alt="preview"
                    className="w-full h-full object-contain"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>
          )}

          {/* Part 2: Email Response */}
          {q.type === "email_response" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {["emailFrom", "emailTo", "emailSubject", "emailSent"].map((field) => (
                  <div key={field}>
                    <label className="text-xs font-semibold text-gray-400 mb-1 block uppercase">
                      {field.replace("email", "")}
                    </label>
                    <input
                      type="text"
                      value={q[field] || ""}
                      onChange={(e) => update(field, e.target.value)}
                      placeholder={field}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1 block uppercase">
                  Nội dung email (emailBody)
                </label>
                <textarea
                  value={q.emailBody || ""}
                  onChange={(e) => update("emailBody", e.target.value)}
                  placeholder="Nội dung email..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-y"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 mb-1 block uppercase">
                  Hướng dẫn (emailDirections)
                </label>
                <textarea
                  value={q.emailDirections || ""}
                  onChange={(e) => update("emailDirections", e.target.value)}
                  placeholder="Directions: Respond to the e-mail..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-y"
                />
              </div>
            </div>
          )}

          {/* Part 3: Opinion Essay */}
          {q.type === "opinion_essay" && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-green-500" /> Đề bài luận (essayPrompt)
              </label>
              <textarea
                value={q.essayPrompt || ""}
                onChange={(e) => update("essayPrompt", e.target.value)}
                placeholder="Many people enjoy... Why do you think...?"
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-y"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const WritingTestManagement = () => {
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  // ── View ──────────────────────────────────────────────────────────────────
  const [view, setView] = useState("list"); // "list" | "builder"
  const [editingId, setEditingId] = useState(null);

  // ── List state ─────────────────────────────────────────────────────────────
  const [tests, setTests] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Builder state ──────────────────────────────────────────────────────────
  const [meta, setMeta] = useState(defaultMeta());
  const [questions, setQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [addTypeOpen, setAddTypeOpen] = useState(false);

  // ── Fetch list ─────────────────────────────────────────────────────────────
  const fetchTests = useCallback(
    async (page = 1, search = "") => {
      setListLoading(true);
      try {
        const res = await axiosInstance.get(
          `/admin/writing-tests?page=${page}&limit=20&search=${encodeURIComponent(search)}`
        );
        setTests(res.data?.tests || []);
        setPagination(res.data?.pagination || { page: 1, total: 0, totalPages: 1 });
      } catch (err) {
        toast.error("Lỗi tải danh sách: " + err.message);
      } finally {
        setListLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (view === "list") fetchTests(1, searchQuery);
  }, [view]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (view === "list") fetchTests(1, searchQuery);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // ── Open builder ───────────────────────────────────────────────────────────
  const openBuilder = async (writingTestId = null) => {
    setEditingId(writingTestId);
    if (writingTestId) {
      setBuilderLoading(true);
      setView("builder");
      try {
        const res = await axiosInstance.get(`/admin/writing-tests/${writingTestId}`);
        const test = res.data;
        setMeta({
          writingTestId: test.writingTestId,
          name: test.name,
          description: test.description || "",
          duration: test.duration,
          difficulty: test.difficulty,
        });
        setQuestions(
          (test.questions || []).map((q) => ({
            questionNumber: q.questionNumber,
            part: q.part,
            type: q.type,
            imageUrl: q.imageUrl || "",
            emailFrom: q.emailFrom || "",
            emailTo: q.emailTo || "",
            emailSubject: q.emailSubject || "",
            emailSent: q.emailSent || "",
            emailBody: q.emailBody || "",
            emailDirections: q.emailDirections || "",
            essayPrompt: q.essayPrompt || "",
          }))
        );
      } catch (err) {
        toast.error("Không tải được dữ liệu: " + err.message);
      } finally {
        setBuilderLoading(false);
      }
    } else {
      setMeta(defaultMeta());
      setQuestions([]);
      setView("builder");
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(`/admin/writing-tests/${deleteConfirm}`);
      toast.success("✅ Đã xóa đề thi writing!");
      setDeleteConfirm(null);
      fetchTests(pagination.page, searchQuery);
    } catch (err) {
      toast.error("Lỗi xóa: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Question helpers ───────────────────────────────────────────────────────
  const updateQuestion = (idx, newQ) =>
    setQuestions((prev) => prev.map((q, i) => (i === idx ? newQ : q)));

  const deleteQuestion = (idx) =>
    setQuestions((prev) => prev.filter((_, i) => i !== idx));

  const addQuestion = (type) => {
    const maxNum = questions.length > 0 ? Math.max(...questions.map((q) => q.questionNumber)) : 0;
    setQuestions((prev) => [...prev, emptyQuestion(type, maxNum + 1)]);
    setAddTypeOpen(false);
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!meta.name.trim()) { toast.warn("Vui lòng nhập tên đề thi"); return; }
    if (!editingId && !meta.writingTestId.trim()) { toast.warn("Vui lòng nhập Writing Test ID"); return; }
    if (questions.length === 0) { toast.warn("Vui lòng thêm ít nhất 1 câu hỏi"); return; }

    setIsSaving(true);
    try {
      const payload = {
        name: meta.name.trim(),
        description: meta.description.trim(),
        duration: Number(meta.duration),
        difficulty: meta.difficulty,
        questions: questions.map((q) => ({
          questionNumber: q.questionNumber,
          part: q.part,
          type: q.type,
          imageUrl: q.imageUrl || undefined,
          emailFrom: q.emailFrom || undefined,
          emailTo: q.emailTo || undefined,
          emailSubject: q.emailSubject || undefined,
          emailSent: q.emailSent || undefined,
          emailBody: q.emailBody || undefined,
          emailDirections: q.emailDirections || undefined,
          essayPrompt: q.essayPrompt || undefined,
        })),
      };

      if (editingId) {
        await axiosInstance.put(`/admin/writing-tests/${editingId}`, payload);
        toast.success("✅ Cập nhật đề thi writing thành công!");
      } else {
        await axiosInstance.post("/admin/writing-tests", { ...payload, writingTestId: meta.writingTestId.trim() });
        toast.success("✅ Tạo đề thi writing thành công!");
      }
      setView("list");
    } catch (err) {
      toast.error("Lỗi lưu đề thi: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ── RENDER: List View ────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  if (view === "list") {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <PenLine className="w-6 h-6 text-white" />
              </div>
              Quản lý đề thi Writing
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Tạo, chỉnh sửa và quản lý đề thi TOEIC Writing (3 parts)
            </p>
          </div>
          <button
            onClick={() => openBuilder(null)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> Tạo đề mới
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên, ID..."
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
                <PenLine className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Chưa có đề thi writing nào</p>
              <p className="text-gray-400 text-sm mt-1">Bấm "Tạo đề mới" để bắt đầu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Tên đề thi", "Writing Test ID", "Độ khó", "Thời gian", "Số câu", "Đã làm", "Thao tác"].map((h) => (
                      <th key={h} className="text-left px-5 py-4 font-semibold text-gray-500 text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
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
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{test.description}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">
                          {test.writingTestId}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <DifficultyBadge value={test.difficulty} />
                      </td>
                      <td className="px-5 py-4 text-gray-600">{test.duration} phút</td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-semibold text-gray-800">
                          {test.questions?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center text-gray-500">
                        {test.completedCount ?? 0}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openBuilder(test.writingTestId)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-400 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(test.writingTestId)}
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

        {/* Delete modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Xác nhận xóa</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                Bạn có chắc muốn xóa đề thi{" "}
                <strong className="text-gray-800 font-mono">{deleteConfirm}</strong>?
                <br />
                <span className="text-red-500">Hành động này không thể hoàn tác.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
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
  // ── RENDER: Builder View ─────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Builder Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-semibold text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="flex-1 h-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">
            {editingId ? `Chỉnh sửa: ${editingId}` : "Tạo đề thi Writing mới"}
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-60 shadow-md shadow-indigo-200"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Lưu đề thi
        </button>
      </div>

      {builderLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <span className="ml-3 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── Metadata Form ────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Thông tin đề thi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Writing Test ID – chỉ cho tạo mới */}
              {!editingId && (
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Writing Test ID * <span className="text-gray-400 font-normal normal-case">(ví dụ: writing-002, không thể sửa sau khi tạo)</span>
                  </label>
                  <input
                    type="text"
                    value={meta.writingTestId}
                    onChange={(e) => setMeta((p) => ({ ...p, writingTestId: e.target.value }))}
                    placeholder="writing-002"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Tên đề thi *
                </label>
                <input
                  type="text"
                  value={meta.name}
                  onChange={(e) => setMeta((p) => ({ ...p, name: e.target.value }))}
                  placeholder="TOEIC Writing Test – Đề 02"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Mô tả
                </label>
                <textarea
                  value={meta.description}
                  onChange={(e) => setMeta((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Mô tả ngắn về đề thi..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Thời gian (phút)
                </label>
                <input
                  type="number"
                  value={meta.duration}
                  onChange={(e) => setMeta((p) => ({ ...p, duration: Number(e.target.value) }))}
                  min={1}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Độ khó
                </label>
                <select
                  value={meta.difficulty}
                  onChange={(e) => setMeta((p) => ({ ...p, difficulty: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Questions ────────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-indigo-500" />
                Câu hỏi ({questions.length})
              </h2>

              {/* Add question dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAddTypeOpen((p) => !p)}
                  className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-xl text-sm font-semibold hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                >
                  <Plus className="w-4 h-4" /> Thêm câu hỏi
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {addTypeOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 z-20 py-2">
                    {Object.entries(QUESTION_TYPES).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => addQuestion(key)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-all"
                      >
                        <span className="text-lg">{info.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{info.label}</p>
                          <p className="text-xs text-gray-400">Part {info.part}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenLine className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">Chưa có câu hỏi nào</p>
                <p className="text-gray-300 text-sm mt-1">Bấm "Thêm câu hỏi" để bắt đầu</p>
              </div>
            ) : (
              questions.map((q, idx) => (
                <QuestionCard
                  key={idx}
                  q={q}
                  idx={idx}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                  totalCount={questions.length}
                />
              ))
            )}
          </div>

          {/* Bottom save */}
          <div className="flex justify-end pt-4 pb-8">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-60 shadow-lg shadow-indigo-200"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Lưu đề thi
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {addTypeOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setAddTypeOpen(false)} />
      )}
    </div>
  );
};

export default WritingTestManagement;
