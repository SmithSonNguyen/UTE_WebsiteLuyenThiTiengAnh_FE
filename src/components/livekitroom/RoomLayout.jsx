import { LayoutContextProvider } from "@livekit/components-react";

import Header from "./Header";
import VideoStage from "./VideoStage";
import BottomBar from "./BottomBar";

export default function RoomLayout({ roomName, onLeave }) {
  return (
    <LayoutContextProvider>
      <div className="fixed inset-0 bg-zinc-950 flex flex-col">
        <Header roomName={roomName} onLeave={onLeave} />

        <div className="flex-1 overflow-hidden">
          <VideoStage />
        </div>

        <BottomBar />
      </div>
    </LayoutContextProvider>
  );
}
