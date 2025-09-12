import React from "react";
import SectionCard from "../common/SectionCard";

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 rounded-full bg-gray-100">
    <div
      className="h-2 rounded-full bg-gray-900 transition-all"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export default function HomeTab() {
  const suggestions = [
    { id: 1, title: "Bài học tiếp theo: Từ vựng - Travel", cta: "Học ngay" },
    { id: 2, title: "Đề gợi ý: IELTS Listening Mini Test", cta: "Làm đề" },
  ];

  const todayStats = [
    { label: "Từ đã học", value: 18, goal: 30 },
    { label: "Câu đã làm", value: 42, goal: 60 },
  ];

  return (
    <div className="space-y-4">
      <SectionCard>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">
            Chào bạn, tiếp tục hành trình học hôm nay
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {todayStats.map((s) => (
              <div
                key={s.label}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className="text-sm font-medium">
                    {s.value}/{s.goal}
                  </span>
                </div>
                <ProgressBar value={(s.value / s.goal) * 100} />
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard className="md:col-span-2" title="Lối tắt">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:border-gray-300">
              <div className="text-sm text-gray-600">Chế độ</div>
              <div className="font-semibold">Học</div>
            </button>
            <button className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:border-gray-300">
              <div className="text-sm text-gray-600">Chế độ</div>
              <div className="font-semibold">Luyện đề</div>
            </button>
            <button className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:border-gray-300">
              <div className="text-sm text-gray-600">Tốc độ</div>
              <div className="font-semibold">Quiz nhanh (5 câu)</div>
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Gợi ý cho bạn">
          <div className="space-y-3">
            {suggestions.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="text-sm">{g.title}</div>
                <button className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                  {g.cta}
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
