import { X } from "lucide-react";

export default function Header({ roomName, onLeave }) {
  return (
    <div className="h-14 bg-zinc-900 border-b border-zinc-700 px-5 flex justify-between items-center">
      <div className="flex items-center gap-3 text-white">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

        <span className="font-medium">{roomName}</span>
      </div>

      <button
        onClick={onLeave}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white flex items-center gap-2"
      >
        <X size={18} />
        Rời lớp
      </button>
    </div>
  );
}
