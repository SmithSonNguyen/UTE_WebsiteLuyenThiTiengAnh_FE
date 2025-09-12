import React from "react";

export default function SectionCard({ title, className, children }) {
  return (
    <div
      className={`rounded-2xl bg-white shadow-sm ring-1 ring-black/5 ${
        className ?? ""
      }`}
    >
      {title ? (
        <div className="px-5 pt-4 pb-2 border-b border-gray-100">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </div>
  );
}
