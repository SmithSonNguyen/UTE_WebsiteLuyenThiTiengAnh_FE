import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Send, X, Wifi, WifiOff, ChevronLeft } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getChatMessages } from "@/api/chatApi";
import { useChat } from "@/hooks/useChat";

/**
 * Component giao diện chat kiểu Messenger
 * @param {object} props
 * @param {string} props.roomId - ID phòng chat
 * @param {object} props.receiver - Thông tin người nhận { id, name, avatar }
 * @param {function} props.onClose - Đóng cửa sổ chat
 * @param {boolean} props.isMobile - Responsive
 */
const ChatWindow = ({ roomId, receiver, onClose, isMobile = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const accessToken = useSelector((state) => state.auth.login?.accessToken);

  // Lấy currentUserId từ JWT token (vì currentUser chỉ là profile, không có _id)
  const currentUserId = (() => {
    try {
      if (!accessToken) return null;
      const decoded = jwtDecode(accessToken);
      return decoded.user_id || null;
    } catch {
      return null;
    }
  })();

  const { messages, setMessages, isConnected, sendMessage, markRead } = useChat(roomId);

  // Load lịch sử chat
  useEffect(() => {
    if (!roomId) return;
    setIsLoadingHistory(true);
    setPage(1);
    setHasMore(true);

    getChatMessages(roomId, 1, 30)
      .then((history) => {
        setMessages(history || []);
        setHasMore((history || []).length >= 30);
      })
      .catch(console.error)
      .finally(() => setIsLoadingHistory(false));

    // Đánh dấu đã đọc
    markRead(roomId);
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [roomId]);

  // Auto-scroll xuống dưới khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load thêm tin nhắn cũ (scroll lên trên)
  const loadMoreMessages = useCallback(async () => {
    if (!hasMore || isLoadingHistory) return;
    setIsLoadingHistory(true);
    const nextPage = page + 1;
    try {
      const older = await getChatMessages(roomId, nextPage, 30);
      if (older && older.length > 0) {
        setMessages((prev) => [...older, ...prev]);
        setPage(nextPage);
        setHasMore(older.length >= 30);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [hasMore, isLoadingHistory, page, roomId]);

  // Xử lý scroll lên trên để load thêm
  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (el && el.scrollTop < 80 && hasMore && !isLoadingHistory) {
      loadMoreMessages();
    }
  };

  // Gửi tin nhắn
  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isSending) return;
    setIsSending(true);
    sendMessage(receiver.id, inputValue);
    setInputValue("");
    setIsSending(false);
    inputRef.current?.focus();
  }, [inputValue, isSending, receiver?.id, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Format thời gian
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }) +
      " " + d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const isSentByMe = (msg) => {
    if (!currentUserId) return false;
    // senderId có thể là:
    // 1. Object đã populate: { _id: "...", profile: {...} }
    // 2. ObjectId thuần (từ socket emit): "686abc..."
    // 3. Object MongoDB ObjectId với .toString()
    const rawSenderId = msg.senderId;
    const senderIdStr =
      (rawSenderId?._id?.toString()) ||      // trường hợp 1
      (typeof rawSenderId === "string" ? rawSenderId : null) || // trường hợp 2
      (rawSenderId?.toString?.());            // trường hợp 3
    return senderIdStr === currentUserId;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "100dvh" : "600px",
        width: isMobile ? "100%" : "420px",
        background: "#fff",
        borderRadius: isMobile ? "0" : "16px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px 16px",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        {isMobile && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "4px" }}
          >
            <ChevronLeft size={22} />
          </button>
        )}
        {/* Avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={receiver?.avatar || "https://res.cloudinary.com/dfinxo4uj/image/upload/v1761221144/default_avatar_gidgqw.png"}
            alt={receiver?.name}
            style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)" }}
          />
          <span
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: isConnected ? "#22c55e" : "#94a3b8",
              border: "2px solid #4F46E5",
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {receiver?.name || "Người dùng"}
          </div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {isConnected ? "Đang hoạt động" : "Đang kết nối..."}
          </div>
        </div>
        {!isMobile && (
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", cursor: "pointer", borderRadius: "8px", padding: "6px" }}
            title="Đóng"
          >
            <X size={18} />
          </button>
        )}
        <span style={{ marginLeft: "auto", opacity: 0.7 }}>
          {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
        </span>
      </div>

      {/* ── Messages List ── */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          background: "#f8f9ff",
        }}
      >
        {/* Load more indicator */}
        {hasMore && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={loadMoreMessages}
              disabled={isLoadingHistory}
              style={{
                border: "none",
                background: "rgba(79,70,229,0.1)",
                color: "#4F46E5",
                borderRadius: "20px",
                padding: "4px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {isLoadingHistory ? "Đang tải..." : "Tải thêm tin nhắn cũ"}
            </button>
          </div>
        )}

        {isLoadingHistory && messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#94a3b8", marginTop: 40 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💬</div>
            <div>Đang tải tin nhắn...</div>
          </div>
        )}

        {!isLoadingHistory && messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#94a3b8", marginTop: 60, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👋</div>
            <div style={{ fontWeight: 600, color: "#64748b", marginBottom: 4 }}>Bắt đầu cuộc trò chuyện</div>
            <div style={{ fontSize: 13 }}>Gửi tin nhắn đầu tiên tới {receiver?.name}</div>
          </div>
        )}

        {messages.map((msg, idx) => {
          const mine = isSentByMe(msg);
          const showTime =
            idx === 0 ||
            new Date(msg.createdAt) - new Date(messages[idx - 1]?.createdAt) > 5 * 60 * 1000;

          return (
            <React.Fragment key={msg._id || idx}>
              {showTime && (
                <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "4px 0" }}>
                  {formatTime(msg.createdAt)}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: mine ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                {!mine && (
                  <img
                    src={receiver?.avatar || "https://res.cloudinary.com/dfinxo4uj/image/upload/v1761221144/default_avatar_gidgqw.png"}
                    alt=""
                    style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: mine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: mine
                      ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
                      : "#fff",
                    color: mine ? "#fff" : "#1e293b",
                    fontSize: 14,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ── */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid #e2e8f0",
          background: "#fff",
          flexShrink: 0,
          display: "flex",
          gap: "8px",
          alignItems: "flex-end",
        }}
      >
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn... (Enter để gửi)"
          rows={1}
          style={{
            flex: 1,
            border: "1.5px solid #e2e8f0",
            borderRadius: "12px",
            padding: "10px 14px",
            fontSize: 14,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            maxHeight: "120px",
            lineHeight: 1.5,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4F46E5")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isSending}
          style={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            border: "none",
            background:
              inputValue.trim()
                ? "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
                : "#e2e8f0",
            color: inputValue.trim() ? "#fff" : "#94a3b8",
            cursor: inputValue.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s",
            transform: inputValue.trim() ? "scale(1)" : "scale(0.95)",
          }}
          title="Gửi (Enter)"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
