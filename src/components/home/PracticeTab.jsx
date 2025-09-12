import React, { useMemo, useState } from "react";
import SectionCard from "../common/SectionCard";

export default function PracticeTab() {
  const [filter, setFilter] = useState("All");
  const tests = [
    {
      id: 1,
      name: "IELTS Listening Mini Test",
      skill: "Listening",
      time: 15,
      questions: 20,
    },
    {
      id: 2,
      name: "IELTS Reading Passage 1",
      skill: "Reading",
      time: 20,
      questions: 13,
    },
    {
      id: 3,
      name: "TOEIC RC Set A",
      skill: "Reading",
      time: 30,
      questions: 40,
    },
    {
      id: 4,
      name: "TOEIC LC Part 1",
      skill: "Listening",
      time: 25,
      questions: 30,
    },
  ];

  const filtered = useMemo(
    () => tests.filter((t) => filter === "All" || t.skill === filter),
    [filter]
  );

  return (
    <div className="space-y-4">
      <SectionCard title="Bộ lọc">
        <div className="flex flex-wrap gap-2">
          {["All", "Listening", "Reading", "Writing", "Speaking"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg border text-sm ${
                filter === f
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <SectionCard key={t.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Kỹ năng: {t.skill} • {t.questions} câu • {t.time} phút
                </div>
              </div>
              <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
                Bắt đầu
              </button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
