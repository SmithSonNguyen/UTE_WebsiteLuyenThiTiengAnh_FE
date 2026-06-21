import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { explainToeicQuestion } from "@/utils/geminiExplain";

export default function ResultTOEIC() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId } = useParams();

  // State để xử lý trường hợp không có dữ liệu
  const [hasData, setHasData] = useState(true);
  const [payload, setPayload] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // AI Explanation states
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [explanationError, setExplanationError] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const explanationRef = useRef(null);

  const hasMediaContent =
    (Array.isArray(selectedQuestion?.imageUrl)
      ? selectedQuestion?.imageUrl.length > 0
      : !!selectedQuestion?.imageUrl?.trim()) ||
    !!selectedQuestion?.mediaUrl?.trim() ||
    !!selectedQuestion?.paragraph?.trim();
  // Load data khi component mount
  useEffect(() => {
    console.log("=== RESULT PAGE LOADED ===");
    console.log("examId from params:", examId);
    console.log("location.state:", location?.state);

    // Ưu tiên lấy từ location.state
    const fromState = location?.state;
    if (fromState?.summary && fromState?.detailedAnswers && fromState?.meta) {
      console.log("✓ Data found in location.state");
      console.log("Summary:", fromState.summary);
      setPayload(fromState);
      setHasData(true);
      return;
    }

    // Fallback: đọc từ sessionStorage
    try {
      const storageKey = `toeic_result_${examId}`;
      console.log("Trying to load from sessionStorage:", storageKey);
      const raw = sessionStorage.getItem(storageKey);

      if (raw) {
        console.log(
          "Raw data from sessionStorage:",
          raw.substring(0, 200) + "...",
        );
        const parsed = JSON.parse(raw);

        if (parsed?.summary && parsed?.detailedAnswers && parsed?.meta) {
          console.log("✓ Data found in sessionStorage");
          console.log("Summary:", parsed.summary);
          setPayload(parsed);
          setHasData(true);
          return;
        }
      }
    } catch (e) {
      console.error("Error reading from sessionStorage:", e);
    }

    // Không tìm thấy dữ liệu
    console.warn("✗ No result data found");
    setHasData(false);
  }, [location, examId]);

  // Lấy dữ liệu từ payload hoặc mặc định
  const summary = payload?.summary || {
    listeningCorrect: 0,
    readingCorrect: 0,
    listeningScore: 0,
    readingScore: 0,
    totalScore: 0,
  };

  const detailedAnswers = Array.isArray(payload?.detailedAnswers)
    ? payload.detailedAnswers
    : [];

  const meta = payload?.meta || {
    examId: examId || "-",
    answeredCount: 0,
    totalQuestions: 0,
  };

  // Log dữ liệu cuối cùng
  useEffect(() => {
    if (hasData) {
      console.log("=== FINAL DATA TO DISPLAY ===");
      console.log("Summary:", summary);
      console.log("Detailed answers count:", detailedAnswers.length);
      console.log("Meta:", meta);
    }
  }, [hasData, summary, detailedAnswers, meta]);

  // Reset explanation khi đổi câu hỏi
  useEffect(() => {
    setExplanationText("");
    setExplanationError("");
    setShowExplanation(false);
    setIsExplaining(false);
  }, [selectedQuestion]);

  // Hàm gọi AI giải thích
  const handleExplain = useCallback(async () => {
    if (!selectedQuestion || isExplaining) return;
    setIsExplaining(true);
    setExplanationText("");
    setExplanationError("");
    setShowExplanation(true);

    try {
      await explainToeicQuestion(selectedQuestion, (chunk) => {
        setExplanationText((prev) => prev + chunk);
        // Auto-scroll explanation vùng xuống dưới
        if (explanationRef.current) {
          explanationRef.current.scrollTop =
            explanationRef.current.scrollHeight;
        }
      });
    } catch (err) {
      setExplanationError(
        err.message || "Có lỗi xảy ra khi gọi AI. Vui lòng thử lại.",
      );
    } finally {
      setIsExplaining(false);
    }
  }, [selectedQuestion, isExplaining]);

  // Hàm render markdown đơn giản
  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      // Bold **text**
      const boldParsed = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      // Heading ##
      if (/^#{1,3}\s/.test(line)) {
        const headingText = line.replace(/^#{1,3}\s/, "");
        return (
          <div
            key={i}
            className="explain-heading"
            dangerouslySetInnerHTML={{
              __html: headingText.replace(
                /\*\*(.+?)\*\*/g,
                "<strong>$1</strong>",
              ),
            }}
          />
        );
      }
      // Numbered list 1.
      if (/^\d+\.\s/.test(line)) {
        return (
          <div
            key={i}
            className="explain-numbered"
            dangerouslySetInnerHTML={{ __html: boldParsed }}
          />
        );
      }
      // Bullet -
      if (/^[-•]\s/.test(line)) {
        return (
          <div
            key={i}
            className="explain-bullet"
            dangerouslySetInnerHTML={{
              __html: boldParsed.replace(/^[-•]\s/, ""),
            }}
          />
        );
      }
      // Empty line
      if (line.trim() === "") return <div key={i} className="explain-spacer" />;
      // Normal text
      return (
        <div
          key={i}
          className="explain-text"
          dangerouslySetInnerHTML={{ __html: boldParsed }}
        />
      );
    });
  };

  // Tính toán thống kê bổ sung
  const totalCorrect = summary.listeningCorrect + summary.readingCorrect;
  const accuracyRate =
    meta.answeredCount > 0
      ? Math.round((totalCorrect / meta.answeredCount) * 100)
      : 0;

  // Phân loại câu trả lời theo Part
  const answersByPart = detailedAnswers.reduce((acc, answer) => {
    const part = `Part ${answer.part || "Unknown"}`;
    if (!acc[part]) {
      acc[part] = {
        total: 0,
        correct: 0,
        answers: [],
      };
    }
    acc[part].total += 1;
    if (answer.isCorrect) acc[part].correct += 1;
    acc[part].answers.push(answer);
    return acc;
  }, {});

  // Đánh giá mức độ
  const getScoreLevel = (score) => {
    if (score >= 900) return { text: "Xuất Sắc", color: "#28a745" };
    if (score >= 785) return { text: "Khá Tốt", color: "#17a2b8" };
    if (score >= 605) return { text: "Trung Bình Khá", color: "#ffc107" };
    if (score >= 405) return { text: "Trung Bình", color: "#fd7e14" };
    return { text: "Cần Cải Thiện", color: "#dc3545" };
  };

  const scoreLevel = getScoreLevel(summary.totalScore);

  const css = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body, #root {
        height: 100%;
    }

    .page-wrap {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        line-height: 1.6;
        min-height: 100vh;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        overflow: hidden;
        animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px;
        text-align: center;
        position: relative;
    }

    .header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }

    .header p {
        font-size: 1.2em;
        opacity: 0.9;
    }

    .score-level-badge {
        display: inline-block;
        margin-top: 15px;
        padding: 8px 20px;
        background: rgba(255,255,255,0.2);
        border-radius: 20px;
        font-size: 1.1em;
        font-weight: bold;
    }

    .content {
        padding: 40px;
    }

    .no-data-message {
        text-align: center;
        padding: 60px 20px;
        color: #666;
    }

    .no-data-message h2 {
        color: #333;
        margin-bottom: 15px;
    }

    .score-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .score-card {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        padding: 30px;
        border-radius: 15px;
        color: white;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transform: translateY(0);
        transition: transform 0.3s ease;
    }

    .score-card:hover {
        transform: translateY(-5px);
    }

    .score-card.listening {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .score-card.reading {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .score-card.total {
        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    .score-card h3 {
        font-size: 1.2em;
        margin-bottom: 15px;
        opacity: 0.9;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .score-card .score {
        font-size: 3em;
        font-weight: bold;
        margin: 10px 0;
    }

    .score-card .details {
        font-size: 0.9em;
        opacity: 0.9;
        line-height: 1.6;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 40px;
    }

    .stat-box {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 10px;
        text-align: center;
        border-left: 4px solid #667eea;
        transition: all 0.3s ease;
    }

    .stat-box:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .stat-box .label {
        color: #666;
        font-size: 0.9em;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .stat-box .value {
        font-size: 2em;
        font-weight: bold;
        color: #333;
    }

    .stat-box .sub-value {
        color: #888;
        font-size: 0.85em;
        margin-top: 5px;
    }

    .part-analysis {
        margin-bottom: 40px;
    }

    .part-card {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 15px;
        border-left: 4px solid #667eea;
    }

    .part-card h4 {
        color: #333;
        margin-bottom: 10px;
        font-size: 1.1em;
    }

    .part-stats {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }

    .part-stat {
        flex: 1;
        min-width: 150px;
    }

    .part-stat .label {
        color: #666;
        font-size: 0.85em;
    }

    .part-stat .value {
        font-size: 1.5em;
        font-weight: bold;
        color: #667eea;
    }

    .answers-section {
        margin-top: 40px;
    }

    .section-title {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        margin-bottom: 20px;
        font-size: 1.3em;
        font-weight: bold;
    }

    .answers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 10px;
        margin-bottom: 30px;
    }

    .answer-item {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        text-align: center;
        border: 2px solid transparent;
        transition: all 0.3s ease;
    }

    .answer-item:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .answer-item.correct {
        background: #d4edda;
        border-color: #28a745;
    }

    .answer-item.incorrect {
        background: #f8d7da;
        border-color: #dc3545;
    }

    .answer-item .question-num {
        font-weight: bold;
        color: #333;
        margin-bottom: 5px;
        font-size: 0.9em;
    }

    .answer-item .answer {
        font-size: 1.2em;
        color: #667eea;
        font-weight: bold;
    }

    .answer-item .answer-details {
        font-size: 0.75em;
        color: #666;
        margin-top: 5px;
    }

    .answer-item .icon {
        font-size: 1.5em;
        margin-top: 5px;
    }

    .answer-item.correct .icon {
        color: #28a745;
    }

    .answer-item.incorrect .icon {
        color: #dc3545;
    }

    .footer {
        background: #f8f9fa;
        padding: 30px;
        text-align: center;
        color: #666;
        border-top: 1px solid #dee2e6;
    }

    .button-group {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
        flex-wrap: wrap;
    }

    .btn {
        padding: 12px 30px;
        border-radius: 25px;
        border: none;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    }

    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }

    .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(240, 147, 251, 0.4);
    }

    @media (max-width: 768px) {
        .header h1 {
            font-size: 1.8em;
        }

        .score-card .score {
            font-size: 2.5em;
        }

        .content {
            padding: 20px;
        }

        .answers-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        }
    }

    /* Modal Styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-in;
    }

    .modal-content {
        background: white;
        border-radius: 15px;
        padding: 40px;
        max-width: 800px;
        width: 90%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        border-bottom: 2px solid #667eea;
        padding-bottom: 15px;
    }

    .modal-header h2 {
        color: #333;
        font-size: 1.8em;
        margin: 0;
    }

    .modal-close-btn {
        background: none;
        border: none;
        font-size: 1.8em;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }

    .modal-close-btn:hover {
        background: #f0f0f0;
        color: #333;
    }

    .modal-meta {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 20px;
        font-size: 0.95em;
    }

    .modal-meta-title {
        font-weight: bold;
        color: #333;
        margin-bottom: 8px;
    }

    .modal-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 10px;
    }

    .modal-tag {
        background: #667eea;
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.85em;
        display: inline-block;
    }

    .modal-question {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 25px;
        line-height: 1.8;
        border-left: 4px solid #667eea;
    }

    .modal-question p {
        margin: 0;
        color: #333;
        font-weight: 500;
    }

    .modal-options {
        margin-bottom: 25px;
    }

    .modal-option {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px;
        margin-bottom: 10px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        transition: all 0.2s ease;
        background: white;
    }

    .modal-option:hover {
        border-color: #667eea;
        background: #f8f9fa;
    }

    .modal-option.selected {
        border-color: #667eea;
        background: #e8f0ff;
    }

    .modal-option.correct {
        border-color: #28a745;
        background: #d4edda;
    }

    .modal-option.incorrect {
        border-color: #dc3545;
        background: #f8d7da;
    }

    .modal-option input[type="radio"] {
        margin-top: 2px;
        width: 18px;
        height: 18px;
        accent-color: #667eea;
    }

    .modal-option label {
        flex: 1;
        margin: 0;
        cursor: pointer;
        font-weight: 500;
    }

    .modal-option-text {
        color: #333;
        font-size: 0.95em;
    }

    .modal-result {
        background: #f0f8ff;
        border-left: 4px solid #667eea;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 25px;
        font-size: 0.95em;
    }

    .modal-result.correct {
        background: #d4edda;
        border-color: #28a745;
    }

    .modal-result.incorrect {
        background: #f8d7da;
        border-color: #dc3545;
    }

    .modal-result-title {
        font-weight: bold;
        margin-bottom: 8px;
    }

    .modal-footer {
        display: flex;
        gap: 12px;
        margin-top: 25px;
    }

    .modal-btn {
        flex: 1;
        padding: 12px 20px;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.95em;
    }

    .modal-btn-explain {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .modal-btn-explain:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .modal-btn-explain:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }

    .modal-btn-close {
        background: #e0e0e0;
        color: #333;
    }

    .modal-btn-close:hover {
        background: #d0d0d0;
    }

    /* ===== Static Explanation Panel ===== */
    .db-explain-panel {
        margin-top: 20px;
        background: #f5f3ff;
        border-left: 4px solid #7c3aed;
        padding: 18px;
        border-radius: 0 10px 10px 0;
        font-size: 0.95em;
        line-height: 1.6;
        color: #4c1d95;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .db-explain-title {
        font-weight: bold;
        color: #5b21b6;
        margin-bottom: 8px;
        text-transform: uppercase;
        font-size: 0.85em;
        letter-spacing: 0.5px;
    }

    /* ===== AI Explanation Panel ===== */
    .explain-panel {
        margin-top: 20px;
        border-radius: 14px;
        overflow: hidden;
        border: 1.5px solid #c4b5fd;
        animation: fadeIn 0.4s ease;
    }

    .explain-panel-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 14px 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
        font-size: 1em;
    }

    .explain-panel-header .ai-badge {
        background: rgba(255,255,255,0.22);
        padding: 2px 10px;
        border-radius: 20px;
        font-size: 0.8em;
        letter-spacing: 0.5px;
    }

    .explain-body {
        background: #faf9ff;
        padding: 20px 22px;
        max-height: 400px;
        overflow-y: auto;
        font-size: 0.93em;
        line-height: 1.75;
        color: #2d2d2d;
    }

    .explain-heading {
        font-size: 1em;
        font-weight: 700;
        color: #5b21b6;
        margin: 14px 0 6px;
        padding-left: 10px;
        border-left: 3px solid #7c3aed;
    }

    .explain-numbered {
        margin: 8px 0 4px 10px;
        font-weight: 600;
        color: #3730a3;
    }

    .explain-bullet {
        margin: 4px 0 4px 24px;
        position: relative;
        color: #374151;
    }

    .explain-bullet::before {
        content: "•";
        position: absolute;
        left: -14px;
        color: #7c3aed;
    }

    .explain-text {
        margin: 4px 0;
        color: #374151;
    }

    .explain-spacer {
        height: 8px;
    }

    .explain-loading {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 24px 22px;
        background: #faf9ff;
        color: #7c3aed;
        font-size: 0.95em;
    }

    .explain-spinner {
        width: 22px;
        height: 22px;
        border: 3px solid #e9d5ff;
        border-top-color: #7c3aed;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        flex-shrink: 0;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .explain-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background: #7c3aed;
        margin-left: 2px;
        vertical-align: middle;
        animation: blink 0.8s step-end infinite;
    }

    @keyframes blink {
        50% { opacity: 0; }
    }

    .explain-error {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 14px 18px;
        color: #b91c1c;
        font-size: 0.9em;
        border-radius: 0 8px 8px 0;
        margin: 14px 22px;
    }

    .explain-retry-btn {
        background: none;
        border: 1.5px solid #ef4444;
        color: #b91c1c;
        padding: 5px 14px;
        border-radius: 20px;
        cursor: pointer;
        font-size: 0.85em;
        margin-top: 8px;
        display: inline-block;
        transition: all 0.2s;
    }

    .explain-retry-btn:hover {
        background: #fef2f2;
    }

    .explain-done-tag {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.82em;
        color: #6b7280;
        padding: 8px 22px 12px;
        background: #faf9ff;
        border-top: 1px solid #ede9fe;
    }

    .explain-dot-done {
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        flex-shrink: 0;
    }

    /* Media & Image Styles */
    .modal-media-section {
        margin-bottom: 25px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 10px;
        border-left: 4px solid #667eea;
    }

    .modal-media-section-title {
        font-weight: bold;
        margin-bottom: 15px;
        color: #333;
        font-size: 0.95em;
    }

    .modal-images {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 15px;
    }

    .modal-image {
        max-width: 100%;
        
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 1px solid #e0e0e0;
        object-fit: contain;
    }

    .modal-audio {
        width: 100%;
        margin-bottom: 12px;
        border-radius: 24px;
    }

    .modal-paragraph {
        background: white;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #e0e0e0;
        white-space: pre-wrap;
        line-height: 1.6;
        font-size: 0.95em;
        color: #333;
    }
  `;

  // Nếu không có dữ liệu
  if (!hasData) {
    return (
      <div className="page-wrap">
        <div className="container">
          <div className="header">
            <h1>🎓 Kết Quả Thi TOEIC</h1>
          </div>
          <div className="content">
            <div className="no-data-message">
              <h2>⚠️ Không tìm thấy kết quả</h2>
              <p>
                Không có dữ liệu kết quả thi. Vui lòng làm bài thi trước khi xem
                kết quả.
              </p>
              <p
                style={{ marginTop: "10px", fontSize: "0.9em", color: "#888" }}
              >
                Kiểm tra Console (F12) để xem thông tin debug chi tiết.
              </p>
              <div className="button-group">
                <button
                  onClick={() => navigate(`/toeic-home/test-online/${examId}`)}
                  className="btn btn-primary"
                >
                  📝 Làm Bài Thi
                </button>
                <button
                  onClick={() => navigate("/toeic-home")}
                  className="btn btn-secondary"
                >
                  🏠 Về Trang Chủ
                </button>
              </div>
            </div>
          </div>
        </div>
        <style>{css}</style>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <div className="header">
          <h1>🎓 Kết Quả Thi TOEIC</h1>
          <p>Đề thi: {meta.examId}</p>
          <div
            className="score-level-badge"
            style={{ backgroundColor: scoreLevel.color }}
          >
            {scoreLevel.text}
          </div>
        </div>

        <div className="content">
          {/* Score Summary */}
          <div className="score-summary">
            <div className="score-card total">
              <h3>Tổng Điểm</h3>
              <div className="score">{summary.totalScore}</div>
              <div className="details">/ 990 điểm</div>
            </div>

            <div className="score-card listening">
              <h3>Listening</h3>
              <div className="score">{summary.listeningScore}</div>
              <div className="details">
                / 495 điểm
                <br />
                Đúng: {summary.listeningCorrect}/100 câu
              </div>
            </div>

            <div className="score-card reading">
              <h3>Reading</h3>
              <div className="score">{summary.readingScore}</div>
              <div className="details">
                / 495 điểm
                <br />
                Đúng: {summary.readingCorrect}/100 câu
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-grid">
            <div className="stat-box">
              <div className="label">Tổng câu đúng</div>
              <div className="value">{totalCorrect}</div>
              <div className="sub-value">/ {meta.totalQuestions} câu</div>
            </div>

            <div className="stat-box">
              <div className="label">Độ chính xác</div>
              <div className="value">{accuracyRate}%</div>
              <div className="sub-value">
                {totalCorrect}/{meta.answeredCount} câu đã trả lời
              </div>
            </div>

            <div className="stat-box">
              <div className="label">Câu chưa trả lời</div>
              <div className="value">
                {meta.totalQuestions - meta.answeredCount}
              </div>
              <div className="sub-value">câu</div>
            </div>
          </div>

          {/* Part Analysis */}
          {Object.keys(answersByPart).length > 0 && (
            <div className="part-analysis">
              <div className="section-title">Kết quả từng part</div>
              {Object.entries(answersByPart)
                .sort(([a], [b]) => {
                  const numA = parseInt(a.replace("Part ", "")) || 0;
                  const numB = parseInt(b.replace("Part ", "")) || 0;
                  return numA - numB;
                })
                .map(([part, data]) => (
                  <div key={part} className="part-card">
                    <h4>{part}</h4>
                    <div className="part-stats">
                      <div className="part-stat">
                        <div className="label">Đúng</div>
                        <div className="value">
                          {data.correct}/{data.total}
                        </div>
                      </div>
                      <div className="part-stat">
                        <div className="label">Tỷ lệ</div>
                        <div className="value">
                          {data.total > 0
                            ? Math.round((data.correct / data.total) * 100)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Answers Section */}
          {detailedAnswers.length > 0 && (
            <div className="answers-section">
              <div className="section-title">Đáp Án Chi Tiết</div>
              <div className="answers-grid">
                {detailedAnswers
                  .sort((a, b) => a.number - b.number)
                  .map((a) => (
                    <div
                      key={a.number}
                      className={`answer-item ${
                        a.isCorrect ? "correct" : "incorrect"
                      }`}
                      onClick={() => setSelectedQuestion(a)}
                      style={{ cursor: "pointer" }}
                      title={`Câu ${a.number} - Part ${a.part}
                      Bạn chọn: ${a.userAnswer || "Chưa trả lời"}
                      Đáp án đúng: ${a.correctAnswer}`}
                    >
                      <div className="question-num">Câu {a.number}</div>
                      <div className="answer">{a.userAnswer || "-"}</div>

                      {!a.isCorrect && a.correctAnswer && (
                        <div className="answer-details">
                          Đúng: {a.correctAnswer}
                        </div>
                      )}

                      <div
                        className={`icon ${
                          a.isCorrect ? "icon-correct" : "icon-incorrect"
                        }`}
                      >
                        {a.isCorrect ? "✔" : "✖"}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="button-group">
            <button
              onClick={() => navigate(`/toeic-home/test-online/${examId}`)}
              className="btn btn-secondary"
            >
              📚 Quay Về
            </button>
            <button
              onClick={() => navigate(`/toeic-home/test-online/${examId}`)}
              className="btn btn-primary"
            >
              🔄 Làm Lại Bài Thi
            </button>
          </div>
        </div>

        <div className="footer">
          <p>
            💡 <strong>Tips:</strong> Khi xem chi tiết đáp án, bạn có thể tạo và
            lưu highlight từ vựng, keywords và tạo note để học và tra cứu khi có
            nhu cầu ôn lại đề thi này trong tương lai.
          </p>
          <p style={{ marginTop: "15px", fontSize: "0.9em" }}>
            Chúc bạn học tốt và đạt điểm cao! 🎯
          </p>
        </div>
      </div>

      <style>{css}</style>

      {/* Detail Modal */}
      {selectedQuestion && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedQuestion(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Đáp án chi tiết #{selectedQuestion.number}</h2>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedQuestion(null)}
              >
                ✕
              </button>
            </div>

            {/* Media Section - Images & Audio */}
            {hasMediaContent && (
              <div className="modal-media-section">
                {/* Images */}
                {selectedQuestion.imageUrl && (
                  <div className="modal-images">
                    {Array.isArray(selectedQuestion.imageUrl) ? (
                      selectedQuestion.imageUrl.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`question-${idx}`}
                          className="modal-image"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ))
                    ) : (
                      <img
                        src={selectedQuestion.imageUrl}
                        alt="question"
                        className="modal-image"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Audio */}
                {selectedQuestion.mediaUrl && (
                  <audio
                    controls
                    className="modal-audio"
                    onError={(e) => {
                      e.style.display = "none";
                    }}
                  >
                    <source src={selectedQuestion.mediaUrl} />
                    Your browser does not support the audio element.
                  </audio>
                )}

                {/* Paragraph */}
                {selectedQuestion.paragraph && (
                  <div className="modal-paragraph">
                    {selectedQuestion.paragraph}
                  </div>
                )}
              </div>
            )}

            {/* Question */}
            {selectedQuestion.questionText && (
              <div className="modal-question">
                <p>{selectedQuestion.questionText}</p>
              </div>
            )}

            {/* Options */}
            {selectedQuestion.options &&
              selectedQuestion.options.length > 0 && (
                <div className="modal-options">
                  {selectedQuestion.options.map((opt, idx) => {
                    const label = String.fromCharCode(65 + idx);
                    const isUserAnswer = selectedQuestion.userAnswer === label;
                    const isCorrectAnswer =
                      selectedQuestion.correctAnswer === label;

                    return (
                      <div
                        key={idx}
                        className={`modal-option ${
                          isUserAnswer && isCorrectAnswer
                            ? "correct selected"
                            : isUserAnswer
                              ? "incorrect"
                              : isCorrectAnswer
                                ? "correct"
                                : ""
                        }`}
                      >
                        <input
                          type="radio"
                          id={`opt-${idx}`}
                          name="answer"
                          checked={isUserAnswer}
                          disabled
                        />
                        <label
                          htmlFor={`opt-${idx}`}
                          className="modal-option-text"
                        >
                          <strong>{label}.</strong> {opt}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}

            {/* Result Summary */}
            <div
              className={`modal-result ${
                selectedQuestion.isCorrect ? "correct" : "incorrect"
              }`}
            >
              <div className="modal-result-title">
                {selectedQuestion.isCorrect ? "✔ Đáp án đúng" : "✖ Đáp án sai"}
              </div>
              <div>
                Bạn chọn:{" "}
                <strong>{selectedQuestion.userAnswer || "Chưa trả lời"}</strong>
              </div>
              <div>
                Đáp án đúng: <strong>{selectedQuestion.correctAnswer}</strong>
              </div>
            </div>

            {/* Static Explanation (from Database/Test) */}
            {selectedQuestion.explanation && (
              <div className="db-explain-panel">
                <div className="db-explain-title">💡 Giải thích từ đề thi:</div>
                <div className="whitespace-pre-wrap leading-relaxed">
                  {selectedQuestion.explanation}
                </div>
              </div>
            )}

            {/* AI Explanation Panel */}
            {showExplanation && (
              <div className="explain-panel">
                <div className="explain-panel-header">
                  <span>✨</span>
                  <span>Giải thích chi tiết bởi AI</span>
                  {/* <span className="ai-badge">Gemini</span> */}
                </div>

                {/* Loading khi chưa có text */}
                {isExplaining && explanationText === "" && (
                  <div className="explain-loading">
                    <div className="explain-spinner" />
                    <span>
                      AI đang phân tích câu hỏi Part {selectedQuestion.part}...
                    </span>
                  </div>
                )}

                {/* Nội dung đang stream / đã xong */}
                {explanationText !== "" && (
                  <>
                    <div className="explain-body" ref={explanationRef}>
                      {renderMarkdown(explanationText)}
                      {isExplaining && <span className="explain-cursor" />}
                    </div>
                    {!isExplaining && !explanationError && (
                      <div className="explain-done-tag">
                        <span className="explain-dot-done" />
                        <span>Giải thích hoàn tất </span>
                      </div>
                    )}
                  </>
                )}

                {/* Lỗi */}
                {explanationError && (
                  <div className="explain-error">
                    <div>⚠️ {explanationError}</div>
                    <button
                      className="explain-retry-btn"
                      onClick={handleExplain}
                    >
                      🔄 Thử lại
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="modal-footer">
              <button
                className="modal-btn modal-btn-explain"
                onClick={handleExplain}
                disabled={isExplaining}
              >
                {isExplaining ? (
                  <>
                    <span style={{ marginRight: 8 }}>⏳</span>Đang phân tích...
                  </>
                ) : showExplanation && explanationText ? (
                  "🔄 Giải thích lại"
                ) : (
                  "💡 Giải thích chi tiết"
                )}
              </button>
              <button
                className="modal-btn modal-btn-close"
                onClick={() => setSelectedQuestion(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
