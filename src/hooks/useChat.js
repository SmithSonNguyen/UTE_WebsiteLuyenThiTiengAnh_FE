import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace("/api", "") || "http://localhost:8080";

// Singleton socket instance
let sharedSocket = null;
let activeConnections = 0;

// Global state cho chat để đồng bộ giữa các component
let globalMessages = {}; // { roomId: messages[] }
let globalNotifications = [];
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export const useChat = (roomId = null) => {
  const [localMessages, setLocalMessages] = useState(globalMessages[roomId] || []);
  const [localNotifications, setLocalNotifications] = useState(globalNotifications);
  const [isConnected, setIsConnected] = useState(sharedSocket?.connected || false);
  const currentRoomRef = useRef(roomId);

  const accessToken = useSelector((state) => state.auth.login?.accessToken);

  // Sync state thay đổi
  useEffect(() => {
    const listener = () => {
      setLocalMessages(globalMessages[currentRoomRef.current] || []);
      setLocalNotifications([...globalNotifications]);
      setIsConnected(sharedSocket?.connected || false);
    };
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  // Update globalMessages khi roomId thay đổi
  useEffect(() => {
    currentRoomRef.current = roomId;
    setLocalMessages(globalMessages[roomId] || []);
  }, [roomId]);

  // Cập nhật messages (từ API history)
  const setMessages = useCallback((newMessagesOrUpdater) => {
    if (!currentRoomRef.current) return;
    const room = currentRoomRef.current;
    
    if (typeof newMessagesOrUpdater === 'function') {
      globalMessages[room] = newMessagesOrUpdater(globalMessages[room] || []);
    } else {
      globalMessages[room] = newMessagesOrUpdater;
    }
    notifyListeners();
  }, []);

  const clearNotifications = useCallback(() => {
    globalNotifications = [];
    notifyListeners();
  }, []);

  const resetMessages = useCallback(() => {
    if (currentRoomRef.current) {
      globalMessages[currentRoomRef.current] = [];
      notifyListeners();
    }
  }, []);

  // Socket connection
  useEffect(() => {
    if (!accessToken) return;

    if (!sharedSocket) {
      sharedSocket = io(BACKEND_URL, {
        auth: { token: accessToken },
        transports: ["websocket", "polling"],
        reconnection: true,
      });
    }

    const socket = sharedSocket;
    activeConnections++;
    notifyListeners();

    const onConnect = () => {
      console.log("✅ Socket connected:", socket.id);
      notifyListeners();
      // Join room nếu đang ở trong room
      if (currentRoomRef.current) {
        socket.emit("join_room", currentRoomRef.current);
      }
    };

    const onDisconnect = () => {
      console.log("❌ Socket disconnected");
      notifyListeners();
    };

    const onNewMessage = (message) => {
      console.log("📩 received new_message:", message);
      const mRoom = message.roomId;
      
      if (!globalMessages[mRoom]) globalMessages[mRoom] = [];
      
      // Chống trùng lặp tin nhắn
      const exists = globalMessages[mRoom].some(m => m._id === message._id);
      if (!exists) {
        globalMessages[mRoom] = [...globalMessages[mRoom], message];
        notifyListeners();
      }
    };

    const onNotification = (notification) => {
      console.log("🔔 received notification:", notification);
      // Chỉ thêm nếu không ở trong room đó
      if (notification.roomId !== currentRoomRef.current) {
        globalNotifications = [...globalNotifications, notification];
        notifyListeners();
      }
    };

    const onMessagesRead = ({ roomId: readRoomId, readBy }) => {
      if (globalMessages[readRoomId]) {
        globalMessages[readRoomId] = globalMessages[readRoomId].map((m) => {
          const rawSenderId = m.senderId;
          const senderIdStr =
            rawSenderId?._id?.toString() ||
            (typeof rawSenderId === "string" ? rawSenderId : null) ||
            rawSenderId?.toString?.();
          return senderIdStr !== readBy ? { ...m, isRead: true } : m;
        });
        notifyListeners();
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("new_message", onNewMessage);
    socket.on("new_message_notification", onNotification);
    socket.on("messages_read", onMessagesRead);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("new_message", onNewMessage);
      socket.off("new_message_notification", onNotification);
      socket.off("messages_read", onMessagesRead);

      activeConnections--;
      if (activeConnections === 0) {
        socket.disconnect();
        sharedSocket = null;
      }
    };
  }, [accessToken]);

  // Join/leave room
  useEffect(() => {
    const socket = sharedSocket;
    if (!socket || !socket.connected || !roomId) return;

    socket.emit("join_room", roomId);
    // Xóa notification của room này
    globalNotifications = globalNotifications.filter(n => n.roomId !== roomId);
    notifyListeners();

    return () => {
      socket.emit("leave_room", roomId);
    };
  }, [roomId, isConnected]); // isConnected để trigger lại khi reconnect

  const sendMessage = useCallback((receiverId, content) => {
    const socket = sharedSocket;
    if (!socket || !socket.connected || !currentRoomRef.current || !content.trim()) return;

    socket.emit("send_message", {
      roomId: currentRoomRef.current,
      receiverId,
      content: content.trim(),
    });
  }, []);

  const markRead = useCallback((targetRoomId) => {
    const socket = sharedSocket;
    if (!socket || !socket.connected) return;
    socket.emit("mark_read", targetRoomId || currentRoomRef.current);
  }, []);

  return {
    messages: localMessages,
    setMessages,
    isConnected,
    notifications: localNotifications,
    sendMessage,
    markRead,
    resetMessages,
    clearNotifications,
  };
};
