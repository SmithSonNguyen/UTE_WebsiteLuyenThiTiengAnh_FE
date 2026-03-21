import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Mock image data ────────────────────────────────────────────────────────────
const IMAGES = [
  "https://s4-media1.study4.com/media/toeic_sw_tests/writing/image17.png",
  "https://s4-media1.study4.com/media/toeic_sw_tests/writing/image3.png",
  "https://s4-media1.study4.com/media/toeic_sw_tests/writing/image19.png",
  "https://s4-media1.study4.com/media/toeic_sw_tests/writing/image41.png",
  "https://s4-media1.study4.com/media/toeic_sw_tests/writing/image24.png",
];

const TOTAL_TIME = 60 * 60;

// ── Helpers ────────────────────────────────────────────────────────────────────
function countWords(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const parts = [
  { id: "part1", label: "Questions 1–5", range: [1, 5] },
  { id: "part2", label: "Questions 6–7", range: [6, 7] },
  { id: "part3", label: "Question 8", range: [8, 8] },
];

// ── Groq config (same pattern as VocabTranslator) ─────────────────────────────
const GROQ_CONFIG = {
  key: import.meta.env.VITE_GROQ_KEY,
  url: import.meta.env.VITE_GROQ_URL,
  model: "llama-3.3-70b-versatile",
};

// ── AI Grading ─────────────────────────────────────────────────────────────────
async function gradeWithAI(answers) {
  const answerSummary = Object.entries(answers)
    .map(([qid, text]) => {
      const label =
        parseInt(qid) <= 5
          ? `Câu ${qid} (Part 1 – Viết câu theo ảnh)`
          : parseInt(qid) <= 7
            ? `Câu ${qid} (Part 2 – Phản hồi email)`
            : `Câu ${qid} (Part 3 – Viết luận)`;
      return `${label}:\n"${text || "(Bỏ trống)"}"`;
    })
    .join("\n\n");

  const prompt = `Bạn là giáo viên TOEIC Writing chuyên nghiệp. Hãy phân tích và nhận xét bài làm sau đây.

BÀI LÀM CỦA HỌC VIÊN:
${answerSummary}

Hãy trả lời theo đúng cấu trúc JSON sau (chỉ JSON, không thêm gì khác):
{
  "overallFeedback": "<nhận xét tổng quan về bài làm (2-3 câu)>",
  "questionFeedbacks": [
    {
      "questionNumber": <số câu>,
      "strengths": "<điểm mạnh (1 câu)>",
      "weaknesses": "<điểm yếu / lỗi sai (1-2 câu)>",
      "suggestion": "<gợi ý cải thiện (1 câu)>"
    }
  ]
}`;

  const response = await fetch(GROQ_CONFIG.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_CONFIG.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_CONFIG.model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Lỗi HTTP ${response.status}`);
  }

  const data = await response.json();
  const raw = data.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Không nhận được phản hồi từ AI");
  return JSON.parse(
    raw
      .replace(/^```[\w]*\n?/g, "")
      .replace(/```$/g, "")
      .trim(),
  );
}

// ── Main component ──────────────────────────────────────────────────────────────
export default function TOEICWritingTest() {
  const navigate = useNavigate();
  const [activePart, setActivePart] = useState("part1");
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState({});
  const [openNotes, setOpenNotes] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitted, setSubmitted] = useState(false);
  const [marked, setMarked] = useState({});

  // AI grading states
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState(null);
  const [gradingError, setGradingError] = useState(null);
  const [showGrading, setShowGrading] = useState(false);

  // Timer
  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  const setAnswer = (qid, val) => setAnswers((a) => ({ ...a, [qid]: val }));
  const setNote = (qid, val) => setNotes((n) => ({ ...n, [qid]: val }));
  const toggleNote = (qid) => setOpenNotes((o) => ({ ...o, [qid]: !o[qid] }));
  const toggleMark = (qid) => setMarked((m) => ({ ...m, [qid]: !m[qid] }));

  const scrollToQuestion = (qid) => {
    const part = qid <= 5 ? "part1" : qid <= 7 ? "part2" : "part3";
    setActivePart(part);
    setTimeout(() => {
      const el = document.getElementById(`q-${qid}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  // ── Submit + AI grading ──
  const handleSubmit = async () => {
    setSubmitted(true);
    setIsGrading(true);
    setGradingError(null);
    setShowGrading(true);
    try {
      const result = await gradeWithAI(answers);
      setGradingResult(result);
    } catch (err) {
      setGradingError("Lỗi chấm điểm AI: " + err.message);
    } finally {
      setIsGrading(false);
    }
  };

  const timePercent = (timeLeft / TOTAL_TIME) * 100;
  const timerColor =
    timeLeft < 300 ? "#ef4444" : timeLeft < 600 ? "#f59e0b" : "#6366f1";

  // ── Shared answer block ──
  const AnswerBlock = ({ qid, minH = 180 }) => {
    const wc = countWords(answers[qid] || "");
    return (
      <div className="tw-card-answer">
        <button className="tw-note-toggle" onClick={() => toggleNote(qid)}>
          {openNotes[qid] ? "▲ Ẩn ghi chú" : "+ Thêm ghi chú / dàn ý"}
        </button>
        {openNotes[qid] && (
          <textarea
            className="tw-note-input"
            placeholder="Thêm ghi chú tại đây..."
            value={notes[qid] || ""}
            onChange={(e) => setNote(qid, e.target.value)}
          />
        )}
        <textarea
          className="tw-answer-input"
          style={{ minHeight: minH }}
          placeholder="Viết câu trả lời tại đây..."
          value={answers[qid] || ""}
          onChange={(e) => setAnswer(qid, e.target.value)}
          disabled={submitted}
        />
        <div className={`tw-wordcount ${wc > 0 ? "has-words" : ""}`}>
          Word count: {wc}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .tw-root { font-family: 'Sora', sans-serif; background: #0d0f14; color: #e2e4ef; min-height: 100vh; display: flex; flex-direction: column; }
        .tw-topbar { background: #13151d; border-bottom: 1px solid #1e2130; padding: 0 2rem; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .tw-logo { font-size: 1.1rem; font-weight: 700; letter-spacing: -0.02em; color: #fff; }
        .tw-logo span { color: #6366f1; }
        .tw-timer { display: flex; align-items: center; gap: 0.75rem; background: #1a1d2a; padding: 0.4rem 1rem; border-radius: 8px; border: 1px solid #252840; }
        .tw-timer-bar { width: 80px; height: 4px; background: #252840; border-radius: 2px; overflow: hidden; }
        .tw-timer-bar-fill { height: 100%; border-radius: 2px; transition: width 1s linear, background-color 1s; }
        .tw-timer-label { font-family: 'JetBrains Mono', monospace; font-size: 0.95rem; font-weight: 500; }
        .tw-parts { display: flex; gap: 0.5rem; padding: 1.25rem 2rem 0; border-bottom: 1px solid #1e2130; background: #10121a; }
        .tw-part-btn { padding: 0.6rem 1.2rem; border-radius: 8px 8px 0 0; border: 1px solid transparent; border-bottom: none; cursor: pointer; font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 500; background: transparent; color: #7c7f99; transition: all 0.18s; position: relative; bottom: -1px; }
        .tw-part-btn:hover { color: #a5a8c8; background: #181b28; }
        .tw-part-btn.active { background: #13151d; color: #a5b4fc; border-color: #1e2130; border-bottom-color: #13151d; }
        .tw-layout { display: flex; flex: 1; gap: 0; }
        .tw-content { flex: 1; padding: 2rem; overflow-y: auto; max-height: calc(100vh - 113px); }
        .tw-sidebar { width: 200px; min-width: 200px; background: #10121a; border-left: 1px solid #1e2130; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; max-height: calc(100vh - 113px); position: sticky; top: 61px; }
        .tw-submit-btn { width: 100%; padding: 0.7rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 600; letter-spacing: 0.05em; cursor: pointer; transition: opacity 0.18s, transform 0.15s; }
        .tw-submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .tw-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .tw-qlist-section h6 { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; color: #5c5f7a; text-transform: uppercase; margin-bottom: 0.6rem; }
        .tw-qlist-grid { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tw-qlist-item { width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 600; cursor: pointer; border: 1px solid #252840; background: #1a1d2a; color: #7c7f99; transition: all 0.15s; position: relative; }
        .tw-qlist-item:hover { border-color: #6366f1; color: #a5b4fc; }
        .tw-qlist-item.answered { background: #1e2250; border-color: #6366f1; color: #a5b4fc; }
        .tw-qlist-item.marked::after { content: ''; position: absolute; top: 3px; right: 3px; width: 5px; height: 5px; background: #f59e0b; border-radius: 50%; }
        .tw-question-card { background: #13151d; border: 1px solid #1e2130; border-radius: 14px; margin-bottom: 2rem; overflow: hidden; animation: fadeUp 0.25s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .tw-card-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-bottom: 1px solid #1e2130; background: #0f1118; }
        .tw-qnum { width: 30px; height: 30px; border-radius: 8px; background: #1e2250; border: 1px solid #6366f1; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #a5b4fc; cursor: pointer; flex-shrink: 0; transition: background 0.15s; }
        .tw-qnum:hover { background: #2a2f70; }
        .tw-qnum.marked { background: #2d2400; border-color: #f59e0b; color: #fbbf24; }
        .tw-card-label { font-size: 0.75rem; font-weight: 500; color: #5c5f7a; text-transform: uppercase; letter-spacing: 0.07em; }
        .tw-card-body { display: flex; flex-direction: column; gap: 0; }
        @media (min-width: 768px) { .tw-card-body { flex-direction: row; } }
        .tw-card-context { padding: 1.25rem; flex: 1; border-right: 1px solid #1e2130; }
        .tw-card-context img { max-width: 100%; border-radius: 8px; display: block; }
        .tw-email-box { background: #0d0f14; border: 1px solid #1e2130; border-radius: 10px; padding: 1rem 1.25rem; font-size: 0.82rem; line-height: 1.7; color: #c8cae0; }
        .tw-email-box .field { display: flex; gap: 0.5rem; margin-bottom: 0.2rem; }
        .tw-email-box .field-label { color: #6366f1; font-weight: 600; min-width: 60px; }
        .tw-email-body { margin-top: 0.75rem; color: #a5a8c4; }
        .tw-email-directions { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #1e2130; color: #f59e0b; font-style: italic; font-size: 0.78rem; }
        .tw-essay-prompt { font-size: 0.92rem; line-height: 1.7; color: #c8cae0; }
        .tw-card-answer { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
        .tw-note-toggle { background: transparent; border: 1px dashed #252840; border-radius: 6px; padding: 0.35rem 0.75rem; font-family: 'Sora', sans-serif; font-size: 0.75rem; color: #5c5f7a; cursor: pointer; transition: all 0.15s; align-self: flex-start; }
        .tw-note-toggle:hover { border-color: #6366f1; color: #a5b4fc; }
        .tw-note-input { width: 100%; background: #0d0f14; border: 1px dashed #252840; border-radius: 8px; padding: 0.75rem; font-family: 'Sora', sans-serif; font-size: 0.78rem; color: #9ca3c4; resize: vertical; min-height: 70px; transition: border-color 0.15s; outline: none; }
        .tw-note-input:focus { border-color: #6366f1; }
        .tw-answer-input { width: 100%; background: #0d0f14; border: 1px solid #1e2130; border-radius: 10px; padding: 1rem; font-family: 'Sora', sans-serif; font-size: 0.88rem; color: #e2e4ef; resize: vertical; min-height: 180px; transition: border-color 0.2s, box-shadow 0.2s; outline: none; line-height: 1.7; }
        .tw-answer-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .tw-answer-input:disabled { opacity: 0.7; cursor: not-allowed; }
        .tw-wordcount { font-size: 0.72rem; color: #5c5f7a; font-family: 'JetBrains Mono', monospace; text-align: right; }
        .tw-wordcount.has-words { color: #6366f1; }
      `}</style>

      <div className="tw-root">
        {/* Topbar */}
        <div className="tw-topbar">
          <div className="tw-logo">
            TOEIC <span>Writing</span>
          </div>
          <div className="tw-timer">
            <div className="tw-timer-bar">
              <div
                className="tw-timer-bar-fill"
                style={{ width: `${timePercent}%`, background: timerColor }}
              />
            </div>
            <span className="tw-timer-label" style={{ color: timerColor }}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Part tabs */}
        <div className="tw-parts">
          {parts.map((p) => (
            <button
              key={p.id}
              className={`tw-part-btn ${activePart === p.id ? "active" : ""}`}
              onClick={() => setActivePart(p.id)}
            >
              {p.label}
            </button>
          ))}
          {submitted && (
            <button
              className={`tw-part-btn ${showGrading && activePart === "__grading" ? "active" : ""}`}
              style={{ color: "#34d399", borderColor: "#34d39966" }}
              onClick={() => {
                setActivePart("__grading");
                setShowGrading(true);
              }}
            >
              🤖 Kết quả AI
            </button>
          )}
        </div>

        <div className="tw-layout">
          {/* Main content */}
          <div className="tw-content">
            {/* ── AI GRADING PANEL ── */}
            {activePart === "__grading" && (
              <div style={{ animation: "fadeUp 0.3s ease" }}>
                {isGrading && (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "4rem 2rem",
                      color: "#a5b4fc",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                      🤖
                    </div>
                    <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                      AI đang chấm bài...
                    </p>
                    <p
                      style={{
                        color: "#5c5f7a",
                        fontSize: "0.85rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      Điều này có thể mất vài giây
                    </p>
                  </div>
                )}
                {gradingError && (
                  <div
                    style={{
                      background: "#1e0a0a",
                      border: "1px solid #7f1d1d",
                      borderRadius: 12,
                      padding: "1.5rem",
                      color: "#fca5a5",
                      marginBottom: "1.5rem",
                    }}
                  >
                    ⚠️ {gradingError}
                  </div>
                )}
                {gradingResult && !isGrading && (
                  <div style={{ maxWidth: 760, margin: "0 auto" }}>
                    {/* Overall feedback */}
                    <div
                      style={{
                        background: "linear-gradient(135deg, #1e2250, #1a1d2a)",
                        border: "1px solid #6366f1",
                        borderRadius: 16,
                        padding: "1.75rem 2rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#6366f1",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Nhận xét tổng quan
                      </div>
                      <p
                        style={{
                          color: "#c8cae0",
                          fontSize: "0.92rem",
                          lineHeight: 1.7,
                        }}
                      >
                        {gradingResult.overallFeedback}
                      </p>
                    </div>

                    {/* Per-question feedbacks */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      {gradingResult.questionFeedbacks?.map((fb) => (
                        <div
                          key={fb.questionNumber}
                          style={{
                            background: "#13151d",
                            border: "1px solid #1e2130",
                            borderRadius: 12,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                              padding: "0.875rem 1.25rem",
                              borderBottom: "1px solid #1e2130",
                              background: "#0f1118",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: "#1e2250",
                                border: "1px solid #6366f1",
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                color: "#a5b4fc",
                                flexShrink: 0,
                              }}
                            >
                              {fb.questionNumber}
                            </div>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: "#5c5f7a",
                                textTransform: "uppercase",
                                letterSpacing: "0.07em",
                              }}
                            >
                              Câu {fb.questionNumber}
                            </span>
                          </div>
                          <div
                            style={{
                              padding: "1rem 1.25rem",
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.6rem",
                            }}
                          >
                            {fb.strengths && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  alignItems: "flex-start",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#34d399",
                                    flexShrink: 0,
                                    marginTop: 2,
                                  }}
                                >
                                  ✓
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "#9ca3c4",
                                  }}
                                >
                                  {fb.strengths}
                                </span>
                              </div>
                            )}
                            {fb.weaknesses && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  alignItems: "flex-start",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#f87171",
                                    flexShrink: 0,
                                    marginTop: 2,
                                  }}
                                >
                                  ✗
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.85rem",
                                    color: "#9ca3c4",
                                  }}
                                >
                                  {fb.weaknesses}
                                </span>
                              </div>
                            )}
                            {fb.suggestion && (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  alignItems: "flex-start",
                                  padding: "0.5rem 0.75rem",
                                  background: "#1a1d2a",
                                  borderRadius: 8,
                                }}
                              >
                                <span
                                  style={{ color: "#f59e0b", flexShrink: 0 }}
                                >
                                  💡
                                </span>
                                <span
                                  style={{
                                    fontSize: "0.82rem",
                                    color: "#a5a8c4",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {fb.suggestion}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Back button */}
                    <div
                      style={{
                        marginTop: "2rem",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => navigate(-1)}
                        style={{
                          padding: "0.7rem 2rem",
                          background: "transparent",
                          border: "1px solid #252840",
                          borderRadius: 8,
                          color: "#7c7f99",
                          cursor: "pointer",
                          fontFamily: "'Sora', sans-serif",
                          fontSize: "0.85rem",
                        }}
                      >
                        ← Quay lại danh sách đề
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PART 1 ── */}
            {activePart === "part1" &&
              IMAGES.map((src, i) => {
                const qid = i + 1;
                return (
                  <div className="tw-question-card" key={qid} id={`q-${qid}`}>
                    <div className="tw-card-header">
                      <div
                        className={`tw-qnum ${marked[qid] ? "marked" : ""}`}
                        onClick={() => toggleMark(qid)}
                        title="Click để đánh dấu"
                      >
                        {qid}
                      </div>
                      <span className="tw-card-label">
                        Write a sentence based on a picture
                      </span>
                    </div>
                    <div className="tw-card-body">
                      <div className="tw-card-context">
                        <img src={src} alt={`Question ${qid}`} />
                      </div>
                      <AnswerBlock qid={qid} />
                    </div>
                  </div>
                );
              })}

            {/* ── PART 2 ── */}
            {activePart === "part2" && (
              <>
                {/* Q6 */}
                <div className="tw-question-card" id="q-6">
                  <div className="tw-card-header">
                    <div
                      className={`tw-qnum ${marked[6] ? "marked" : ""}`}
                      onClick={() => toggleMark(6)}
                    >
                      6
                    </div>
                    <span className="tw-card-label">Respond to an email</span>
                  </div>
                  <div className="tw-card-body">
                    <div className="tw-card-context">
                      <div className="tw-email-box">
                        <div className="field">
                          <span className="field-label">From:</span>
                          <span>update@dailyjobseeker.com</span>
                        </div>
                        <div className="field">
                          <span className="field-label">To:</span>
                          <span>Anna Billings</span>
                        </div>
                        <div className="field">
                          <span className="field-label">Subject:</span>
                          <span>Daily Jobseeker update</span>
                        </div>
                        <div className="field">
                          <span className="field-label">Sent:</span>
                          <span>March 14, 20—</span>
                        </div>
                        <div className="tw-email-body">
                          <p style={{ marginBottom: "0.5rem" }}>
                            Dear Daily Jobseeker subscriber,
                          </p>
                          <p>
                            Marleyhome Inc. is looking for an experienced
                            accountant to fill a vacancy in its Accounting
                            Department. The company needs someone with an
                            accounting degree and at least three years of
                            experience. Contact Ralph Kramer,
                            r_kramer@marleyhome.com.
                          </p>
                        </div>
                        <div className="tw-email-directions">
                          Directions: Respond to the e-mail as if you are
                          interested in applying for the position. Make ONE
                          statement about your professional background and TWO
                          requests for information about the job.
                        </div>
                      </div>
                    </div>
                    <AnswerBlock qid={6} />
                  </div>
                </div>

                {/* Q7 */}
                <div className="tw-question-card" id="q-7">
                  <div className="tw-card-header">
                    <div
                      className={`tw-qnum ${marked[7] ? "marked" : ""}`}
                      onClick={() => toggleMark(7)}
                    >
                      7
                    </div>
                    <span className="tw-card-label">Respond to an email</span>
                  </div>
                  <div className="tw-card-body">
                    <div className="tw-card-context">
                      <div className="tw-email-box">
                        <div className="field">
                          <span className="field-label">From:</span>
                          <span>Elisa Hays, Front Desk Supervisor</span>
                        </div>
                        <div className="field">
                          <span className="field-label">To:</span>
                          <span>Front desk agents, Hotel Mediterraneo</span>
                        </div>
                        <div className="field">
                          <span className="field-label">Subject:</span>
                          <span>Reservation system</span>
                        </div>
                        <div className="field">
                          <span className="field-label">Sent:</span>
                          <span>December 1, 20—</span>
                        </div>
                        <div className="tw-email-body">
                          <p>
                            It has come to my attention that several of you have
                            experienced problems with the reservation system
                            recently. Please send me a complete list of the
                            issues that each of you have encountered.
                          </p>
                          <p style={{ marginTop: "0.75rem" }}>
                            Sincerely,
                            <br />
                            Elisa Hays
                            <br />
                            Front Desk Supervisor
                          </p>
                        </div>
                        <div className="tw-email-directions">
                          Directions: Respond to the e-mail as if you are a
                          front desk agent at Hotel Mediterraneo. In your
                          e-mail, describe THREE problems with the reservation
                          system.
                        </div>
                      </div>
                    </div>
                    <AnswerBlock qid={7} />
                  </div>
                </div>
              </>
            )}

            {/* ── PART 3 ── */}
            {activePart === "part3" && (
              <div className="tw-question-card" id="q-8">
                <div className="tw-card-header">
                  <div
                    className={`tw-qnum ${marked[8] ? "marked" : ""}`}
                    onClick={() => toggleMark(8)}
                  >
                    8
                  </div>
                  <span className="tw-card-label">Write an opinion essay</span>
                </div>
                <div className="tw-card-body">
                  <div className="tw-card-context">
                    <p className="tw-essay-prompt">
                      Many people enjoy spending time playing and watching
                      sports. Why do you think sports are important to people?
                      Give specific reasons and examples to support your
                      opinion.
                    </p>
                  </div>
                  <AnswerBlock qid={8} minH={280} />
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="tw-sidebar">
            <button
              className="tw-submit-btn"
              onClick={handleSubmit}
              disabled={submitted}
            >
              {submitted ? "Đã nộp ✓" : "NỘP BÀI"}
            </button>

            {submitted && (
              <button
                onClick={() => {
                  setActivePart("__grading");
                  setShowGrading(true);
                }}
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  background: "linear-gradient(135deg, #065f46, #064e3b)",
                  color: "#34d399",
                  border: "1px solid #059669",
                  borderRadius: 8,
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {isGrading ? "⏳ Đang chấm..." : "🤖 Xem AI chấm bài"}
              </button>
            )}

            {parts.map((p) => (
              <div className="tw-qlist-section" key={p.id}>
                <h6>{p.label}</h6>
                <div className="tw-qlist-grid">
                  {Array.from(
                    { length: p.range[1] - p.range[0] + 1 },
                    (_, i) => p.range[0] + i,
                  ).map((qid) => (
                    <div
                      key={qid}
                      className={`tw-qlist-item ${answers[qid] ? "answered" : ""} ${marked[qid] ? "marked" : ""}`}
                      onClick={() => scrollToQuestion(qid)}
                    >
                      {qid}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
