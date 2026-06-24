import React, { useState, useEffect } from "react";
import { MessageSquare, BookOpen, Clock } from "lucide-react";
import { getMyStudents } from "@/api/chatApi";
import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/chat/ChatWindow";

// Skeleton
const StudentListSkeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 16px",
          background: "#f8fafc",
          borderRadius: 12,
          animation: "pulse 1.5s infinite",
        }}
      >
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#e2e8f0" }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, background: "#e2e8f0", borderRadius: 8, width: "55%", marginBottom: 8 }} />
          <div style={{ height: 11, background: "#f1f5f9", borderRadius: 8, width: "75%" }} />
        </div>
      </div>
    ))}
  </div>
);

const InstructorMessagesTab = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchText, setSearchText] = useState("");

  const { notifications } = useChat(null);

  useEffect(() => {
    setIsLoading(true);
    getMyStudents()
      .then((data) => setStudents(data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    // Reset unread count local
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === student.studentId ? { ...s, unreadCount: 0 } : s
      )
    );
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
    if (diffHours < 24) return `${diffHours}g`;
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchText.toLowerCase()) ||
    s.classes?.some((c) => c.classCode.toLowerCase().includes(searchText.toLowerCase()))
  );

  const totalUnread = students.reduce((sum, s) => sum + (s.unreadCount || 0), 0);

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 200px)",
        minHeight: 500,
        gap: 0,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        background: "#fff",
        border: "1px solid #e2e8f0",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>

      {/* ── Left: Danh sách học sinh ── */}
      <div
        style={{
          width: 300,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #f1f5f9",
          background: "#fafbff",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 16px 12px",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <MessageSquare size={20} style={{ color: "#4F46E5" }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: "#1e293b" }}>
              Học viên nhắn tin
            </span>
            {totalUnread > 0 && (
              <span
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "1px 8px",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {totalUnread}
              </span>
            )}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Tìm học viên, lớp..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "100%",
              border: "1.5px solid #e2e8f0",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4F46E5")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        {/* Student list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
          {isLoading ? (
            <StudentListSkeleton />
          ) : filteredStudents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 16px", color: "#94a3b8" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>👨‍🎓</div>
              <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 4 }}>
                {searchText ? "Không tìm thấy" : "Chưa có học viên"}
              </div>
              <div style={{ fontSize: 12 }}>
                {searchText ? "Thử tìm với từ khóa khác" : "Học viên sẽ xuất hiện khi nhắn tin"}
              </div>
            </div>
          ) : (
            filteredStudents.map((student) => {
              const isSelected = selectedStudent?.studentId === student.studentId;
              const hasNotif = notifications.some((n) => n.roomId === student.roomId);

              return (
                <div
                  key={student.studentId}
                  onClick={() => handleSelectStudent(student)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    cursor: "pointer",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(124,58,237,0.07) 100%)"
                      : hasNotif
                      ? "rgba(239,68,68,0.05)"
                      : "transparent",
                    border: isSelected ? "1.5px solid rgba(79,70,229,0.25)" : "1.5px solid transparent",
                    marginBottom: 4,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      e.currentTarget.style.background = hasNotif ? "rgba(239,68,68,0.05)" : "transparent";
                  }}
                >
                  <img
                    src={student.avatar || "https://res.cloudinary.com/dfinxo4uj/image/upload/v1761221144/default_avatar_gidgqw.png"}
                    alt={student.name}
                    style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
                        {student.name}
                      </span>
                      <span style={{ fontSize: 10, color: "#94a3b8", flexShrink: 0 }}>
                        {formatLastTime(student.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 3, marginTop: 2, flexWrap: "wrap" }}>
                      {student.classes?.slice(0, 2).map((cls, i) => (
                        <span
                          key={i}
                          style={{
                            background: "rgba(79,70,229,0.08)",
                            color: "#4F46E5",
                            borderRadius: 5,
                            padding: "0 6px",
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          {cls.classCode}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {student.lastMessage?.content || "Chưa có tin nhắn"}
                    </div>
                  </div>

                  {(student.unreadCount > 0 || hasNotif) && (
                    <span
                      style={{
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: 10,
                        padding: "1px 7px",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {student.unreadCount || "●"}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer stats */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#94a3b8",
            fontSize: 12,
          }}
        >
          <BookOpen size={14} />
          <span>{students.length} học viên từ các lớp của bạn</span>
        </div>
      </div>

      {/* ── Right: Chat Window ── */}
      <div style={{ flex: 1, display: "flex", minWidth: 0 }}>
        {selectedStudent ? (
          <div style={{ animation: "fadeIn 0.25s ease", width: "100%", display: "flex" }}>
            <ChatWindow
              roomId={selectedStudent.roomId}
              receiver={{
                id: selectedStudent.studentId,
                name: selectedStudent.name,
                avatar: selectedStudent.avatar,
              }}
              onClose={() => setSelectedStudent(null)}
              isMobile={false}
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
              gap: 14,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(79,70,229,0.1) 0%, rgba(124,58,237,0.1) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageSquare size={32} style={{ color: "#4F46E5" }} />
            </div>
            <div style={{ fontWeight: 600, color: "#64748b", fontSize: 15 }}>
              Chọn học viên để xem tin nhắn
            </div>
            <div style={{ fontSize: 13, textAlign: "center", maxWidth: 260 }}>
              Trả lời câu hỏi và hỗ trợ học viên của bạn ngay tại đây
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorMessagesTab;
