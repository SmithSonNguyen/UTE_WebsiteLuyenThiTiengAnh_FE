import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function ResultTOEIC() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId } = useParams();

  // State để xử lý trường hợp không có dữ liệu
  const [hasData, setHasData] = useState(true);
  const [payload, setPayload] = useState(null);

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
        console.log("Raw data from sessionStorage:", raw.substring(0, 200) + "...");
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

  // Tính toán thống kê bổ sung
  const totalCorrect = summary.listeningCorrect + summary.readingCorrect;
  const accuracyRate = meta.answeredCount > 0 
    ? Math.round((totalCorrect / meta.answeredCount) * 100) 
    : 0;

  // Phân loại câu trả lời theo Part
  const answersByPart = detailedAnswers.reduce((acc, answer) => {
    const part = `Part ${answer.part || 'Unknown'}`;
    if (!acc[part]) {
      acc[part] = {
        total: 0,
        correct: 0,
        answers: []
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
              <p>Không có dữ liệu kết quả thi. Vui lòng làm bài thi trước khi xem kết quả.</p>
              <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#888' }}>
                Kiểm tra Console (F12) để xem thông tin debug chi tiết.
              </p>
              <div className="button-group">
                <button onClick={() => navigate(`/toeic-home/test-online/${examId}`)} className="btn btn-primary">
                  📝 Làm Bài Thi
                </button>
                <button onClick={() => navigate('/toeic-home')} className="btn btn-secondary">
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
          <div className="score-level-badge" style={{ backgroundColor: scoreLevel.color }}>
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
                / 495 điểm<br/>
                Đúng: {summary.listeningCorrect}/100 câu
              </div>
            </div>

            <div className="score-card reading">
              <h3>Reading</h3>
              <div className="score">{summary.readingScore}</div>
              <div className="details">
                / 495 điểm<br/>
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
              <div className="value">{meta.totalQuestions - meta.answeredCount}</div>
              <div className="sub-value">câu</div>
            </div>
          </div>

          {/* Part Analysis */}
          {Object.keys(answersByPart).length > 0 && (
            <div className="part-analysis">
              <div className="section-title">📊 Phân Tích Theo Part</div>
              {Object.entries(answersByPart)
                .sort(([a], [b]) => {
                  const numA = parseInt(a.replace('Part ', '')) || 0;
                  const numB = parseInt(b.replace('Part ', '')) || 0;
                  return numA - numB;
                })
                .map(([part, data]) => (
                  <div key={part} className="part-card">
                    <h4>{part}</h4>
                    <div className="part-stats">
                      <div className="part-stat">
                        <div className="label">Đúng</div>
                        <div className="value">{data.correct}/{data.total}</div>
                      </div>
                      <div className="part-stat">
                        <div className="label">Tỷ lệ</div>
                        <div className="value">
                          {data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%
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
              <div className="section-title">📝 Đáp Án Chi Tiết</div>
              <div className="answers-grid">
                {detailedAnswers.map((a) => (
                  <div 
                    key={a.number} 
                    className={`answer-item ${a.isCorrect ? "correct" : "incorrect"}`}
                    title={`Câu ${a.number} - Part ${a.part || ''}\nĐáp án của bạn: ${a.userAnswer || 'Chưa trả lời'}\nĐáp án đúng: ${a.correctAnswer}`}
                  >
                    <div className="question-num">Câu {a.number}</div>
                    <div className="answer">{a.userAnswer || "-"}</div>
                    {!a.isCorrect && a.correctAnswer && (
                      <div className="answer-details">
                        Đúng: {a.correctAnswer}
                      </div>
                    )}
                    <div className="icon">{a.isCorrect ? "✓" : "✗"}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="button-group">
            <button 
              onClick={() => navigate(-1)} 
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
            💡 <strong>Tips:</strong> Khi xem chi tiết đáp án, bạn có thể tạo và lưu 
            highlight từ vựng, keywords và tạo note để học và tra cứu khi có nhu cầu 
            ôn lại đề thi này trong tương lai.
          </p>
          <p style={{ marginTop: '15px', fontSize: '0.9em' }}>
            Chúc bạn học tốt và đạt điểm cao! 🎯
          </p>
        </div>
      </div>

      <style>{css}</style>
    </div>
  );
}