import {
  GridLayout,
  ParticipantTile,
  ParticipantLoop,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export default function VideoStage() {
  const tracks = useTracks(
    [
      {
        source: Track.Source.Camera,
        withPlaceholder: true,
      },
    ],
    {
      onlySubscribed: false,
    },
  );

  if (!tracks) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full bg-zinc-950 p-4">
      <GridLayout tracks={tracks ?? []} className="w-full h-full">
        <ParticipantLoop tracks={tracks ?? []}>
          <ParticipantTile />
        </ParticipantLoop>
      </GridLayout>
    </div>
  );
}
