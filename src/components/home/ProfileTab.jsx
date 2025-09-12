import React from "react";
import { useSelector } from "react-redux";
import SectionCard from "../common/SectionCard";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export default function ProfileTab() {
  const activity = [
    { id: 1, text: "Hoàn thành TOEIC RC Set A – 32/40" },
    { id: 2, text: "Học xong chủ đề Vocabulary – Travel" },
    { id: 3, text: "Đạt streak 5 ngày liên tiếp" },
  ];

  const progressData = [
    { day: "T2", score: 58, words: 20 },
    { day: "T3", score: 64, words: 18 },
    { day: "T4", score: 60, words: 26 },
    { day: "T5", score: 68, words: 24 },
    { day: "T6", score: 72, words: 30 },
    { day: "T7", score: 70, words: 28 },
    { day: "CN", score: 75, words: 22 },
  ];

  const user = useSelector((state) => state.auth.login?.currentUser);
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard className="md:col-span-2">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "https://i.pravatar.cc/64"}
              alt="avatar"
              className="h-16 w-16 rounded-full object-cover border"
            />
            <div>
              <div className="text-lg font-semibold">
                {user.lastname} {user.firstname}
              </div>
              <div className="text-sm text-gray-600">Mục tiêu: IELTS 6.5</div>
              <div className="mt-2 flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                  onClick={() => navigate("/edit-profile")}
                >
                  Chỉnh sửa thông tin
                </button>
                <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">
                  Cài đặt
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
        <SectionCard>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-gray-600">Đề đã làm</div>
            </div>
            <div>
              <div className="text-2xl font-bold">74</div>
              <div className="text-xs text-gray-600">Điểm TB</div>
            </div>
            <div>
              <div className="text-2xl font-bold">246</div>
              <div className="text-xs text-gray-600">Từ đã học</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Tiến bộ trong tuần">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Hoạt động gần đây">
          <ul className="space-y-2">
            {activity.map((a) => (
              <li key={a.id} className="text-sm">
                {a.text}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Thói quen từ vựng (7 ngày)">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={progressData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="words" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
