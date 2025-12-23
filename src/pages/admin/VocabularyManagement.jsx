import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Book,
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  FileText,
  Download,
  Upload,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const VocabularyManagement = () => {
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  const [vocabularies, setVocabularies] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 20;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [selectedVocabulary, setSelectedVocabulary] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    vocab: "",
    explanation_en: "",
    meaning_vi: "",
    example_en: "",
    example_vi: "",
    lesson: "",
  });

  // Bulk add state
  const [bulkData, setBulkData] = useState("");

  const fetchLessons = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/vocabularies/lessons`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch lessons");

      const result = await response.json();
      setLessons(result.data);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách lessons: " + error.message);
    }
  }, [accessToken]);

  const fetchVocabularies = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (selectedLesson) {
        params.append("lesson", selectedLesson);
      }
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/vocabularies?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch vocabularies");

      const result = await response.json();
      setVocabularies(result.data.vocabularies);
      setTotalPages(result.data.pagination.totalPages);
      setTotal(result.data.pagination.total);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách vocabulary: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, currentPage, selectedLesson, searchTerm]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  useEffect(() => {
    fetchVocabularies();
  }, [fetchVocabularies]);

  const handleAddVocabulary = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/vocabularies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            index: parseInt(formData.index),
            lesson: parseInt(formData.lesson),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add vocabulary");

      toast.success("Thêm vocabulary thành công!");
      setShowAddModal(false);
      resetForm();
      fetchVocabularies();
      fetchLessons();
    } catch (error) {
      toast.error("Lỗi khi thêm vocabulary: " + error.message);
    }
  };

  const handleEditVocabulary = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/vocabularies/${
          selectedVocabulary._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            index: parseInt(formData.index),
            lesson: parseInt(formData.lesson),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update vocabulary");

      toast.success("Cập nhật vocabulary thành công!");
      setShowEditModal(false);
      resetForm();
      fetchVocabularies();
      fetchLessons();
    } catch (error) {
      toast.error("Lỗi khi cập nhật vocabulary: " + error.message);
    }
  };

  const handleDeleteVocabulary = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/vocabularies/${
          selectedVocabulary._id
        }`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete vocabulary");

      toast.success("Xóa vocabulary thành công!");
      setShowDeleteModal(false);
      setSelectedVocabulary(null);
      fetchVocabularies();
      fetchLessons();
    } catch (error) {
      toast.error("Lỗi khi xóa vocabulary: " + error.message);
    }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();

    try {
      // Parse bulk data (expecting JSON format)
      const vocabulariesArray = JSON.parse(bulkData);

      if (!Array.isArray(vocabulariesArray)) {
        throw new Error("Data must be an array");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/vocabularies/bulk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ vocabularies: vocabulariesArray }),
        }
      );

      if (!response.ok) throw new Error("Failed to add vocabularies");

      const result = await response.json();
      toast.success(`Thêm ${result.data.created} vocabularies thành công!`);
      setShowBulkAddModal(false);
      setBulkData("");
      fetchVocabularies();
      fetchLessons();
    } catch (error) {
      toast.error("Lỗi khi thêm vocabularies: " + error.message);
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(vocabularies, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vocabularies_lesson_${selectedLesson || "all"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export thành công!");
  };

  const openEditModal = (vocabulary) => {
    setSelectedVocabulary(vocabulary);
    setFormData({
      vocab: vocabulary.vocab,
      explanation_en: vocabulary.explanation_en,
      meaning_vi: vocabulary.meaning_vi,
      example_en: vocabulary.example_en,
      example_vi: vocabulary.example_vi,
      lesson: vocabulary.lesson,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (vocabulary) => {
    setSelectedVocabulary(vocabulary);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      vocab: "",
      explanation_en: "",
      meaning_vi: "",
      example_en: "",
      example_vi: "",
      lesson: "",
    });
    setSelectedVocabulary(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleLessonFilter = (e) => {
    setSelectedLesson(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Book className="w-8 h-8 text-blue-600" />
          Quản lý Vocabulary
        </h1>
        <p className="text-gray-600 mt-1">Quản lý từ vựng cho các lessons</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm từ vựng..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lesson Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedLesson}
              onChange={handleLessonFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả lessons</option>
              {lessons.map((lesson) => (
                <option key={lesson.lesson} value={lesson.lesson}>
                  Lesson {lesson.lesson} ({lesson.count} từ)
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Thêm mới
            </button>
            <button
              onClick={() => setShowBulkAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Thêm nhiều
            </button>
            <button
              onClick={handleExportJSON}
              disabled={vocabularies.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4 text-sm text-gray-600">
          <span>
            Tổng số: <strong>{total}</strong> từ vựng
          </span>
          <span>•</span>
          <span>
            Tổng số: <strong>{lessons.length}</strong> lessons
          </span>
          {selectedLesson && (
            <>
              <span>•</span>
              <span>
                Lesson {selectedLesson}:{" "}
                <strong>
                  {lessons.find((l) => l.lesson === parseInt(selectedLesson))
                    ?.count || 0}
                </strong>{" "}
                từ
              </span>
            </>
          )}
        </div>
      </div>

      {/* Vocabularies Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : vocabularies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Book className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Không có vocabulary nào</p>
            <p className="text-sm mt-2">
              Thêm vocabulary mới để bắt đầu quản lý
            </p>
          </div>
        ) : (
          <>
            {/* Card Grid Layout */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vocabularies.map((vocab) => (
                  <div
                    key={vocab._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Lesson {vocab.lesson}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(vocab)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(vocab)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Word */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {vocab.vocab}
                      </h3>
                      {vocab.meaning_vi && (
                        <p className="text-sm text-blue-600 font-medium">
                          {vocab.meaning_vi}
                        </p>
                      )}
                    </div>

                    {/* Explanation */}
                    {vocab.explanation_en && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 italic">
                          {vocab.explanation_en}
                        </p>
                      </div>
                    )}

                    {/* Examples */}
                    {(vocab.example_en || vocab.example_vi) && (
                      <div className="space-y-2 pt-3 border-t border-gray-100">
                        {vocab.example_en && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Example (EN):
                            </p>
                            <p className="text-sm text-gray-700">
                              {vocab.example_en}
                            </p>
                          </div>
                        )}
                        {vocab.example_vi && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Ví dụ (VI):
                            </p>
                            <p className="text-sm text-gray-700">
                              {vocab.example_vi}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, total)}
                  </span>{" "}
                  trong tổng số <span className="font-medium">{total}</span> kết
                  quả
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                  </button>
                  <span className="px-4 py-1 bg-white border border-gray-300 rounded-lg">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Sau
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-6 h-6 text-blue-600" />
                Thêm Vocabulary Mới
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddVocabulary} className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.lesson}
                  onChange={(e) =>
                    setFormData({ ...formData, lesson: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1, 2, 3..."
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ vựng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.vocab}
                  onChange={(e) =>
                    setFormData({ ...formData, vocab: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: abandon /ə'bændən/"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giải thích (EN)
                </label>
                <input
                  type="text"
                  value={formData.explanation_en}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation_en: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="English explanation"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại từ & Nghĩa (VI)
                </label>
                <input
                  type="text"
                  value={formData.meaning_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, meaning_vi: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(v) bỏ rơi, từ bỏ"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ví dụ (EN)
                </label>
                <textarea
                  value={formData.example_en}
                  onChange={(e) =>
                    setFormData({ ...formData, example_en: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="English example sentence"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ví dụ (VI)
                </label>
                <textarea
                  value={formData.example_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, example_vi: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Câu ví dụ tiếng Việt"
                />
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-600" />
                Chỉnh sửa Vocabulary
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditVocabulary} className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.lesson}
                  onChange={(e) =>
                    setFormData({ ...formData, lesson: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ vựng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.vocab}
                  onChange={(e) =>
                    setFormData({ ...formData, vocab: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giải thích (EN)
                </label>
                <input
                  type="text"
                  value={formData.explanation_en}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation_en: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại từ & Nghĩa (VI)
                </label>
                <input
                  type="text"
                  value={formData.meaning_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, meaning_vi: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ví dụ (EN)
                </label>
                <textarea
                  value={formData.example_en}
                  onChange={(e) =>
                    setFormData({ ...formData, example_en: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ví dụ (VI)
                </label>
                <textarea
                  value={formData.example_vi}
                  onChange={(e) =>
                    setFormData({ ...formData, example_vi: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Xác nhận xóa
                  </h2>
                  <p className="text-sm text-gray-600">
                    Thao tác này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Bạn có chắc chắn muốn xóa vocabulary:
                </p>
                <p className="font-medium text-gray-900">
                  {selectedVocabulary?.vocab}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Lesson {selectedVocabulary?.lesson}
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedVocabulary(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteVocabulary}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Upload className="w-6 h-6 text-green-600" />
                Thêm nhiều Vocabulary
              </h2>
              <button
                onClick={() => {
                  setShowBulkAddModal(false);
                  setBulkData("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBulkAdd} className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Nhập dữ liệu JSON theo định dạng sau:
                </p>
                <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono overflow-x-auto">
                  <pre>{`[
  {
    "vocab": "cancellation /,kænse'leiʃn/",
    "explanation_en": "a decision to stop something that has already been arranged",
    "meaning_vi": "(n): sự bãi bỏ, hủy bỏ",
    "example_en": "The cancelation of her flight caused her problems",
    "example_vi": "Việc hủy chuyến bay đã gây cho cô ấy nhiều vấn đề",
    "lesson": 1
  }
]`}</pre>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dữ liệu JSON <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={bulkData}
                  onChange={(e) => setBulkData(e.target.value)}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                  placeholder="Paste JSON data here..."
                />
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkAddModal(false);
                    setBulkData("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Thêm tất cả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyManagement;
