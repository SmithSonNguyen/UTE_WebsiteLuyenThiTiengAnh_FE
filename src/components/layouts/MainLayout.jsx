import React from "react";
import Header from "@/components/common/Header";

export default function MainLayout({ tab, setTab, children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header tab={tab} setTab={setTab} />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-4 min-h-[60vh]">
        {children}
      </div>
    </div>
  );
}
