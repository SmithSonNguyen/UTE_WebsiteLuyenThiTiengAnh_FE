// src/components/livekitroom/LiveKitRoomComponent.jsx
import React from "react";
import { useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  Chat,
  DisconnectButton,
  ChatToggle,
  VideoConference,
  ParticipantTile,
  ParticipantLoop,
  useParticipants,
  useTracks,
  LayoutContextProvider,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import { X, Users, MessageSquare, MessageSquareOff } from "lucide-react";
import { toast } from "react-toastify";

const ParticipantGrid = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );

  return (
    <div className="flex p-4 h-full overflow-auto bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-h-full">
        {tracks.map((trackRef) => (
          <div
            key={trackRef.participant.identity + trackRef.source}
            className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-700 relative"
          >
            <ParticipantTile trackRef={trackRef} className="absolute inset-0" />
          </div>
        ))}

        {tracks.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center h-[60vh] text-zinc-400">
            <Users size={64} className="mb-6 opacity-50" />
            <p className="text-2xl font-medium mb-2">Chưa có ai tham gia</p>
            <p>Bạn là người đầu tiên trong lớp học</p>
          </div>
        )}
      </div>
    </div>
  );
};

const LiveKitRoomComponent = ({ token, serverUrl, roomName, onLeave }) => {
  const [showChat, setShowChat] = useState(true); // State quản lý chat

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect={true}
      video={true}
      audio={true}
      onConnected={() => toast.success(`✅ Đã vào lớp: ${roomName}`)}
      onDisconnected={onLeave}
      onError={(err) => toast.error("Lỗi kết nối")}
    >
      <LayoutContextProvider>
        <div className="fixed inset-0 bg-white z-[1000] flex flex-col h-screen overflow-hidden">
          {/* Header giữ nguyên */}
          <div className="h-16 bg-zinc-900 border-b border-zinc-700 px-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium">{roomName}</span>
            </div>
            <button
              onClick={onLeave}
              className="bg-red-600 hover:bg-red-700 rounded text-white flex items-center gap-2"
            >
              <DisconnectButton>Rời khỏi lớp học</DisconnectButton>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden relative h-full overflow-y-auto">
            {/* Video Conference - Hỗ trợ phóng to tốt nhất */}
            <div className={`flex-1 transition-all ${showChat ? "mr-0" : ""}`}>
              <VideoConference showSettings={true} />
            </div>

            {/* Chat Sidebar */}
          </div>
        </div>
      </LayoutContextProvider>
    </LiveKitRoom>
  );
};

export default LiveKitRoomComponent;
