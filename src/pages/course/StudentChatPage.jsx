import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ChevronRight, BookOpen, Users, ArrowLeft } from "lucide-react";
import { getMyInstructors } from "@/api/chatApi";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";

// Skeleton loading cho danh sách
const InstructorListSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "16px",
          background: "#fff",
          borderRadius: 14,
          animation: "pulse 1.5s infinite",
        }}
      >
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#e2e8f0" }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 16, background: "#e2e8f0", borderRadius: 8, width: "60%", marginBottom: 8 }} />
          <div style={{ height: 12, background: "#f1f5f9", borderRadius: 8, width: "80%" }} />
        </div>
      </div>
    ))}
  </div>
);

const StudentChatPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isMobileChat, setIsMobileChat] = useState(false);
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.login?.currentUser);
  const { notifications } = useChat(null); // Lắng nghe notifications toàn cục

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setIsMobileChat(isMobile);

    const handleResize = () => setIsMobileChat(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getMyInstructors()
      .then((data) => setInstructors(data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectInstructor = (instructor) => {
    setSelectedInstructor(instructor);
    // Xóa unread badge local
    setInstructors((prev) =>
      prev.map((i) =>
        i.instructorId === instructor.instructorId ? { ...i, unreadCount: 0 } : i
      )
    );
  };

  const handleCloseChat = () => {
    setSelectedInstructor(null);
  };

  const formatLastTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ`;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  // Đếm tổng unread
  const totalUnread = instructors.reduce((sum, i) => sum + (i.unreadCount || 0), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          gap: 0,
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          minHeight: 600,
          height: "80vh",
          maxHeight: 720,
        }}
      >
        {/* ── Left Panel: Danh sách giảng viên ── */}
        <div
          style={{
            width: selectedInstructor && isMobileChat ? "0" : isMobileChat ? "100%" : "340px",
            flexShrink: 0,
            display: selectedInstructor && isMobileChat ? "none" : "flex",
            flexDirection: "column",
            borderRight: "1px solid #f1f5f9",
            background: "#fafbff",
            overflow: "hidden",
            transition: "width 0.3s ease",
          }}
        >
          {/* Header left */}
          <div
            style={{
              padding: "20px 20px 16px",
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <button
                onClick={() => navigate("/my-schedule")}
                style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", padding: "5px 8px" }}
                title="Quay lại"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Tin nhắn</h1>
              {totalUnread > 0 && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    borderRadius: "12px",
                    padding: "2px 8px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  {totalUnread}
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Liên hệ giảng viên lớp học</p>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
            {isLoading ? (
              <InstructorListSkeleton />
            ) : instructors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
                <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                  Chưa đăng ký lớp nào
                </div>
                <div style={{ fontSize: 13 }}>
                  Đăng ký khóa học để chat với giảng viên
                </div>
              </div>
            ) : (
              instructors.map((instructor) => {
                const isSelected = selectedInstructor?.instructorId === instructor.instructorId;
                const hasNotif = notifications.some((n) => n.roomId === instructor.roomId);

                return (
                  <div
                    key={instructor.instructorId}
                    onClick={() => handleSelectInstructor(instructor)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      borderRadius: 12,
                      cursor: "pointer",
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(124,58,237,0.08) 100%)"
                        : hasNotif
                        ? "rgba(239,68,68,0.05)"
                        : "#fff",
                      border: isSelected ? "1.5px solid rgba(79,70,229,0.3)" : "1.5px solid transparent",
                      marginBottom: 6,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = "#f1f5f9";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = hasNotif ? "rgba(239,68,68,0.05)" : "#fff";
                    }}
                  >
                    {/* Avatar */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img
                        src={instructor.avatar || "https://res.cloudinary.com/dfinxo4uj/image/upload/v1761221144/default_avatar_gidgqw.png"}
                        alt={instructor.name}
                        style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" }}>
                          {instructor.name}
                        </span>
                        <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0, marginLeft: 6 }}>
                          {formatLastTime(instructor.lastMessage?.createdAt)}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 3 }}>
                        {instructor.classes?.slice(0, 2).map((cls, i) => (
                          <span
                            key={i}
                            style={{
                              background: "rgba(79,70,229,0.1)",
                              color: "#4F46E5",
                              borderRadius: "6px",
                              padding: "1px 7px",
                              fontSize: 11,
                              fontWeight: 500,
                            }}
                          >
                            {cls.classCode}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {instructor.lastMessage?.content || "Chưa có tin nhắn"}
                      </div>
                    </div>

                    {/* Unread badge */}
                    {(instructor.unreadCount > 0 || hasNotif) && (
                      <span
                        style={{
                          background: "#ef4444",
                          color: "#fff",
                          borderRadius: "12px",
                          padding: "2px 7px",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {instructor.unreadCount || "●"}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Panel: Chat Window ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {selectedInstructor ? (
            <div style={{ animation: "slideIn 0.25s ease", height: "100%", display: "flex" }}>
              <ChatWindow
                roomId={selectedInstructor.roomId}
                receiver={{
                  id: selectedInstructor.instructorId,
                  name: selectedInstructor.name,
                  avatar: selectedInstructor.avatar,
                }}
                onClose={handleCloseChat}
                isMobile={isMobileChat}
              />
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(124,58,237,0.1) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageCircle size={36} style={{ color: "#4F46E5" }} />
              </div>
              <div style={{ fontWeight: 600, color: "#64748b", fontSize: 16 }}>
                Chọn giảng viên để nhắn tin
              </div>
              <div style={{ fontSize: 13, textAlign: "center", maxWidth: 280 }}>
                Nhắn tin trực tiếp với giảng viên của lớp học để hỏi bài, giải đáp thắc mắc
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentChatPage;
