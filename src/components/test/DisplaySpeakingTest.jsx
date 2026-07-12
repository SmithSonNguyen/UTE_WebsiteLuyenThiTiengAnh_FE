import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mic, MicOff, Play, RefreshCw, ChevronLeft, ChevronRight, Award, Volume2, Loader2, Bot } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { checkHasPurchase } from "@/api/paymentApi";

// ============================================================
//  CẤU TRÚC 11 CÂU / 5 PARTS — CHUẨN ETS TOEIC SPEAKING
// ============================================================
const PARTS = [
  {
    partNumber: 1,
    title: "Part 1: Read a Text Aloud",
    icon: "📖",
    description: "Đọc to đoạn văn trên màn hình. Thời gian chuẩn bị: 45 giây. Thời gian đọc: 45 giây.",
    isPremium: false,
    questionIds: [1, 2],
  },
  {
    partNumber: 2,
    title: "Part 2: Describe a Picture",
    icon: "🖼️",
    description: "Miêu tả chi tiết bức tranh trên màn hình. Thời gian chuẩn bị: 45 giây. Thời gian nói: 30 giây.",
    isPremium: true,
    questionIds: [3],
  },
  {
    partNumber: 3,
    title: "Part 3: Respond to Questions",
    icon: "🎙️",
    description: "Trả lời 3 câu hỏi về một chủ đề quen thuộc, không có thời gian chuẩn bị. Q4: 15 giây. Q5-6: 30 giây.",
    isPremium: true,
    questionIds: [4, 5, 6],
  },
  {
    partNumber: 4,
    title: "Part 4: Respond to Questions Using Info",
    icon: "📋",
    description: "Đọc tài liệu và trả lời 3 câu hỏi dựa trên thông tin cho sẵn. Q7-8: 15 giây. Q9: 30 giây.",
    isPremium: true,
    questionIds: [7, 8, 9],
  },
  {
    partNumber: 5,
    title: "Part 5: Express an Opinion",
    icon: "💬",
    description: "Trình bày quan điểm cá nhân về một chủ đề. Thời gian chuẩn bị: 45 giây. Thời gian nói: 60 giây.",
    isPremium: true,
    questionIds: [10, 11],
  },
];

const QUESTIONS = [
  // ─── PART 1: Read a Text Aloud (Q1–Q2) ───────────────────────────────────────
  {
    id: 1,
    partNumber: 1,
    prepTime: 45,
    responseTime: 45,
    prompt: "Directions: In this part of the test, you will read aloud the text on the screen. You will have 45 seconds to prepare. Then you will have 45 seconds to read the text aloud.",
    targetText:
      "Thank you for calling the Western Medical Center. If you are calling for an emergency, please hang up and dial 911 immediately. For billing questions, press one. To make an appointment, press two. To speak to a pharmacy representative, press three. Otherwise, please stay on the line and your call will be answered shortly.",
  },
  {
    id: 2,
    partNumber: 1,
    prepTime: 45,
    responseTime: 45,
    prompt: "Directions: In this part of the test, you will read aloud the text on the screen. You will have 45 seconds to prepare. Then you will have 45 seconds to read the text aloud.",
    targetText:
      "Attention all shoppers. We are pleased to announce a special discount today only. All summer clothing items in the main display area are now thirty percent off. This discount is applied at checkout. Thank you for shopping with us, and we hope you enjoy your day.",
  },

  // ─── PART 2: Describe a Picture (Q3) ─────────────────────────────────────────
  {
    id: 3,
    partNumber: 2,
    prepTime: 45,
    responseTime: 30,
    prompt: "Directions: In this part of the test, you will describe the picture on your screen in as much detail as possible. You will have 45 seconds to prepare your response. Then you will have 30 seconds to speak about the picture.",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800",
    targetText:
      "The picture shows a woman working at her desk in a bright, modern office. She appears to be focused on her laptop screen. On the desk, there is a cup of coffee and several documents. She is wearing a blue shirt. In the background, there are bookshelves filled with books. The office looks well-organized and professional.",
  },

  // ─── PART 3: Respond to Questions (Q4–Q6) ────────────────────────────────────
  {
    id: 4,
    partNumber: 3,
    prepTime: 0,
    responseTime: 15,
    prompt: "Directions: In this part of the test, you will answer three questions. For each question, begin responding immediately after you hear a beep. No preparation time is given. You will have 15 seconds to respond.",
    context: "Imagine that a marketing firm is conducting a survey about people's shopping habits.",
    question: "How often do you go shopping, and what do you usually buy?",
    targetText:
      "I go shopping about once a week, mostly for groceries and daily necessities. Occasionally, I also shop for clothes or electronics when there is a sale.",
  },
  {
    id: 5,
    partNumber: 3,
    prepTime: 0,
    responseTime: 30,
    prompt: "Directions: For this question, you will have 30 seconds to respond.",
    context: "Imagine that a marketing firm is conducting a survey about people's shopping habits.",
    question: "Do you prefer shopping online or in stores? Why?",
    targetText:
      "I generally prefer shopping in stores because I can see and touch the products before buying them. This is especially important for clothes and food. However, for electronics or books, I often choose to shop online since the prices are usually lower and delivery is very convenient.",
  },
  {
    id: 6,
    partNumber: 3,
    prepTime: 0,
    responseTime: 30,
    prompt: "Directions: For this question, you will have 30 seconds to respond.",
    context: "Imagine that a marketing firm is conducting a survey about people's shopping habits.",
    question: "Have you ever had a bad shopping experience? What happened?",
    targetText:
      "Yes, I once ordered a jacket online that looked great in the picture but was completely different in reality. The color was off and the size did not fit. The return process was also very complicated, which was very frustrating. Since then, I have been more careful when shopping online.",
  },

  // ─── PART 4: Respond to Questions Using Information (Q7–Q9) ──────────────────
  {
    id: 7,
    partNumber: 4,
    prepTime: 0,
    responseTime: 15,
    prompt: "Directions: In this part of the test, you will answer three questions based on information provided. You will have 30 seconds to read the information before the questions begin. For questions 7 and 8, you will have 15 seconds to respond. For question 9, you will have 30 seconds.",
    scheduleInfo: `GREENHILL COMMUNITY CENTER — SPRING FITNESS SCHEDULE
────────────────────────────────────────────
Monday & Wednesday | 7:00 AM  | Morning Yoga        | Room A
Monday & Wednesday | 6:00 PM  | Zumba Dance Class   | Main Hall
Tuesday & Thursday | 8:00 AM  | Aqua Aerobics       | Pool
Friday             | 5:30 PM  | Kickboxing          | Room B
Saturday           | 10:00 AM | Pilates             | Room A
────────────────────────────────────────────
All classes are free for members. Non-members: $10 per class.
Registration required for Kickboxing and Pilates. Call 555-0192.`,
    question: "What time does the Zumba Dance Class begin on Wednesdays?",
    targetText:
      "According to the schedule, the Zumba Dance Class on Wednesday begins at 6:00 PM and is held in the Main Hall.",
  },
  {
    id: 8,
    partNumber: 4,
    prepTime: 0,
    responseTime: 15,
    prompt: "Directions: For this question, you will have 15 seconds to respond.",
    scheduleInfo: `GREENHILL COMMUNITY CENTER — SPRING FITNESS SCHEDULE
────────────────────────────────────────────
Monday & Wednesday | 7:00 AM  | Morning Yoga        | Room A
Monday & Wednesday | 6:00 PM  | Zumba Dance Class   | Main Hall
Tuesday & Thursday | 8:00 AM  | Aqua Aerobics       | Pool
Friday             | 5:30 PM  | Kickboxing          | Room B
Saturday           | 10:00 AM | Pilates             | Room A
────────────────────────────────────────────
All classes are free for members. Non-members: $10 per class.
Registration required for Kickboxing and Pilates. Call 555-0192.`,
    question: "Which classes require prior registration?",
    targetText:
      "The classes that require prior registration are Kickboxing on Friday and Pilates on Saturday. You can register by calling 555-0192.",
  },
  {
    id: 9,
    partNumber: 4,
    prepTime: 0,
    responseTime: 30,
    prompt: "Directions: For this question, you will have 30 seconds to respond.",
    scheduleInfo: `GREENHILL COMMUNITY CENTER — SPRING FITNESS SCHEDULE
────────────────────────────────────────────
Monday & Wednesday | 7:00 AM  | Morning Yoga        | Room A
Monday & Wednesday | 6:00 PM  | Zumba Dance Class   | Main Hall
Tuesday & Thursday | 8:00 AM  | Aqua Aerobics       | Pool
Friday             | 5:30 PM  | Kickboxing          | Room B
Saturday           | 10:00 AM | Pilates             | Room A
────────────────────────────────────────────
All classes are free for members. Non-members: $10 per class.
Registration required for Kickboxing and Pilates. Call 555-0192.`,
    question: "I am a non-member who is free on Tuesday mornings and Saturday afternoons. Can you suggest a suitable class and tell me about any fees?",
    targetText:
      "Based on the schedule, I would suggest Aqua Aerobics on Tuesday morning at 8:00 AM in the Pool. Since you are a non-member, there will be a fee of ten dollars per class. On Saturday, there is Pilates at 10:00 AM in Room A. Please note that Pilates requires registration, and the non-member fee also applies. I recommend calling 555-0192 to register in advance.",
  },

  // ─── PART 5: Express an Opinion (Q10–Q11) ────────────────────────────────────
  {
    id: 10,
    partNumber: 5,
    prepTime: 45,
    responseTime: 60,
    prompt: "Directions: In this part of the test, you will give your opinion about a specific topic. Be sure to say as much as you can in the time allowed. You will have 45 seconds to prepare. Then you will have 60 seconds to speak.",
    topic: "Some companies now allow employees to work from home full-time. Do you think working from home is better than working in an office? Give specific reasons and examples to support your answer.",
    targetText:
      "In my view, working from home can be more beneficial than working in a traditional office, though it depends on the individual and the job type. First, it eliminates commuting time, which can be significant in large cities, allowing employees to use that time more productively. Second, working from home provides a more flexible environment, which can reduce stress and improve overall work-life balance. However, some roles require face-to-face collaboration, and remote work can sometimes lead to feelings of isolation. Therefore, I believe a hybrid model that combines both options would be the most ideal solution for many companies.",
  },
  {
    id: 11,
    partNumber: 5,
    prepTime: 45,
    responseTime: 60,
    prompt: "Directions: In this part of the test, you will give your opinion about a specific topic. Be sure to say as much as you can in the time allowed. You will have 45 seconds to prepare. Then you will have 60 seconds to speak.",
    topic: "Advances in technology have made it possible for students to learn online rather than attending traditional classes. Do you think online education is as effective as traditional classroom learning? Explain your opinion with specific details.",
    targetText:
      "I believe online education can be just as effective as traditional classroom learning, but only under the right circumstances. One major advantage is flexibility — students can learn at their own pace and revisit lectures as many times as needed. This is particularly helpful for working adults or those with busy schedules. Furthermore, online platforms often provide access to a wider range of courses and expert instructors from around the world. However, the lack of in-person interaction can be a drawback for subjects that require hands-on practice or group collaboration. In conclusion, while online education is a powerful tool, it works best when combined with some form of face-to-face instruction.",
  },
];



// ── Lightweight Markdown Renderer (không cần thư viện ngoài) ─────────────────
function MarkdownRenderer({ content }) {
  const renderLine = (line, idx) => {
    // H2
    if (line.startsWith("## ")) {
      return <h2 key={idx}>{parseInline(line.slice(3))}</h2>;
    }
    // H3
    if (line.startsWith("### ")) {
      return <h3 key={idx}>{parseInline(line.slice(4))}</h3>;
    }
    // HR
    if (/^---+$/.test(line.trim())) {
      return <hr key={idx} />;
    }
    // Blockquote
    if (line.startsWith("> ")) {
      return <blockquote key={idx}>{parseInline(line.slice(2))}</blockquote>;
    }
    // Bullet list
    if (/^[-*] /.test(line)) {
      return <li key={idx}>{parseInline(line.slice(2))}</li>;
    }
    // Numbered list
    if (/^\d+\. /.test(line)) {
      return <li key={idx}>{parseInline(line.replace(/^\d+\. /, ""))}</li>;
    }
    // Empty line → spacing
    if (line.trim() === "") {
      return <div key={idx} style={{ height: "0.4rem" }} />;
    }
    // Normal paragraph
    return <p key={idx}>{parseInline(line)}</p>;
  };

  // Parse inline bold, italic, code
  const parseInline = (text) => {
    const parts = [];
    const regex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)/g;
    let lastIdx = 0;
    let m;
    while ((m = regex.exec(text)) !== null) {
      if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
      if (m[1]) parts.push(<strong key={m.index}>{m[2]}</strong>);
      else if (m[3]) parts.push(<em key={m.index}>{m[4]}</em>);
      else if (m[5]) parts.push(<code key={m.index}>{m[6]}</code>);
      lastIdx = regex.lastIndex;
    }
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : parts;
  };

  const lines = content.split("\n");
  return <div>{lines.map((line, idx) => renderLine(line, idx))}</div>;
}

export default function DisplaySpeakingTest() {
  const navigate = useNavigate();
  const { testId } = useParams();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");

  // Ghi âm âm thanh để phát lại
  const [audioUrl, setAudioUrl] = useState(null);

  // Kết quả AI
  const [aiResult, setAiResult] = useState(null);   // string markdown từ Groq
  const [isGradingAI, setIsGradingAI] = useState(false); // loading spinner
  const [isGraded, setIsGraded] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerMode, setTimerMode] = useState(null); // "prep" | "response" | null
  const timerRef = useRef(null);

  // Lưu trữ lịch sử luyện nói trong phiên hiện tại
  const [sessionAnswers, setSessionAnswers] = useState({});

  // Lấy thông tin user hiện tại từ Redux
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);

  // ── isPaidUser logic ──────────────────────────────────────────────────────
  // Admin / Instructor → mở khóa toàn bộ không cần gọi API
  // User thường → kiểm tra API: có ít nhất 1 payment status=completed hay không
  const [hasPurchase, setHasPurchase] = useState(false);
  const isAdminOrInstructor =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "instructor");
  const isPaidUser = isAdminOrInstructor || hasPurchase;

  useEffect(() => {
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

  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const currentQuestion = QUESTIONS[currentIndex];
  const currentPart = PARTS.find((p) => p.partNumber === currentQuestion.partNumber);
  const isCurrentPremium = currentPart?.isPremium && !isPaidUser;

  // 1. Kiểm tra hỗ trợ Web Speech API khi mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) setIsSupported(false);
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive")
        mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
    };
  }, []);

  // 2. Tải lịch sử luyện nói đã lưu từ MongoDB (chỉ dành cho Paid user)
  useEffect(() => {
    const loadSpeakingHistory = async () => {
      if (isPaidUser && testId) {
        try {
          const res = await axiosInstance.get(`/tests/speaking-${testId}/user-answers`);
          const data = res.data || res;
          if (data?.result?.answers) {
            const historyMap = {};
            data.result.answers.forEach((ans) => {
              historyMap[ans.number] = {
                number: ans.number,
                answer: ans.answer,
                isCorrect: ans.isCorrect,
                part: ans.part,
              };
            });
            setSessionAnswers(historyMap);
            // Khôi phục transcript câu đầu tiên nếu đã từng trả lời
            const firstQAns = historyMap[1];
            if (firstQAns && currentIndex === 0) {
              setTranscript(firstQAns.answer || "");
              setIsGraded(false);
            }
          }
        } catch {
          console.log("Chưa có lịch sử làm bài Speaking trước đó.");
        }
      }
    };
    loadSpeakingHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, testId]);

  // 3. Reset trạng thái khi chuyển câu hỏi
  useEffect(() => {
    stopRecording();
    clearInterval(timerRef.current);
    setTimerMode(null);
    setTimeLeft(null);

    const prevAnswer = sessionAnswers[currentQuestion.id];
    if (prevAnswer) {
      setTranscript(prevAnswer.answer || "");
      setInterim("");
      setAudioUrl(null);
      setAiResult(null);
      setIsGraded(false);
    } else {
      setTranscript("");
      setInterim("");
      setAudioUrl(null);
      setAiResult(null);
      setIsGraded(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Timer countdown
  const startTimer = (seconds, mode) => {
    clearInterval(timerRef.current);
    setTimeLeft(seconds);
    setTimerMode(mode);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerMode(null);
          if (mode === "prep") {
            // Hết giờ chuẩn bị → tự bắt đầu ghi âm
            startRecording();
          } else {
            // Hết giờ response → tự dừng
            stopRecording();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = async () => {
    setTranscript("");
    setInterim("");
    setAudioUrl(null);
    setAiResult(null);
    setIsGraded(false);

    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { setIsSupported(false); return; }
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      rec.onresult = (event) => {
        let finalTrans = "";
        let interimTrans = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) finalTrans += event.results[i][0].transcript;
          else interimTrans += event.results[i][0].transcript;
        }
        if (finalTrans) setTranscript((prev) => prev + (prev ? " " : "") + finalTrans);
        setInterim(interimTrans);
      };
      rec.onerror = (e) => {
        console.error("Speech recognition error", e.error);
        if (e.error === "not-allowed") {
          alert("Không thể truy cập Micro. Vui lòng cấp quyền trong cài đặt trình duyệt.");
          setIsListening(false);
        }
      };
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
      setIsListening(true);

      let options = {};
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) options = { mimeType: "audio/webm;codecs=opus" };
      else if (MediaRecorder.isTypeSupported("audio/webm")) options = { mimeType: "audio/webm" };
      else if (MediaRecorder.isTypeSupported("audio/mp4")) options = { mimeType: "audio/mp4" };

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType || "audio/webm" });
        setAudioUrl(URL.createObjectURL(audioBlob));
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();

      // Bắt đầu đếm ngược thời gian response
      if (currentQuestion.responseTime > 0) {
        startTimer(currentQuestion.responseTime, "response");
      }
    } catch (err) {
      console.error("Microphone access error", err);
      alert("Không thể truy cập thiết bị Micro. Hãy kiểm tra kết nối và quyền của trình duyệt.");
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive")
      mediaRecorderRef.current.stop();
    setIsListening(false);
    clearInterval(timerRef.current);
    setTimerMode(null);
    setTimeLeft(null);
  };

  const toggleMic = () => {
    if (isListening) stopRecording();
    else startRecording();
  };

  const handlePrepTimer = () => {
    if (currentQuestion.prepTime > 0) {
      startTimer(currentQuestion.prepTime, "prep");
    } else {
      startRecording();
    }
  };

  const handleGrade = async () => {
    if (isListening) stopRecording();
    const spoken = (transcript + (interim ? " " + interim : "")).trim();
    if (!spoken) {
      alert("Bạn chưa nói gì cả! Hãy nhấn nút Micro và đọc to câu mẫu trước.");
      return;
    }

    setIsGradingAI(true);
    setAiResult(null);
    setIsGraded(false);

    try {
      // Gọi BE endpoint → Groq AI chấm điểm
      const response = await axiosInstance.post("/speaking/grade", {
        testId: testId || "speaking-standalone",
        testName: `TOEIC Speaking Test ${testId || ""}`.trim(),
        questionId: currentQuestion.id,
        partNumber: currentQuestion.partNumber,
        partTitle: currentPart?.title || `Part ${currentQuestion.partNumber}`,
        prompt: currentQuestion.prompt,
        targetText: currentQuestion.targetText,
        question: currentQuestion.question,
        context: currentQuestion.context,
        scheduleInfo: currentQuestion.scheduleInfo,
        topic: currentQuestion.topic,
        transcript: spoken,
      });

      const markdown = response?.result?.rawMarkdown || response?.rawMarkdown || "Không nhận được phản hồi từ AI.";
      setAiResult(markdown);
      setIsGraded(true);

      // Lưu sessionAnswers để đánh dấu đã trả lời (không dùng score nữa)
      const partNum = currentQuestion.partNumber;
      const updatedAnswers = {
        ...sessionAnswers,
        [currentQuestion.id]: {
          number: currentQuestion.id,
          answer: spoken,
          isCorrect: true,   // placeholder, AI không trả số
          part: partNum,
        },
      };
      setSessionAnswers(updatedAnswers);

      // Lưu lịch sử vào MongoDB nếu là paid user
      if (isPaidUser && testId) {
        try {
          const answersPayload = Object.values(updatedAnswers).map((item) => ({
            number: item.number,
            answer: item.answer,
            isCorrect: item.isCorrect,
            part: item.part,
          }));
          await axiosInstance.post(`/tests/speaking-${testId}`, {
            answers: answersPayload,
            mark: 0,
            rightAnswerNumber: 0,
          });
        } catch (dbErr) {
          console.error("Lỗi khi lưu lịch sử:", dbErr);
        }
      }
    } catch (err) {
      console.error("AI grading error:", err);
      setAiResult("❌ Không thể kết nối AI chấm điểm. Vui lòng thử lại.");
      setIsGraded(true);
    } finally {
      setIsGradingAI(false);
    }
  };

  const handleClear = () => {
    setTranscript(""); setInterim(""); setAudioUrl(null);
    setAiResult(null); setIsGraded(false);
    const newAnswers = { ...sessionAnswers };
    delete newAnswers[currentQuestion.id];
    setSessionAnswers(newAnswers);
  };



  // Màu sắc progress timer
  const timerColor = timeLeft <= 10 ? "#ef4444" : timeLeft <= 20 ? "#f59e0b" : "#10b981";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

        .sp-root { font-family: 'Sora', sans-serif; background: #0d0f14; color: #e2e4ef; min-height: 100vh; display: flex; flex-direction: column; }

        /* ── Topbar ─────────────────────────────────────────────────────── */
        .sp-topbar { background: #13151d; border-bottom: 1px solid #1e2130; padding: 0 2rem; height: 60px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; }
        .sp-logo { font-size: 1.1rem; font-weight: 700; color: #fff; text-decoration: none; cursor: pointer; }
        .sp-logo span { color: #f43f5e; }
        .sp-back-btn { display: flex; align-items: center; gap: 0.5rem; background: transparent; border: 1px solid #252840; border-radius: 8px; color: #a5a8c4; padding: 0.4rem 1rem; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .sp-back-btn:hover { background: #1a1d2a; border-color: #f43f5e; color: #f43f5e; }

        /* ── Layout ─────────────────────────────────────────────────────── */
        .sp-layout { display: flex; flex: 1; max-height: calc(100vh - 60px); overflow: hidden; }
        .sp-sidebar { width: 240px; background: #10121a; border-right: 1px solid #1e2130; padding: 1.2rem 0.8rem; display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; }
        
        /* ── Sidebar Parts & Questions ──────────────────────────────────── */
        .sp-part-group { margin-bottom: 0.5rem; }
        .sp-part-header { font-size: 0.68rem; font-weight: 700; color: #5c5f7a; text-transform: uppercase; letter-spacing: 0.08em; padding: 0.4rem 0.5rem; display: flex; align-items: center; gap: 0.4rem; }
        .sp-part-header .ph-icon { font-size: 0.9rem; }
        .sp-qitem { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.75rem; border-radius: 8px; cursor: pointer; border: 1px solid transparent; transition: all 0.18s; background: #161824; margin-bottom: 0.3rem; }
        .sp-qitem:hover { background: #1c1e30; border-color: #2e324e; }
        .sp-qitem.active { background: #281922; border-color: #f43f5e55; color: #fda4af; }
        .sp-qitem.answered { border-color: #10b98133; }
        .sp-qidx { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; background: #222538; color: #8f92b2; flex-shrink: 0; }
        .sp-qitem.active .sp-qidx { background: #f43f5e; color: #fff; }
        .sp-qitem.answered .sp-qidx { background: #10b981; color: #fff; }
        .sp-qlabel { font-size: 0.76rem; font-weight: 500; flex: 1; }
        .sp-lock-icon { font-size: 0.75rem; color: #f43f5e88; }

        /* ── Main Content ───────────────────────────────────────────────── */
        .sp-content { flex: 1; padding: 1.75rem; overflow-y: auto; display: flex; flex-direction: column; gap: 1.25rem; }
        .sp-warning { background: #2c0e13; border: 1px solid #991b1b; border-radius: 12px; padding: 0.9rem 1rem; color: #fca5a5; font-size: 0.85rem; display: flex; gap: 0.75rem; align-items: center; }

        /* ── Cards ──────────────────────────────────────────────────────── */
        .sp-card { background: #13151d; border: 1px solid #1e2130; border-radius: 16px; padding: 1.5rem; }
        .sp-prompt-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; padding-bottom: 0.75rem; border-bottom: 1px solid #1e2130; flex-wrap: wrap; gap: 0.5rem; }
        .sp-part-badge { background: #2e1a22; border: 1px solid #f43f5e55; color: #fda4af; font-size: 0.68rem; font-weight: 600; padding: 0.22rem 0.7rem; border-radius: 99px; text-transform: uppercase; }
        .sp-prompt-text { font-size: 0.85rem; color: #a5a8c4; line-height: 1.65; margin-bottom: 0.75rem; }

        /* ── Context / Schedule Info ────────────────────────────────────── */
        .sp-context-box { background: #111420; border-left: 3px solid #6366f1; padding: 0.75rem 1rem; border-radius: 0 8px 8px 0; margin-bottom: 0.75rem; font-size: 0.82rem; color: #a5a8c4; font-style: italic; }
        .sp-schedule-box { background: #0e1020; border: 1px solid #2e324e; padding: 1rem; border-radius: 10px; margin-bottom: 0.75rem; font-size: 0.78rem; color: #c5c8e0; font-family: 'JetBrains Mono', monospace; line-height: 1.8; white-space: pre-wrap; }
        .sp-question-box { background: #1a1b26; border-left: 4px solid #6366f1; padding: 0.85rem 1rem; border-radius: 0 8px 8px 0; margin-bottom: 0.75rem; font-size: 0.92rem; font-weight: 600; color: #a5b4fc; line-height: 1.5; }
        .sp-topic-box { background: #1a1b26; border-left: 4px solid #f43f5e; padding: 1rem; border-radius: 0 8px 8px 0; margin-bottom: 0.75rem; font-size: 0.92rem; font-weight: 500; line-height: 1.5; color: #e2e4ef; }
        .sp-image-container { display: flex; justify-content: center; margin-bottom: 0.9rem; }
        .sp-image { max-width: 100%; max-height: 240px; border-radius: 12px; border: 1px solid #1e2130; object-fit: cover; }

        /* ── Target Text ────────────────────────────────────────────────── */
        .sp-target-title { font-size: 0.72rem; font-weight: 600; color: #f43f5e; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.45rem; display: flex; align-items: center; gap: 0.4rem; }
        .sp-target-text { font-size: 1.05rem; font-weight: 400; line-height: 1.75; color: #fff; background: #090a0f; padding: 1.1rem; border-radius: 12px; border: 1px solid #1e2130; }

        /* ── Timers ─────────────────────────────────────────────────────── */
        .sp-timer-bar { display: flex; align-items: center; gap: 1rem; background: #13151d; border: 1px solid #1e2130; border-radius: 12px; padding: 0.75rem 1.25rem; }
        .sp-timer-label { font-size: 0.78rem; font-weight: 600; color: #a5a8c4; text-transform: uppercase; letter-spacing: 0.05em; flex: 1; }
        .sp-timer-value { font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; font-weight: 700; min-width: 3.5rem; text-align: right; transition: color 0.3s; }
        .sp-prep-btn { font-family: 'Sora', sans-serif; font-size: 0.82rem; font-weight: 600; border-radius: 8px; padding: 0.5rem 1.25rem; cursor: pointer; border: 1px solid #6366f155; background: #1e1f33; color: #a5b4fc; transition: all 0.15s; }
        .sp-prep-btn:hover { background: #2a2b45; border-color: #818cf8; color: #fff; }

        /* ── Recording Panel ────────────────────────────────────────────── */
        .sp-recording-panel { background: #13151d; border: 1px solid #1e2130; border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1.1rem; }
        .sp-mic-outer { width: 76px; height: 76px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s ease; position: relative; }
        .sp-mic-outer.idle { background: #1a1d2a; border: 2px solid #252840; color: #a5a8c4; }
        .sp-mic-outer.idle:hover { border-color: #f43f5e; color: #fff; transform: scale(1.05); }
        .sp-mic-outer.active { background: #ef4444; color: #fff; box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); animation: pulseRecord 1.5s infinite; }
        @keyframes pulseRecord { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 70% { box-shadow: 0 0 0 15px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
        .sp-rec-label { font-size: 0.83rem; font-weight: 600; color: #a5a8c4; }
        .sp-rec-label.listening { color: #ef4444; }
        .sp-transcript-container { width: 100%; min-height: 75px; background: #090a0f; border: 1px dashed #252840; border-radius: 12px; padding: 0.9rem; font-size: 0.92rem; line-height: 1.6; }
        .sp-transcript-placeholder { color: #4e526d; font-style: italic; }
        .sp-transcript-text { color: #e2e4ef; }
        .sp-interim-text { color: #f43f5e88; font-style: italic; }
        .sp-controls-row { display: flex; gap: 0.75rem; width: 100%; justify-content: center; flex-wrap: wrap; }
        .sp-action-btn { font-family: 'Sora', sans-serif; font-size: 0.83rem; font-weight: 600; border-radius: 10px; padding: 0.6rem 1.4rem; cursor: pointer; border: none; transition: all 0.15s; display: flex; align-items: center; gap: 0.45rem; }
        .sp-btn-primary { background: linear-gradient(135deg, #f43f5e, #e11d48); color: #fff; box-shadow: 0 4px 12px rgba(244,63,94,0.2); }
        .sp-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .sp-btn-secondary { background: #1a1d2a; border: 1px solid #252840; color: #a5a8c4; }
        .sp-btn-secondary:hover { border-color: #fda4af; color: #fff; }
        .sp-action-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

        /* ── Audio Player ───────────────────────────────────────────────── */
        .sp-audio-card { width: 100%; display: flex; align-items: center; justify-content: space-between; background: #1e1f29; padding: 0.65rem 1.1rem; border-radius: 10px; border: 1px solid #2e3046; }
        .sp-audio-label { font-size: 0.76rem; font-weight: 500; color: #a5a8c4; display: flex; align-items: center; gap: 0.5rem; }
        .sp-audio-player { height: 30px; outline: none; flex: 1; margin-left: 0.75rem; }

        /* ── Score Result ───────────────────────────────────────────────── */
        .sp-results-card { background: #13151d; border: 2px solid #22c55e33; border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1.35rem; animation: fadeUp 0.3s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .sp-results-header { display: flex; flex-direction: column; gap: 1.25rem; align-items: center; }
        @media (min-width: 700px) { .sp-results-header { flex-direction: row; } }
        .sp-score-circle-container { position: relative; width: 105px; height: 105px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sp-score-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
        .sp-score-bg { fill: none; stroke: #1e2130; stroke-width: 8; }
        .sp-score-fill { fill: none; stroke: url(#scoreGrad); stroke-width: 8; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
        .sp-score-text { position: absolute; font-family: 'JetBrains Mono', monospace; font-size: 1.7rem; font-weight: 700; color: #fff; display: flex; flex-direction: column; align-items: center; line-height: 1; }
        .sp-score-percent { font-size: 0.72rem; color: #5c5f7a; margin-top: 0.15rem; font-family: 'Sora', sans-serif; font-weight: 500; }
        .sp-score-info { flex: 1; }
        .sp-score-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.3rem; }
        .sp-score-desc { font-size: 0.85rem; color: #a5a8c4; line-height: 1.5; }
        .sp-words-aligned-box { background: #090a0f; border: 1px solid #1e2130; border-radius: 12px; padding: 1.1rem; }
        .sp-words-aligned-title { font-size: 0.7rem; font-weight: 600; color: #5c5f7a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.65rem; }
        .sp-words-flex { display: flex; flex-wrap: wrap; gap: 0.4rem 0.65rem; font-size: 1.05rem; line-height: 2; }
        .sp-word { padding: 0.1rem 0.4rem; border-radius: 6px; font-weight: 500; display: inline-block; }
        .sp-word.correct { color: #10b981; background: rgba(16,185,129,0.1); border-bottom: 2px solid #10b981; }
        .sp-word.missing { color: #f43f5e; background: rgba(244,63,94,0.1); border-bottom: 2px dashed #f43f5e; text-decoration: line-through; }
        .sp-word.extra { color: #f59e0b; background: rgba(245,158,11,0.1); border-bottom: 2px dotted #f59e0b; font-style: italic; }
        .sp-legend { display: flex; gap: 0.85rem; flex-wrap: wrap; margin-top: 0.85rem; border-top: 1px solid #1e2130; padding-top: 0.75rem; }
        .sp-legend-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.73rem; color: #8f92b2; }
        .sp-dot { width: 8px; height: 8px; border-radius: 50%; }
        .sp-dot.correct { background: #10b981; }
        .sp-dot.missing { background: #f43f5e; }
        .sp-dot.extra { background: #f59e0b; }

        /* ── Footer Nav ─────────────────────────────────────────────────── */
        .sp-footer-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 0.75rem; }

        /* ── Premium Lock Screen ────────────────────────────────────────── */
        .sp-premium-lock { text-align: center; padding: 4rem 2rem; background: linear-gradient(135deg, #201318, #0e1017); border: 1px solid rgba(244,63,94,0.25); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.35rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .sp-lock-icon-wrap { width: 76px; height: 76px; border-radius: 50%; background: rgba(244,63,94,0.1); border: 1.5px solid rgba(244,63,94,0.4); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #f43f5e; box-shadow: 0 0 20px rgba(244,63,94,0.15); }

        /* ── AI Result Card ─────────────────────────────────────────────── */
        .sp-ai-card { background: linear-gradient(135deg, #0f1729 0%, #131524 100%); border: 1px solid #6366f133; border-radius: 18px; padding: 1.6rem; display: flex; flex-direction: column; gap: 1rem; animation: fadeUp 0.35s ease both; }
        .sp-ai-header { display: flex; align-items: center; gap: 0.65rem; padding-bottom: 0.85rem; border-bottom: 1px solid #1e2235; }
        .sp-ai-header-icon { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #6366f1, #818cf8); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sp-ai-title { font-size: 0.95rem; font-weight: 700; color: #e0e4ff; }
        .sp-ai-subtitle { font-size: 0.72rem; color: #6366f1; font-weight: 500; }
        .sp-ai-body { font-size: 0.87rem; color: #d1d5f0; line-height: 1.75; }
        .sp-ai-body h2 { font-size: 1rem; font-weight: 700; color: #a5b4fc; margin: 1.1rem 0 0.5rem; border-bottom: 1px solid #2e3257; padding-bottom: 0.35rem; }
        .sp-ai-body h3 { font-size: 0.88rem; font-weight: 700; color: #c7d2fe; margin: 0.9rem 0 0.4rem; }
        .sp-ai-body p { margin: 0.35rem 0; }
        .sp-ai-body ul, .sp-ai-body ol { padding-left: 1.4rem; margin: 0.35rem 0; }
        .sp-ai-body li { margin: 0.2rem 0; }
        .sp-ai-body strong { color: #e0e4ff; font-weight: 600; }
        .sp-ai-body em { color: #a5b4fc; font-style: italic; }
        .sp-ai-body code { background: #0d0f1a; border: 1px solid #2e3257; border-radius: 4px; padding: 0.1rem 0.4rem; font-family: 'JetBrains Mono', monospace; font-size: 0.83rem; color: #86efac; }
        .sp-ai-body blockquote { border-left: 3px solid #6366f1; padding: 0.6rem 1rem; background: #111428; border-radius: 0 8px 8px 0; margin: 0.75rem 0; color: #a5b4fc; }
        .sp-ai-body hr { border: none; border-top: 1px solid #1e2235; margin: 0.85rem 0; }
        .sp-ai-loading { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem 0; color: #6366f1; font-size: 0.87rem; font-weight: 500; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sp-spin { animation: spin 1s linear infinite; }
      `}</style>

      <div className="sp-root">
        {/* ── Topbar ── */}
        <div className="sp-topbar">
          <span className="sp-logo" onClick={() => navigate("/toeic-home/speaking-test")}>
            TOEIC <span>Speaking</span>
          </span>
          <button className="sp-back-btn" onClick={() => navigate("/toeic-home/speaking-test")}>
            ← Danh sách đề
          </button>
        </div>

        <div className="sp-layout">
          {/* ── Sidebar ── */}
          <div className="sp-sidebar">
            {PARTS.map((part) => (
              <div key={part.partNumber} className="sp-part-group">
                <div className="sp-part-header">
                  <span className="ph-icon">{part.icon}</span>
                  <span>Part {part.partNumber}</span>
                </div>
                {part.questionIds.map((qId) => {
                  const idx = QUESTIONS.findIndex((q) => q.id === qId);
                  const isLocked = part.isPremium && !isPaidUser;
                  const isAnswered = !!sessionAnswers[qId];
                  return (
                    <div
                      key={qId}
                      className={`sp-qitem ${currentIndex === idx ? "active" : ""} ${isAnswered ? "answered" : ""}`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      <div className="sp-qidx">{qId}</div>
                      <span className="sp-qlabel">Câu {qId}</span>
                      {isLocked && <span className="sp-lock-icon">🔒</span>}
                      {isAnswered && !isLocked && (
                        <span style={{ fontSize: "0.7rem", color: "#10b981" }}>✓</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* ── Main Content Area ── */}
          <div className="sp-content">
            {/* Browser warning */}
            {!isSupported && (
              <div className="sp-warning">
                <MicOff className="w-5 h-5 flex-shrink-0" />
                <div>
                  <strong>Trình duyệt không hỗ trợ Web Speech API.</strong> Vui lòng dùng{" "}
                  <strong>Google Chrome, Microsoft Edge, hoặc Safari</strong>.
                </div>
              </div>
            )}

            {/* Premium Lock Screen */}
            {isCurrentPremium ? (
              <div className="sp-premium-lock">
                <div className="sp-lock-icon-wrap">🔒</div>
                <div>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.65rem" }}>
                    Tính năng Premium Độc Quyền
                  </h3>
                  <p style={{ color: "#a5a8c4", fontSize: "0.9rem", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                    <strong style={{ color: "#fda4af" }}>{currentPart?.title}</strong> và các phần thi nâng cao chỉ mở
                    khóa cho thành viên đã đăng ký bất kỳ khóa học nào tại DTT TOEIC. Lịch sử luyện nói của bạn cũng
                    được tự động lưu trữ và đồng bộ trên MongoDB.
                  </p>
                </div>
                <button
                  className="sp-action-btn sp-btn-primary"
                  onClick={() => navigate("/toeic-home/all-course")}
                  style={{ padding: "0.8rem 2.5rem", fontSize: "0.9rem" }}
                >
                  Mua khóa học ngay →
                </button>
              </div>
            ) : (
              <>
                {/* ── Question Card ── */}
                <div className="sp-card">
                  <div className="sp-prompt-header">
                    <span className="sp-part-badge">
                      {currentPart?.icon} {currentPart?.title}
                    </span>
                    <span style={{ fontSize: "0.76rem", color: "#5c5f7a", fontWeight: 600 }}>
                      CÂU {currentQuestion.id} / {QUESTIONS.length}
                    </span>
                  </div>

                  <p className="sp-prompt-text">{currentQuestion.prompt}</p>

                  {/* Part 2: Image */}
                  {currentQuestion.imageUrl && (
                    <div className="sp-image-container">
                      <img src={currentQuestion.imageUrl} alt={`Question ${currentQuestion.id}`} className="sp-image" />
                    </div>
                  )}

                  {/* Part 3/4: Context */}
                  {currentQuestion.context && (
                    <div className="sp-context-box">
                      <strong>Tình huống:</strong> {currentQuestion.context}
                    </div>
                  )}

                  {/* Part 4: Schedule table */}
                  {currentQuestion.scheduleInfo && (
                    <div className="sp-schedule-box">{currentQuestion.scheduleInfo}</div>
                  )}

                  {/* Part 3/4: Question */}
                  {currentQuestion.question && (
                    <div className="sp-question-box">❓ {currentQuestion.question}</div>
                  )}

                  {/* Part 5: Topic */}
                  {currentQuestion.topic && (
                    <div className="sp-topic-box">{currentQuestion.topic}</div>
                  )}

                  {/* Sample Answer */}
                  <div>
                    <h6 className="sp-target-title">
                      <Volume2 className="w-4 h-4" />
                      {currentQuestion.partNumber === 1 ? "Đoạn văn cần đọc to" : "Câu trả lời mẫu tham khảo"}
                    </h6>
                    <div className="sp-target-text">{currentQuestion.targetText}</div>
                  </div>
                </div>

                {/* ── Timer Bar ── */}
                {!isListening && timerMode === null && (
                  <div className="sp-timer-bar">
                    <div className="sp-timer-label">
                      {currentQuestion.prepTime > 0
                        ? `⏱ Bấm để bắt đầu chuẩn bị (${currentQuestion.prepTime}s) → Ghi âm (${currentQuestion.responseTime}s)`
                        : `⏱ Bấm để bắt đầu ghi âm (${currentQuestion.responseTime}s)`}
                    </div>
                    <button className="sp-prep-btn" onClick={handlePrepTimer}>
                      Bắt đầu
                    </button>
                  </div>
                )}
                {timerMode !== null && timeLeft !== null && (
                  <div className="sp-timer-bar">
                    <div className="sp-timer-label">
                      {timerMode === "prep" ? "⏳ Thời gian chuẩn bị" : "🎙️ Thời gian trả lời"}
                    </div>
                    <div className="sp-timer-value" style={{ color: timerColor }}>
                      {timeLeft}s
                    </div>
                  </div>
                )}

                {/* ── Recording Panel ── */}
                <div className="sp-recording-panel">
                  <div
                    className={`sp-mic-outer ${isListening ? "active" : "idle"}`}
                    onClick={toggleMic}
                    title={isListening ? "Click để dừng ghi âm" : "Click để bắt đầu ghi âm"}
                  >
                    {isListening ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
                  </div>

                  <div className={`sp-rec-label ${isListening ? "listening" : ""}`}>
                    {isListening ? "Đang lắng nghe... Hãy đọc to câu mẫu trên" : "Nhấn nút để bắt đầu ghi âm"}
                  </div>

                  {/* Transcript Box */}
                  <div className="sp-transcript-container">
                    <div className="sp-words-aligned-title">Kết quả Speech-to-Text</div>
                    {!transcript && !interim ? (
                      <span className="sp-transcript-placeholder">
                        Giọng nói của bạn sau khi chuyển thành văn bản tiếng Anh sẽ xuất hiện ở đây...
                      </span>
                    ) : (
                      <p className="sp-transcript-text">
                        {transcript}
                        {interim && <span className="sp-interim-text"> {interim}</span>}
                      </p>
                    )}
                  </div>

                  {/* Audio Playback — key={audioUrl} ép trình duyệt tải lại Blob mới */}
                  {audioUrl && (
                    <div className="sp-audio-card">
                      <div className="sp-audio-label">
                        <Play className="w-4 h-4 text-rose-500" />
                        Nghe lại giọng của bạn:
                      </div>
                      <audio key={audioUrl} src={audioUrl} controls className="sp-audio-player" />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="sp-controls-row">
                    <button
                      className="sp-action-btn sp-btn-primary"
                      onClick={handleGrade}
                      disabled={isGradingAI || (isListening ? false : !transcript && !interim)}
                    >
                      {isGradingAI
                        ? <><Loader2 className="w-4 h-4 sp-spin" /> Đang chấm điểm AI...</>
                        : <><Award className="w-4 h-4" /> Chấm điểm phát âm</>}
                    </button>
                    <button
                      className="sp-action-btn sp-btn-secondary"
                      onClick={handleClear}
                      disabled={isGradingAI || (!transcript && !interim && !audioUrl && !isGraded)}
                    >
                      <RefreshCw className="w-4 h-4" /> Làm mới
                    </button>
                  </div>
                </div>

                {/* ── AI Score Results ── */}
                {isGradingAI && (
                  <div className="sp-ai-card">
                    <div className="sp-ai-loading">
                      <Loader2 className="w-8 h-8 sp-spin" />
                      <span>AI đang phân tích bài nói của bạn...</span>
                      <span style={{ fontSize: "0.75rem", color: "#4e526d" }}>Groq · Llama 3.3 70B · Tiêu chí IELTS Speaking</span>
                    </div>
                  </div>
                )}
                {isGraded && aiResult && (
                  <div className="sp-ai-card">
                    <div className="sp-ai-header">
                      <div className="sp-ai-header-icon">
                        <Bot size={18} color="#fff" />
                      </div>
                      <div>
                        <div className="sp-ai-title">Kết quả chấm điểm AI</div>
                        <div className="sp-ai-subtitle">Groq · Llama 3.3 70B · Chuẩn IELTS Speaking</div>
                      </div>
                    </div>
                    <div className="sp-ai-body">
                      <MarkdownRenderer content={aiResult} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Footer Navigation ── */}
            <div className="sp-footer-nav">
              <button
                className="sp-action-btn sp-btn-secondary"
                onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" /> Câu trước
              </button>
              <span style={{ fontSize: "0.83rem", color: "#5c5f7a", fontWeight: 600 }}>
                Câu {currentIndex + 1} / {QUESTIONS.length}
              </span>
              <button
                className="sp-action-btn sp-btn-secondary"
                onClick={() => setCurrentIndex((idx) => Math.min(QUESTIONS.length - 1, idx + 1))}
                disabled={currentIndex === QUESTIONS.length - 1}
              >
                Câu sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
