import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mic, Clock, ChevronRight, Lock, Sparkles, CheckCircle } from "lucide-react";
import { checkHasPurchase } from "@/api/paymentApi";


// ── Danh sách đề thi Speaking chuẩn ETS ─────────────────────────────────────
const SPEAKING_TESTS = [
  {
    id: "mock-speaking-01",
    title: "TOEIC Speaking — Practice Test 01",
    description:
      "Bài luyện tập chuẩn ETS đầy đủ 11 câu / 5 Parts. Từ đọc to đoạn văn, miêu tả tranh, trả lời câu hỏi theo thông tin cho đến bày tỏ quan điểm.",
    duration: 20,
    totalQuestions: 11,
    level: "Intermediate",
    badge: "🗣️",
    parts: [
      { label: "Part 1: Read Aloud", qs: "Q1–Q2", free: true },
      { label: "Part 2: Describe Picture", qs: "Q3", free: false },
      { label: "Part 3: Respond to Qs", qs: "Q4–Q6", free: false },
      { label: "Part 4: Using Information", qs: "Q7–Q9", free: false },
      { label: "Part 5: Express Opinion", qs: "Q10–Q11", free: false },
    ],
  },
  {
    id: "mock-speaking-02",
    title: "TOEIC Speaking — Practice Test 02",
    description:
      "Bài luyện nói nâng cao với các đoạn văn dài hơn và tình huống phức tạp hơn, lý tưởng để ôn tập trước kỳ thi thật.",
    duration: 20,
    totalQuestions: 11,
    level: "Advanced",
    badge: "🎙️",
    parts: [
      { label: "Part 1: Read Aloud", qs: "Q1–Q2", free: true },
      { label: "Part 2: Describe Picture", qs: "Q3", free: false },
      { label: "Part 3: Respond to Qs", qs: "Q4–Q6", free: false },
      { label: "Part 4: Using Information", qs: "Q7–Q9", free: false },
      { label: "Part 5: Express Opinion", qs: "Q10–Q11", free: false },
    ],
  },
];

const levelStyle = {
  Beginner:     { bg: "#dcfce7", color: "#15803d" },
  Intermediate: { bg: "#dbeafe", color: "#1d4ed8" },
  Advanced:     { bg: "#ede9fe", color: "#6d28d9" },
};

const SpeakingTestSelect = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);
  const [hasPurchase, setHasPurchase] = useState(false);

  // Admin/Instructor luôn mở khoá. Guest cần kiểm tra payment status=completed từ DB
  const isAdminOrInstructor =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "instructor");

  // isPaidUser = admin/instructor HOẶC đã có ít nhất 1 payment completed
  const isPaidUser = isAdminOrInstructor || hasPurchase;

  useEffect(() => {
    // Nếu đã là admin/instructor → không cần gọi API
    if (!currentUser || isAdminOrInstructor) return;

    const fetchPurchaseStatus = async () => {
      try {
        const result = await checkHasPurchase();
        setHasPurchase(result?.hasPurchase === true);
      } catch {
        setHasPurchase(false);
      }
    };
    fetchPurchaseStatus();
  }, [currentUser]);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

        .sps-root { font-family: 'Sora', sans-serif; min-height: 100vh; background: #f8f9fe; padding: 2.5rem 1rem 4rem; }
        .sps-inner { max-width: 860px; margin: 0 auto; }

        /* ── Header ── */
        .sps-header { display: flex; align-items: center; gap: 1.1rem; margin-bottom: 2.5rem; }
        .sps-header-icon { width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, #f43f5e, #e11d48); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(244,63,94,0.3); flex-shrink: 0; }
        .sps-header-icon svg { color: #fff; }
        .sps-header-title { font-size: 1.85rem; font-weight: 700; color: #111827; margin: 0; line-height: 1.2; }
        .sps-header-sub { font-size: 0.88rem; color: #6b7280; margin-top: 0.2rem; }

        /* ── ETS Info Banner ── */
        .sps-banner { background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius: 14px; padding: 1.1rem 1.4rem; margin-bottom: 1.75rem; display: flex; align-items: center; gap: 1rem; }
        .sps-banner-text { font-size: 0.83rem; color: #c7d2fe; line-height: 1.6; }
        .sps-banner-text strong { color: #fff; }
        .sps-banner-badge { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 0.4rem 0.8rem; font-size: 0.78rem; font-weight: 600; color: #e0e7ff; white-space: nowrap; }

        /* ── Free user notice ── */
        .sps-free-notice { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 10px; padding: 0.75rem 1rem; margin-bottom: 1.5rem; font-size: 0.82rem; color: #92400e; display: flex; align-items: center; gap: 0.6rem; }

        /* ── Test Cards ── */
        .sps-card { background: #fff; border-radius: 18px; border: 1px solid #e5e7eb; padding: 1.75rem; margin-bottom: 1.25rem; transition: all 0.22s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .sps-card:hover { border-color: #fda4af; box-shadow: 0 8px 28px rgba(244,63,94,0.1); transform: translateY(-2px); }
        .sps-card-top { display: flex; flex-direction: column; gap: 1.1rem; }
        @media (min-width: 640px) { .sps-card-top { flex-direction: row; align-items: flex-start; justify-content: space-between; } }

        .sps-card-left { flex: 1; }
        .sps-card-title-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem; }
        .sps-card-emoji { font-size: 1.4rem; }
        .sps-card-title { font-size: 1.1rem; font-weight: 700; color: #111827; }
        .sps-level-badge { font-size: 0.7rem; font-weight: 600; padding: 0.2rem 0.65rem; border-radius: 99px; }
        .sps-desc { font-size: 0.84rem; color: #6b7280; line-height: 1.6; margin-bottom: 1rem; }

        /* ── Meta row ── */
        .sps-meta { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.8rem; color: #6b7280; margin-bottom: 1.1rem; }
        .sps-meta-item { display: flex; align-items: center; gap: 0.35rem; }
        .sps-meta-item svg { color: #f43f5e; }

        /* ── Parts breakdown ── */
        .sps-parts { display: flex; flex-wrap: wrap; gap: 0.45rem; }
        .sps-part-chip { display: flex; align-items: center; gap: 0.35rem; font-size: 0.72rem; font-weight: 500; padding: 0.28rem 0.7rem; border-radius: 99px; border: 1px solid; }
        .sps-part-chip.free { background: #f0fdf4; border-color: #86efac; color: #15803d; }
        .sps-part-chip.premium { background: #fdf2f8; border-color: #f9a8d4; color: #be185d; }

        /* ── Action area ── */
        .sps-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.75rem; flex-shrink: 0; }
        .sps-start-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.8rem; background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; border: none; border-radius: 12px; font-family: 'Sora', sans-serif; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 14px rgba(244,63,94,0.3); white-space: nowrap; }
        .sps-start-btn:hover { opacity: 0.92; transform: scale(1.03); box-shadow: 0 6px 20px rgba(244,63,94,0.4); }
        .sps-free-hint { font-size: 0.7rem; color: #9ca3af; text-align: right; }

        /* ── CTA bottom ── */
        .sps-cta { margin-top: 2rem; background: linear-gradient(135deg, #1f2937, #111827); border-radius: 16px; padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1rem; }
        @media (min-width: 640px) { .sps-cta { flex-direction: row; align-items: center; justify-content: space-between; } }
        .sps-cta-text h3 { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 0.3rem; }
        .sps-cta-text p { font-size: 0.82rem; color: #9ca3af; margin: 0; }
        .sps-cta-btn { padding: 0.7rem 1.6rem; background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; border: none; border-radius: 10px; font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
        .sps-cta-btn:hover { opacity: 0.9; }
      `}</style>

      <div className="sps-root">
        <div className="sps-inner">

          {/* ── Header ── */}
          <div className="sps-header">
            <div className="sps-header-icon">
              <Mic size={24} />
            </div>
            <div>
              <h1 className="sps-header-title">Luyện Nói TOEIC Speaking</h1>
              <p className="sps-header-sub">
                Chấm điểm phát âm tức thời · Chuẩn ETS · Lưu lịch sử tự động
              </p>
            </div>
          </div>

          {/* ── ETS Structure Banner ── */}
          <div className="sps-banner">
            <div className="sps-banner-text">
              <strong>Cấu trúc chuẩn ETS:</strong> 11 câu hỏi, 5 Parts — Part 1 (Read Aloud) · Part 2 (Describe Picture) ·
              Part 3 (Respond to Questions) · Part 4 (Using Information) · Part 5 (Express Opinion).
              Hệ thống chấm điểm phát âm bằng thuật toán LCS miễn phí, không cần API trả phí.
            </div>
            <div className="sps-banner-badge">🎯 11 Câu / 5 Parts</div>
          </div>

          {/* ── Free user notice ── */}
          {!isPaidUser && (
            <div className="sps-free-notice">
              <Lock size={14} />
              <span>
                <strong>Tài khoản Free:</strong> Bạn có thể luyện thử <strong>Part 1 (Q1–Q2)</strong> miễn phí.
                Đăng ký khóa học để mở khóa toàn bộ 11 câu và lưu lịch sử luyện nói.
              </span>
            </div>
          )}

          {/* ── Test Cards ── */}
          <div>
            {SPEAKING_TESTS.map((test) => {
              const lvStyle = levelStyle[test.level] || { bg: "#f3f4f6", color: "#374151" };
              return (
                <div key={test.id} className="sps-card">
                  <div className="sps-card-top">
                    {/* Left */}
                    <div className="sps-card-left">
                      <div className="sps-card-title-row">
                        <span className="sps-card-emoji">{test.badge}</span>
                        <span className="sps-card-title">{test.title}</span>
                        <span
                          className="sps-level-badge"
                          style={{ background: lvStyle.bg, color: lvStyle.color }}
                        >
                          {test.level}
                        </span>
                      </div>

                      <p className="sps-desc">{test.description}</p>

                      {/* Meta */}
                      <div className="sps-meta">
                        <span className="sps-meta-item">
                          <Clock size={13} /> {test.duration} phút
                        </span>
                        <span className="sps-meta-item">
                          <Mic size={13} /> {test.totalQuestions} câu hỏi
                        </span>
                        <span className="sps-meta-item" style={{ color: "#10b981" }}>
                          <Sparkles size={13} color="#10b981" /> Chấm phát âm miễn phí (LCS)
                        </span>
                        {isPaidUser && (
                          <span className="sps-meta-item" style={{ color: "#6366f1" }}>
                            <CheckCircle size={13} color="#6366f1" /> Lịch sử được lưu trên MongoDB
                          </span>
                        )}
                      </div>

                      {/* Parts chips */}
                      <div className="sps-parts">
                        {test.parts.map((p) => (
                          <span
                            key={p.label}
                            className={`sps-part-chip ${p.free || isPaidUser ? "free" : "premium"}`}
                          >
                            {!p.free && !isPaidUser && <Lock size={9} />}
                            {p.free || isPaidUser ? <CheckCircle size={9} /> : null}
                            {p.label} ({p.qs})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right — Start Button */}
                    <div className="sps-card-right">
                      <button
                        className="sps-start-btn"
                        onClick={() => navigate(`/toeic-home/speaking-test/${test.id}`)}
                      >
                        Bắt đầu nói <ChevronRight size={16} />
                      </button>
                      {!isPaidUser && (
                        <p className="sps-free-hint">
                          Free: chỉ Part 1 (Q1–Q2)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Upgrade CTA (chỉ hiện với free user) ── */}
          {!isPaidUser && (
            <div className="sps-cta">
              <div className="sps-cta-text">
                <h3>🔓 Mở khóa toàn bộ 5 Parts · 11 Câu hỏi</h3>
                <p>Đăng ký bất kỳ khóa học nào để luyện đầy đủ và lưu lịch sử tự động.</p>
              </div>
              <button
                className="sps-cta-btn"
                onClick={() => navigate("/toeic-home/all-course")}
              >
                Xem khóa học →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default SpeakingTestSelect;
