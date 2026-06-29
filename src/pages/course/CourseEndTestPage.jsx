import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Flag, Trophy, ArrowUpCircle,
  RefreshCw, X, Zap, CheckCircle2, XCircle, MinusCircle,
  BarChart3, Home, RotateCcw,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import score from "@/utils/score";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "@/redux/authSlice";
import { toast } from "react-toastify";

// ==================== LEVEL CONFIG ====================
const LEVEL_CONFIG = {
  beginner: {
    label: "Beginner", range: "0 - 449", min: 0, max: 449,
    color: "from-green-400 to-emerald-500", badge: "🌱",
    textColor: "text-green-700", bg: "bg-green-50", border: "border-green-300",
  },
  intermediate: {
    label: "Intermediate", range: "450 - 649", min: 450, max: 649,
    color: "from-blue-400 to-indigo-500", badge: "📚",
    textColor: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300",
  },
  advanced: {
    label: "Advanced", range: "650+", min: 650, max: 990,
    color: "from-purple-500 to-violet-600", badge: "🏆",
    textColor: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300",
  },
};

const getLevelByScore = (totalScore) => {
  if (totalScore >= 650) return "advanced";
  if (totalScore >= 450) return "intermediate";
  return "beginner";
};

const PART_INFO = {
  1: { name: "Photographs", hasImage: true },
  2: { name: "Question–Response", hasImage: false },
  3: { name: "Conversations", hasImage: false },
  4: { name: "Short Talks", hasImage: false },
  5: { name: "Incomplete Sentences", hasImage: false },
  6: { name: "Text Completion", hasImage: false },
  7: { name: "Reading Comprehension", hasImage: false },
};

// ==================== LEVEL UP RESULT MODAL ====================
const LevelResultModal = ({ isVisible, onClose, result, onRetry }) => {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setAnimating(true), 100);
    } else {
      setAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible || !result) return null;

  const { totalScore, previousLevel, newLevel, isLevelUp } = result;
  const prevConfig = LEVEL_CONFIG[previousLevel] || LEVEL_CONFIG.beginner;
  const newConfig = LEVEL_CONFIG[newLevel] || LEVEL_CONFIG.beginner;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all duration-500 ${
          animating ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Gradient Header */}
        <div className={`bg-gradient-to-br ${isLevelUp ? newConfig.color : "from-gray-400 to-gray-500"} p-8 text-white text-center relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          {isLevelUp ? (
            <>
              <div className="text-6xl mb-3 relative z-10">🎉</div>
              <h2 className="text-3xl font-black relative z-10">THĂNG CẤP!</h2>
              <p className="text-white/90 mt-1 text-lg relative z-10">Chúc mừng bạn đã đạt level mới!</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-3 relative z-10">💪</div>
              <h2 className="text-2xl font-black relative z-10">CỐ LÊN NÀO!</h2>
              <p className="text-white/90 mt-1 text-lg relative z-10">Bạn chưa vượt qua ngưỡng điểm cần thiết</p>
            </>
          )}
        </div>

        <div className="p-6">
          {/* Score */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-200">
              <span className="text-gray-600 font-medium">Điểm của bạn:</span>
              <span className="text-4xl font-black text-gray-800">{totalScore}</span>
              <span className="text-gray-400 text-lg">/990</span>
            </div>
          </div>

          {/* Level transition */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`flex-1 text-center p-4 rounded-2xl ${prevConfig.bg} border ${prevConfig.border}`}>
              <div className="text-3xl mb-1">{prevConfig.badge}</div>
              <p className="text-xs text-gray-500 mb-1">Trước đây</p>
              <p className={`font-bold text-sm ${prevConfig.textColor}`}>{prevConfig.label}</p>
              <p className="text-xs text-gray-400">{prevConfig.range}</p>
            </div>
            <div className="flex flex-col items-center">
              {isLevelUp ? (
                <ArrowUpCircle className="w-10 h-10 text-green-500 animate-bounce" />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center text-gray-400 text-2xl">→</div>
              )}
            </div>
            <div className={`flex-1 text-center p-4 rounded-2xl border-2 ${
              isLevelUp ? `${newConfig.bg} ${newConfig.border} shadow-lg ring-2 ring-offset-2 ring-green-300` : `${prevConfig.bg} ${prevConfig.border}`
            }`}>
              <div className="text-3xl mb-1">{isLevelUp ? newConfig.badge : prevConfig.badge}</div>
              <p className="text-xs text-gray-500 mb-1">Hiện tại</p>
              <p className={`font-bold text-sm ${isLevelUp ? newConfig.textColor : prevConfig.textColor}`}>
                {isLevelUp ? newConfig.label : prevConfig.label}
              </p>
              <p className="text-xs text-gray-400">{isLevelUp ? newConfig.range : prevConfig.range}</p>
            </div>
          </div>

          {/* Message */}
          {isLevelUp ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
              <p className="text-green-800 font-semibold">
                🌟 Tuyệt vời! Bạn đã nâng cấp từ <strong>{prevConfig.label}</strong> lên <strong>{newConfig.label}</strong>!
              </p>
              <p className="text-green-700 text-sm mt-1">Hệ thống đã cập nhật level của bạn. Tiếp tục phấn đấu nhé!</p>
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 text-center">
              <p className="text-orange-800 font-semibold">
                Bạn vẫn đang ở level <strong>{prevConfig.label}</strong> ({prevConfig.range} điểm)
              </p>
              <p className="text-orange-700 text-sm mt-2">
                {previousLevel === "beginner" && "Bạn cần đạt ≥ 450 điểm để lên Intermediate. Hãy ôn luyện thêm và thử lại! 💪"}
                {previousLevel === "intermediate" && "Bạn cần đạt ≥ 650 điểm để lên Advanced. Cố gắng lên nào! 🚀"}
                {previousLevel === "advanced" && "Bạn đã ở level cao nhất! Hãy tiếp tục duy trì phong độ! ⭐"}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {!isLevelUp && (
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                Làm lại
              </button>
            )}
            <button
              onClick={onClose}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-md ${
                isLevelUp
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
              }`}
            >
              {isLevelUp ? <><Trophy className="w-4 h-4" /> Xem kết quả!</> : "Xem chi tiết"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== RESULT VIEW ====================
const ResultView = ({ levelResult, detailedAnswers, onRetry, onGoHome }) => {
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "correct" | "wrong" | "unanswered"
  const [activePart, setActivePart] = useState("all");

  if (!levelResult || !detailedAnswers) return null;

  const {
    totalScore, listeningScore, readingScore,
    listeningCorrect, readingCorrect, previousLevel, newLevel, isLevelUp,
  } = levelResult;

  const totalCorrect = listeningCorrect + readingCorrect;
  const totalWrong = detailedAnswers.filter((a) => a.userAnswer && !a.isCorrect).length;
  const totalUnanswered = detailedAnswers.filter((a) => !a.userAnswer).length;
  const newLevelConfig = LEVEL_CONFIG[newLevel] || LEVEL_CONFIG.beginner;

  // Filter logic
  const filteredAnswers = detailedAnswers.filter((a) => {
    const passFilter =
      activeFilter === "all" ||
      (activeFilter === "correct" && a.isCorrect) ||
      (activeFilter === "wrong" && a.userAnswer && !a.isCorrect) ||
      (activeFilter === "unanswered" && !a.userAnswer);
    const passPart = activePart === "all" || a.part === parseInt(activePart);
    return passFilter && passPart;
  });

  // Group by part
  const partNums = [...new Set(detailedAnswers.map((a) => a.part))].sort((a, b) => a - b);

  const getPartStats = (part) => {
    const partAnswers = detailedAnswers.filter((a) => a.part === part);
    const correct = partAnswers.filter((a) => a.isCorrect).length;
    const wrong = partAnswers.filter((a) => a.userAnswer && !a.isCorrect).length;
    const unanswered = partAnswers.filter((a) => !a.userAnswer).length;
    return { total: partAnswers.length, correct, wrong, unanswered };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg text-gray-800 leading-tight">Kết Quả Bài Test Cuối Khóa</h1>
              <p className="text-xs text-gray-500">ETS 2024 Full Test 1</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-xl font-medium text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Làm lại
            </button>
            <button
              onClick={onGoHome}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              Về lịch học
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

        {/* ===== SCORE SUMMARY ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Level result banner */}
          <div className={`bg-gradient-to-r ${isLevelUp ? newLevelConfig.color : "from-gray-400 to-gray-500"} p-5 text-white`}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{isLevelUp ? "🎉" : "💪"}</div>
              <div>
                <p className="font-black text-xl">{isLevelUp ? "THĂNG CẤP THÀNH CÔNG!" : "CHƯA VƯỢT QUA NGƯỠNG ĐIỂM"}</p>
                <p className="text-white/90 text-sm mt-0.5">
                  {isLevelUp
                    ? `${LEVEL_CONFIG[previousLevel]?.label} → ${newLevelConfig.label}`
                    : `Vẫn ở level ${LEVEL_CONFIG[previousLevel]?.label}`}
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-4xl font-black">{totalScore}</div>
                <div className="text-white/80 text-sm">/ 990 điểm</div>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-2xl font-black text-blue-700">{totalCorrect}</p>
              <p className="text-xs text-gray-500 mt-1">Câu đúng</p>
              <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(totalCorrect / detailedAnswers.length) * 100}%` }} />
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-2xl font-black text-red-600">{totalWrong}</p>
              <p className="text-xs text-gray-500 mt-1">Câu sai</p>
              <div className="w-full bg-red-200 rounded-full h-1.5 mt-2">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${(totalWrong / detailedAnswers.length) * 100}%` }} />
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-2xl font-black text-gray-500">{totalUnanswered}</p>
              <p className="text-xs text-gray-500 mt-1">Bỏ qua</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: `${(totalUnanswered / detailedAnswers.length) * 100}%` }} />
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p className="text-2xl font-black text-green-700">{Math.round((totalCorrect / detailedAnswers.length) * 100)}%</p>
              <p className="text-xs text-gray-500 mt-1">Tỉ lệ đúng</p>
            </div>
          </div>

          {/* Listening / Reading */}
          <div className="px-6 pb-6 grid grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-green-800 text-sm">🎧 Listening</span>
                <span className="text-xl font-black text-green-700">{listeningScore}</span>
              </div>
              <p className="text-xs text-green-600">{listeningCorrect}/100 câu đúng</p>
              <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${listeningCorrect}%` }} />
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-purple-800 text-sm">📖 Reading</span>
                <span className="text-xl font-black text-purple-700">{readingScore}</span>
              </div>
              <p className="text-xs text-purple-600">{readingCorrect}/100 câu đúng</p>
              <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${readingCorrect}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* ===== PART SUMMARY ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-black text-gray-800 text-lg mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Thống kê theo Part
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {partNums.map((part) => {
              const stats = getPartStats(part);
              const correctRate = Math.round((stats.correct / stats.total) * 100);
              const color = correctRate >= 70 ? "border-green-300 bg-green-50" : correctRate >= 50 ? "border-yellow-300 bg-yellow-50" : "border-red-300 bg-red-50";
              const textColor = correctRate >= 70 ? "text-green-700" : correctRate >= 50 ? "text-yellow-700" : "text-red-600";
              return (
                <div key={part} className={`rounded-xl border-2 p-3 text-center ${color}`}>
                  <p className="font-black text-gray-700 text-sm">Part {part}</p>
                  <p className="text-xs text-gray-500 mb-2 truncate">{PART_INFO[part]?.name}</p>
                  <p className={`text-xl font-black ${textColor}`}>{correctRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.correct}/{stats.total} đúng</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== DETAIL PER QUESTION ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-black text-gray-800 text-lg mb-4">Chi tiết từng câu</h2>
            <div className="flex flex-wrap gap-3">
              {/* Filter by status */}
              <div className="flex rounded-xl overflow-hidden border border-gray-200 text-sm">
                {[
                  { key: "all", label: `Tất cả (${detailedAnswers.length})`, color: "bg-gray-700 text-white" },
                  { key: "correct", label: `✓ Đúng (${totalCorrect})`, color: "bg-green-500 text-white" },
                  { key: "wrong", label: `✗ Sai (${totalWrong})`, color: "bg-red-500 text-white" },
                  { key: "unanswered", label: `− Bỏ qua (${totalUnanswered})`, color: "bg-gray-400 text-white" },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className={`px-3 py-2 font-semibold transition-all ${activeFilter === f.key ? f.color : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Filter by part */}
              <select
                value={activePart}
                onChange={(e) => setActivePart(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="all">Tất cả Part</option>
                {partNums.map((p) => (
                  <option key={p} value={p}>Part {p} – {PART_INFO[p]?.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question grid */}
          <div className="p-6">
            {partNums
              .filter((p) => activePart === "all" || p === parseInt(activePart))
              .map((part) => {
                const partFiltered = filteredAnswers.filter((a) => a.part === part);
                if (partFiltered.length === 0) return null;
                const stats = getPartStats(part);

                return (
                  <div key={part} className="mb-8 last:mb-0">
                    {/* Part header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-px flex-1 bg-gray-200" />
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
                        <span className="font-black text-indigo-800 text-sm">Part {part}</span>
                        <span className="text-indigo-600 text-xs">– {PART_INFO[part]?.name}</span>
                        <span className="text-green-600 text-xs font-semibold">{stats.correct}/{stats.total} đúng</span>
                      </div>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Question cells */}
                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
                      {partFiltered.map((answer) => {
                        let cellStyle, icon;
                        if (!answer.userAnswer) {
                          // Bỏ qua
                          cellStyle = "bg-gray-100 border-gray-300 text-gray-500";
                          icon = <MinusCircle className="w-3 h-3 absolute -top-1 -right-1 text-gray-400 bg-white rounded-full" />;
                        } else if (answer.isCorrect) {
                          // Đúng
                          cellStyle = "bg-green-500 border-green-600 text-white shadow-sm";
                          icon = <CheckCircle2 className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-green-600 bg-white rounded-full shadow-sm" />;
                        } else {
                          // Sai
                          cellStyle = "bg-red-500 border-red-600 text-white shadow-sm";
                          icon = <XCircle className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-red-600 bg-white rounded-full shadow-sm" />;
                        }

                        return (
                          <div
                            key={answer.number}
                            className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-default select-none ${cellStyle}`}
                            title={
                              !answer.userAnswer
                                ? `Câu ${answer.number}: Bỏ qua`
                                : answer.isCorrect
                                ? `Câu ${answer.number}: Đúng ✓ (Bạn chọn ${answer.userAnswer})`
                                : `Câu ${answer.number}: Sai ✗ (Bạn chọn ${answer.userAnswer})`
                            }
                          >
                            <span className="text-xs font-black leading-none">{answer.number}</span>
                            {answer.userAnswer && (
                              <span className="text-xs font-bold opacity-90 leading-none mt-0.5">
                                {answer.userAnswer}
                              </span>
                            )}
                            {icon}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

            {filteredAnswers.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <MinusCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Không có câu nào phù hợp với bộ lọc</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-lg border-2 border-green-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span>Đúng (hiển thị lựa chọn bạn chọn)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-500 rounded-lg border-2 border-red-600 flex items-center justify-center text-white text-xs font-bold">B</div>
              <span>Sai (hiển thị lựa chọn bạn chọn)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-500 text-xs font-bold">−</div>
              <span>Không trả lời</span>
            </div>
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="flex justify-center gap-4 pb-8">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Làm lại bài test
          </button>
          <button
            onClick={onGoHome}
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Về trang lịch học
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const CourseEndTestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);

  const fromSchedule = location.state || {};
  const currentLevel = user?.level || fromSchedule.currentLevel || "beginner";

  const [questions, setQuestions] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(120 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Level result modal
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [levelResult, setLevelResult] = useState(null);

  // Detailed result
  const [showResultView, setShowResultView] = useState(false);
  const [detailedAnswers, setDetailedAnswers] = useState([]);

  const audioRef = useRef(null);
  const currentQ = questions[currentIndex];
  const currentPart = PART_INFO[currentQ?.part] || {};

  // Fetch questions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axiosInstance.get("/tests/ETS-2024-01/questions");
        let rawData = [];
        // axiosInstance interceptor tự unwrap .data, nên res = { message, result: [...] }
        const responseData = res;
        if (Array.isArray(responseData)) rawData = responseData;
        else if (responseData.result && Array.isArray(responseData.result)) rawData = responseData.result;
        else if (responseData.data && Array.isArray(responseData.data)) rawData = responseData.data;
        else if (responseData.questions && Array.isArray(responseData.questions)) rawData = responseData.questions;

        if (!Array.isArray(rawData) || rawData.length === 0) {
          throw new Error("Không tìm thấy câu hỏi nào. Vui lòng kiểm tra kết nối.");
        }

        const flattened = rawData.flatMap((section) => {
          if (!section.questions || !Array.isArray(section.questions)) return [];
          return section.questions.map((q, idx) => {
            const qExplain = q.explanation?.trim();
            const secExplain = section.explanation?.trim();
            const combinedExplanation = qExplain && secExplain ? `${qExplain}\n\n${secExplain}` : qExplain || secExplain || "";
            return {
              ...q,
              _id: `${section._id || section.id || "section"}-${q.number}`,
              part: section.part || 1,
              mediaUrl: section.mediaUrl || "",
              imageUrls: Array.isArray(section.imageUrl) ? section.imageUrl : section.imageUrls ? section.imageUrls : [],
              paragraph: section.paragraph || "",
              groupId: section._id || section.id || `group-${idx}`,
              groupIndex: idx,
              explanation: combinedExplanation,
            };
          });
        });

        if (flattened.length === 0) throw new Error("Không thể xử lý dữ liệu câu hỏi.");
        flattened.sort((a, b) => (a.number || 0) - (b.number || 0));
        setQuestions(flattened);

        const grouped = [];
        rawData.forEach((section) => {
          if (!section.questions || !Array.isArray(section.questions)) return;
          const sectionPart = section.part || 1;
          if (sectionPart < 3) {
            section.questions.forEach((q) => {
              const found = flattened.find((fq) => fq._id === `${section._id || section.id || "section"}-${q.number}`);
              if (found) grouped.push([found]);
            });
          } else {
            const group = flattened.filter((q) => q.groupId === (section._id || section.id));
            if (group.length) grouped.push(group);
          }
        });
        setGroups(grouped);
      } catch (err) {
        let errorMessage = "Không thể tải đề thi. ";
        if (err.response?.status === 401) errorMessage += "Phiên đăng nhập đã hết hạn.";
        else if (err.response?.status === 404) errorMessage += "Không tìm thấy đề thi này.";
        else errorMessage += err.message;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Timer (stop when result is shown)
  useEffect(() => {
    if (timeLeft <= 0 || showResultView) return;
    const timer = setInterval(() => setTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResultView]);

  // Audio autoplay
  useEffect(() => {
    if (audioRef.current && currentQ?.mediaUrl) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [currentIndex, currentQ?.mediaUrl]);

  const handleAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const handleFlag = (id) => setFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  const goToQuestion = (idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIndex(idx);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const numberToUserAnswer = new Map();
      questions.forEach((q) => {
        if (answers[q._id]) numberToUserAnswer.set(Number(q.number), answers[q._id]);
      });

      const res = await axiosInstance.get("/tests/ETS-2024-01/result");
      // axiosInstance interceptor tự unwrap response.data, nên res = { message, result: { correctAnswers: [...] } }
      const responseData = res;

      // API trả về: { result: { correctAnswers: [...] } }
      let sections = [];
      if (Array.isArray(responseData)) {
        sections = responseData;
      } else if (Array.isArray(responseData?.result?.correctAnswers)) {
        // ✅ Cấu trúc thực tế từ BE: { result: { correctAnswers: [...] } }
        sections = responseData.result.correctAnswers;
      } else if (Array.isArray(responseData?.result)) {
        sections = responseData.result;
      } else if (Array.isArray(responseData?.correctAnswers)) {
        sections = responseData.correctAnswers;
      } else if (Array.isArray(responseData?.data)) {
        sections = responseData.data;
      } else if (Array.isArray(responseData?.sections)) {
        sections = responseData.sections;
      }

      if (sections.length === 0) {
        console.error("[CourseEndTest] Could not parse result. responseData:", responseData);
      }

      let listeningCorrect = 0;
      let readingCorrect = 0;
      const computed = [];

      sections.forEach((section) => {
        const sectionType = section?.type || (section?.part && section.part <= 4 ? "listening" : "reading");
        const qs = Array.isArray(section?.questions) ? section.questions : [];
        qs.forEach((q) => {
          const userAnswer = numberToUserAnswer.get(q.number);
          const correctAnswer = q.answer;
          const isCorrect = userAnswer && correctAnswer && String(userAnswer).trim() === String(correctAnswer).trim();
          if (sectionType === "listening") { if (isCorrect) listeningCorrect += 1; }
          else { if (isCorrect) readingCorrect += 1; }
          const foundQ = questions.find((x) => x.number === q.number);
          computed.push({
            number: q.number,
            part: foundQ?.part || section?.part,
            type: sectionType,
            userAnswer: userAnswer || null,
            correctAnswer: correctAnswer || null, // stored internally but NOT shown in UI
            isCorrect: !!isCorrect,
            questionText: foundQ?.questionText || "",
            options: foundQ?.options || [],
            imageUrl: foundQ?.imageUrls || foundQ?.imageUrl || "",
            mediaUrl: foundQ?.mediaUrl || "",
            paragraph: foundQ?.paragraph || "",
            explanation: foundQ?.explanation || section?.explanation || "",
          });
        });
      });

      // Sort by question number
      computed.sort((a, b) => a.number - b.number);

      const listeningScore = score.calculateListeningScore(listeningCorrect);
      const readingScore = score.calculateReadingScore(readingCorrect);
      const totalScore = listeningScore + readingScore;
      const totalCorrect = listeningCorrect + readingCorrect;
      const newLevel = getLevelByScore(totalScore);
      const isLevelUp = newLevel !== currentLevel;

      // Save to server
      try {
        const postPayload = {
          answers: computed.map((ans) => ({
            questionNumber: ans.number,
            userAnswer: ans.userAnswer,
            isCorrect: ans.isCorrect,
            part: ans.part,
            questionText: ans.questionText,
            options: ans.options,
            imageUrl: ans.imageUrl,
            mediaUrl: ans.mediaUrl,
            paragraph: ans.paragraph,
            explanation: ans.explanation,
          })),
          mark: totalScore,
          rightAnswerNumber: totalCorrect,
        };
        await axiosInstance.post("/tests/ETS-2024-01", postPayload);
        const userRes = await axiosInstance.get("/users/me");
        if (userRes?.result) {
          dispatch(setCurrentUser({ user: userRes.result }));
        }
      } catch (dbErr) {
        console.error("Failed to save test:", dbErr);
      }

      // Store results
      setDetailedAnswers(computed);
      setLevelResult({
        totalScore, listeningScore, readingScore,
        listeningCorrect, readingCorrect,
        previousLevel: currentLevel, newLevel, isLevelUp,
      });
      setShowLevelModal(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể nộp bài. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close level modal → show result view
  const handleModalClose = () => {
    setShowLevelModal(false);
    setShowResultView(true);
    window.scrollTo({ top: 0 });
  };

  // Retry → reset everything
  const handleRetry = () => {
    setShowLevelModal(false);
    setShowResultView(false);
    setAnswers({});
    setFlags({});
    setCurrentIndex(0);
    setTimeLeft(120 * 60);
    setDetailedAnswers([]);
    setLevelResult(null);
    window.scrollTo({ top: 0 });
  };

  const handleGoHome = () => navigate("/my-schedule");

  // ==================== STATES ====================

  // Show result view (after modal closed)
  if (showResultView) {
    return (
      <ResultView
        levelResult={levelResult}
        detailedAnswers={detailedAnswers}
        onRetry={handleRetry}
        onGoHome={handleGoHome}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">📝</div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Đang tải đề thi cuối khóa...</h3>
          <p className="text-gray-500">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">Có lỗi xảy ra</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/my-schedule")} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium">Quay lại</button>
            <button onClick={() => window.location.reload()} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">Tải lại</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
          <p className="text-gray-600 text-lg mb-4">Không tìm thấy câu hỏi nào.</p>
          <button onClick={() => navigate("/my-schedule")} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl">Quay lại</button>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ===== LEVEL RESULT MODAL ===== */}
      <LevelResultModal
        isVisible={showLevelModal}
        onClose={handleModalClose}
        result={levelResult}
        onRetry={handleRetry}
      />

      {/* ===== HEADER ===== */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800 leading-tight">Bài Test Cuối Khóa</h1>
            <p className="text-xs text-gray-500">ETS 2024 Full Test 1 · 200 câu · 120 phút</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-gray-500">{answeredCount}/{questions.length}</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <button
            onClick={() => { if (window.confirm("Bạn có chắc muốn thoát? Dữ liệu sẽ không được lưu.")) navigate("/my-schedule"); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-medium text-sm transition-all"
          >
            <X className="w-4 h-4" />
            Thoát
          </button>
        </div>
      </div>

      {/* ===== PART TABS ===== */}
      <div className="bg-white border-b px-6 py-3 shadow-sm">
        <div className="flex flex-wrap gap-2 max-w-7xl mx-auto">
          {Object.entries(PART_INFO).map(([partNum, info]) => {
            const isActive = currentQ.part === parseInt(partNum);
            const questionsInPart = questions.filter((q) => q.part === parseInt(partNum));
            const answeredInPart = questionsInPart.filter((q) => answers[q._id]).length;
            const totalInPart = questionsInPart.length;
            if (totalInPart === 0) return null;
            return (
              <button
                key={partNum}
                onClick={() => {
                  const idx = questions.findIndex((q) => q.part === parseInt(partNum));
                  if (idx !== -1) goToQuestion(idx);
                }}
                className={`flex-1 min-w-[120px] px-3 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <div className="font-bold">Part {partNum}</div>
                <div className={`text-xs mt-0.5 ${isActive ? "text-yellow-100" : "text-gray-500"}`}>{info.name}</div>
                <div className={`text-xs mt-0.5 font-bold ${isActive ? "text-white" : answeredInPart === totalInPart ? "text-green-600" : "text-blue-600"}`}>
                  {answeredInPart}/{totalInPart}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-1">
        {/* Left: Question */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Part 1 & 2 */}
          {currentQ.part < 3 && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              {currentQ.paragraph && (
                <p className="mb-6 text-gray-700 whitespace-pre-wrap leading-relaxed bg-amber-50 border border-amber-200 rounded-xl p-4">
                  {currentQ.paragraph}
                </p>
              )}
              {currentQ.mediaUrl && (
                <audio ref={audioRef} controls className="mb-6 w-full rounded-xl">
                  <source src={currentQ.mediaUrl} type="audio/mpeg" />
                </audio>
              )}
              {currentPart.hasImage && currentQ.imageUrls?.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6 justify-center">
                  {currentQ.imageUrls.map((url, idx) => (
                    <img key={idx} src={url} alt={`q-img-${idx}`} className="border rounded-xl max-h-80 object-contain shadow-sm" loading="lazy" />
                  ))}
                </div>
              )}
              <p className="mb-6 font-bold text-xl text-gray-800">
                Câu {currentQ.number}: {currentQ.questionText || ""}
              </p>
              <div className="space-y-3">
                {currentQ.options?.map((opt, idx) => {
                  const optionLabel = String.fromCharCode(65 + idx);
                  const showFullText = currentQ.part >= 3;
                  const isSelected = answers[currentQ._id] === optionLabel;
                  return (
                    <label key={idx} className={`block border-2 rounded-xl px-5 py-4 cursor-pointer transition-all ${isSelected ? "bg-orange-50 border-orange-400 shadow-sm" : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"}`}>
                      <input type="radio" name={`q-${currentQ._id}`} checked={isSelected} onChange={() => handleAnswer(currentQ._id, optionLabel)} className="mr-3 w-4 h-4 accent-orange-500" />
                      <span className={`font-medium ${isSelected ? "text-orange-700" : "text-gray-700"}`}>{showFullText ? opt : optionLabel}</span>
                    </label>
                  );
                })}
              </div>
              <button
                onClick={() => handleFlag(currentQ._id)}
                className={`mt-6 px-5 py-2.5 flex items-center gap-2 rounded-xl font-medium text-sm transition-all ${flags[currentQ._id] ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"}`}
              >
                <Flag className="w-4 h-4" />
                {flags[currentQ._id] ? "Bỏ Flag" : "Đặt Flag"}
              </button>
            </div>
          )}

          {/* Part 3–7 */}
          {currentQ.part >= 3 &&
            groups
              .filter((grp) => grp[0]?.groupId === currentQ.groupId)
              .map((grp, gIdx) => (
                <div key={gIdx} className="border rounded-2xl p-8 mb-6 bg-white shadow-sm max-w-6xl mx-auto border-gray-100">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/2">
                      {grp[0]?.paragraph && (
                        <div className="mb-6 p-6 bg-amber-50 rounded-xl border border-amber-200">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{grp[0].paragraph}</p>
                        </div>
                      )}
                      {grp[0]?.imageUrls?.length > 0 && (
                        <div className="flex flex-wrap gap-4 mb-6 justify-center">
                          {grp[0].imageUrls.map((url, idx) => (
                            <img key={idx} src={url} alt={`grp-img-${idx}`} className="border rounded-xl max-h-[500px] object-contain shadow-sm" loading="lazy" />
                          ))}
                        </div>
                      )}
                      {grp[0]?.mediaUrl && (
                        <audio controls className="w-full mb-6 rounded-xl">
                          <source src={grp[0].mediaUrl} type="audio/mpeg" />
                        </audio>
                      )}
                    </div>
                    <div className="w-full lg:w-1/2 space-y-6">
                      {grp.map((q) => (
                        <div key={q._id} className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
                          <p className="font-bold text-lg mb-4 text-gray-800">Câu {q.number}: {q.questionText}</p>
                          <div className="space-y-2">
                            {q.options?.map((opt, i) => {
                              const optionLabel = String.fromCharCode(65 + i);
                              const isSelected = answers[q._id] === optionLabel;
                              return (
                                <label key={i} className={`block border-2 rounded-lg px-4 py-3 cursor-pointer transition-all ${isSelected ? "bg-orange-50 border-orange-400 shadow-sm" : "border-gray-200 hover:bg-white hover:border-gray-300 bg-white"}`}>
                                  <input type="radio" name={`q-${q._id}`} checked={isSelected} onChange={() => handleAnswer(q._id, optionLabel)} className="mr-3 w-4 h-4 accent-orange-500" />
                                  <span className={isSelected ? "text-orange-700 font-medium" : "text-gray-700"}>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => handleFlag(q._id)}
                            className={`mt-4 px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-medium transition-all ${flags[q._id] ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`}
                          >
                            <Flag className="w-4 h-4" />
                            {flags[q._id] ? "Bỏ Flag" : "Đặt Flag"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

          {/* Navigation */}
          <div className="flex justify-between mt-8 max-w-3xl mx-auto">
            <button
              onClick={() => goToQuestion(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
              Trước
            </button>
            <button
              onClick={() => goToQuestion(currentIndex + 1)}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium shadow-sm"
            >
              Tiếp
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===== RIGHT SIDEBAR ===== */}
        <div className="w-72 border-l bg-white shadow-lg">
          <div className="sticky top-0 p-5 h-screen overflow-y-auto">
            {/* Timer */}
            <div className={`mb-4 p-4 rounded-xl border ${timeLeft < 600 ? "bg-red-50 border-red-200" : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"}`}>
              <p className="font-semibold text-gray-700 text-sm mb-1">⏱ Thời gian còn lại</p>
              <p className={`text-3xl font-black ${timeLeft < 600 ? "text-red-600 animate-pulse" : "text-orange-600"}`}>
                {formatTime(timeLeft)}
              </p>
            </div>

            {/* Level */}
            <div className={`mb-4 p-3 rounded-xl border ${LEVEL_CONFIG[currentLevel]?.bg || "bg-gray-50"} ${LEVEL_CONFIG[currentLevel]?.border || "border-gray-200"}`}>
              <p className="text-xs text-gray-500 mb-1">Level hiện tại của bạn</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">{LEVEL_CONFIG[currentLevel]?.badge || "📚"}</span>
                <span className={`font-bold text-sm ${LEVEL_CONFIG[currentLevel]?.textColor || "text-gray-700"}`}>
                  {LEVEL_CONFIG[currentLevel]?.label || currentLevel}
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full mb-5 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${
                isSubmitting
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang chấm điểm...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  NỘP BÀI & XEM KẾT QUẢ
                </span>
              )}
            </button>

            {/* Question grid */}
            <div className="space-y-4">
              {Object.entries(PART_INFO).map(([partNum, info]) => {
                const partQuestions = questions.filter((q) => q.part === parseInt(partNum));
                if (partQuestions.length === 0) return null;
                return (
                  <div key={partNum} className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="font-bold text-gray-800 mb-2 text-xs">Part {partNum}: {info.name}</p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {partQuestions.map((q) => {
                        const globalIndex = questions.findIndex((x) => x._id === q._id);
                        const isAnswered = !!answers[q._id];
                        const isFlagged = !!flags[q._id];
                        const isCurrent = currentIndex === globalIndex;
                        return (
                          <button
                            key={q._id}
                            onClick={() => goToQuestion(globalIndex)}
                            className={`relative w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                              isAnswered
                                ? "bg-orange-400 text-white shadow-sm hover:bg-orange-500"
                                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400"
                            } ${isCurrent ? "ring-2 ring-orange-400 ring-offset-1 scale-110" : ""}`}
                          >
                            {q.number}
                            {isFlagged && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-400 rounded" /> Đã làm</div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white border-2 border-gray-300 rounded" /> Chưa làm</div>
              <div className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <div className="w-4 h-4 bg-gray-200 rounded" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </div>
                Đã flag
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEndTestPage;
