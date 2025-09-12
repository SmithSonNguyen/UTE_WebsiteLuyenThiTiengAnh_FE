import React from "react";
import SectionCard from "../common/SectionCard";

export default function LearnTab() {
  const sections = [
    { title: "Từ vựng", desc: "Học theo chủ đề, flashcard, kiểm tra nhanh" },
    { title: "Ngữ pháp", desc: "Bài học theo cấp độ kèm ví dụ minh hoạ" },
    { title: "Kỹ năng", desc: "Listening, Reading, Speaking, Writing" },
  ];

  const vocabTopics = [
    "Travel",
    "Business",
    "Education",
    "Health",
    "Technology",
    "Environment",
  ];

  return (
    <div className="space-y-4">
      <SectionCard title="Danh mục">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sections.map((s) => (
            <div
              key={s.title}
              className="p-4 rounded-xl bg-gray-50 border border-gray-100"
            >
              <div className="font-semibold mb-1">{s.title}</div>
              <div className="text-sm text-gray-600">{s.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Chủ đề Từ vựng">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {vocabTopics.map((t) => (
            <button
              key={t}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              {t}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Flashcard nhanh">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">
            Bắt đầu
          </button>
          <span className="text-sm text-gray-600">10 thẻ • Chủ đề: Travel</span>
        </div>
      </SectionCard>
    </div>
  );
}
