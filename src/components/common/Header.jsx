import React from "react";
import AvatarMenu from "./AvatarMenu";

const TABS = ["Home", "Learn", "Practice", "Profile"];

export default function Header({ tab, setTab }) {
  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white border-b border-gray-100 w-full">
      <div className="px-4 py-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 justify-between w-full">
            <div className="font-semibold tracking-tight text-lg">
              App luyện thi tiếng Anh
            </div>
            <div className="flex gap-2">
              {TABS.map((t) =>
                t !== "Profile" ? (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      tab === t
                        ? "bg-gray-900 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {t}
                  </button>
                ) : (
                  <AvatarMenu key={t} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
