import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace("/api", "") || "http://localhost:8080";

/**
 * Hook quản lý kết nối Socket.IO cho chat realtime
 * @param {string|null} roomId - ID phòng chat hiện tại
 */
export const useChat = (roomId = null) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]); // Tin nhắn mới khi không ở trong room
  const socketRef = useRef(null);
  const currentRoomRef = useRef(null);

  const accessToken = useSelector(
    (state) => state.auth.login?.accessToken
  );

  // Kết nối Socket.IO
  useEffect(() => {
    if (!accessToken) return;

    const socket = io(BACKEND_URL, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
      setIsConnected(true);

      // Tham gia lại room nếu có
      if (currentRoomRef.current) {
        socket.emit("join_room", currentRoomRef.current);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket.IO disconnected");
      setIsConnected(false);
    });

    socket.on("new_message", (message) => {
      setMessages((prev) => {
        // Tránh duplicate
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socket.on("new_message_notification", (notification) => {
      setNotifications((prev) => [...prev, notification]);
    });

    socket.on("messages_read", ({ roomId: readRoomId, readBy }) => {
      if (readRoomId === currentRoomRef.current) {
        setMessages((prev) =>
          prev.map((m) =>
            m.senderId?._id !== readBy ? { ...m, isRead: true } : m
          )
        );
      }
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  // Join/leave room khi roomId thay đổi
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !isConnected) return;

    // Rời room cũ
    if (currentRoomRef.current && currentRoomRef.current !== roomId) {
      socket.emit("leave_room", currentRoomRef.current);
    }

    if (roomId) {
      socket.emit("join_room", roomId);
      currentRoomRef.current = roomId;
      // Reset notifications cho room này
      setNotifications((prev) =>
        prev.filter((n) => n.roomId !== roomId)
      );
    } else {
      currentRoomRef.current = null;
    }
  }, [roomId, isConnected]);

  // Gửi tin nhắn
  const sendMessage = useCallback(
    (receiverId, content) => {
      const socket = socketRef.current;
      if (!socket || !currentRoomRef.current || !content.trim()) return;

      socket.emit("send_message", {
        roomId: currentRoomRef.current,
        receiverId,
        content: content.trim(),
      });
    },
    []
  );

  // Đánh dấu đã đọc
  const markRead = useCallback((targetRoomId) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit("mark_read", targetRoomId || currentRoomRef.current);
  }, []);

  // Reset messages khi đổi room
  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    messages,
    setMessages,
    isConnected,
    notifications,
    sendMessage,
    markRead,
    resetMessages,
    clearNotifications,
  };
};
