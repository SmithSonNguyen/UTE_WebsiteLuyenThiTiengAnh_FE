import React, { useState } from "react";
import { useSelector } from "react-redux";
import ToeicOnline_RightSidebar from "@/pages/test/TestOnline_RightSidebar";
import PracticeModeTest from "@/components/practice/PracticeModeTest";
import FullTestSection from "@/components/practice/FullTestSection";
import DiscussionSection from "@/components/practice/DiscussionSection";

const PracticeTabs = () => {
  const [mainTab, setMainTab] = useState("info"); // Tab chính: info | solutions
  const [subTab, setSubTab] = useState("practice"); // Tab phụ: practice | fulltest | discussion
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_300px] gap-8">
        {/* LEFT CONTENT */}
        <div className="min-w-0 bg-white shadow rounded-lg p-6">
          {/* Tag + Title */}
          <div className="mb-4">
            <span className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
              TOEIC
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-4 flex items-center">
            2024 Practice Set TOEIC Test 1
            <span className="ml-2 text-green-500">
              <i className="fas fa-check-circle"></i>
            </span>
          </h1>

          {/* MAIN NAV PILLS */}
          <ul className="flex border-b mb-6">
            <li
              className={`mr-6 pb-2 cursor-pointer ${
                mainTab === "info"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setMainTab("info")}
            >
              Thông tin đề thi
            </li>
            <li
              className={`mr-6 pb-2 cursor-pointer ${
                mainTab === "solutions"
                  ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-600"
              }`}
              onClick={() => setMainTab("solutions")}
            >
              Đáp án / Transcript
            </li>
          </ul>

          {/* TAB CONTENT */}
          {mainTab === "info" && (
            <div>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <div>
                  <i className="far fa-clock mr-1"></i> Thời gian làm bài:{" "}
                  <span className="font-medium">120 phút</span> | 7 phần thi |
                  200 câu hỏi | <span>4108 bình luận</span>
                </div>
                <div>
                  <i className="fad fa-user-edit mr-1"></i> 2,100,201 người đã
                  luyện tập đề thi này
                </div>
              </div>

              <p className="text-red-500 italic text-sm mb-6">
                Chú ý: để được quy đổi sang scaled score (ví dụ trên thang điểm
                990 TOEIC), vui lòng chọn chế độ làm FULL TEST.
              </p>

              {/* SECONDARY TAB */}
              <ul className="flex border-b mb-6">
                {[
                  { id: "practice", label: "Luyện tập" },
                  { id: "fulltest", label: "Làm full test" },
                  { id: "discussion", label: "Thảo luận" },
                ].map((tab) => (
                  <li
                    key={tab.id}
                    className={`mr-6 pb-2 cursor-pointer ${
                      subTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => setSubTab(tab.id)}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>

              {/* SUB TAB CONTENT */}
              {subTab === "practice" && (
                <div className="space-y-6">
                  <PracticeModeTest />

                  {/* BẢNG KẾT QUẢ LÀM BÀI */}
                  <div className="border-t pt-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Kết quả làm bài của bạn
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="min-w-full border text-sm border-gray-300">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-3 py-2 border w-[150px]">
                              Ngày làm
                            </th>
                            <th className="px-3 py-2 border w-[100px]">
                              Kết quả
                            </th>
                            <th className="px-3 py-2 border w-[150px]">
                              Thời gian làm bài
                            </th>
                            <th className="px-3 py-2 border w-[150px]"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              date: "30/12/2024",
                              badges: ["Luyện tập", "Part 5"],
                              result: "1/30",
                              time: "0:00:17",
                              link: "/tests/4692/2024-practice-set-toeic-test-1/results/21981695/",
                            },
                            {
                              date: "30/12/2024",
                              badges: ["Luyện tập", "Part 5"],
                              result: "0/30",
                              time: "0:00:27",
                              link: "/tests/4692/2024-practice-set-toeic-test-1/results/21981679/",
                            },
                            {
                              date: "30/12/2024",
                              badges: ["Luyện tập", "Part 5"],
                              result: "29/30",
                              time: "0:11:28",
                              link: "/tests/4692/2024-practice-set-toeic-test-1/results/21981657/",
                            },
                            {
                              date: "24/12/2024",
                              badges: ["Luyện tập", "Part 5"],
                              result: "30/30",
                              time: "0:05:24",
                              link: "/tests/4692/2024-practice-set-toeic-test-1/results/21832701/",
                            },
                            {
                              date: "22/12/2024",
                              badges: ["Luyện tập", "Part 5"],
                              result: "17/30",
                              time: "1:25:22",
                              link: "/tests/4692/2024-practice-set-toeic-test-1/results/21794082/",
                            },
                          ].map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="border px-3 py-2">
                                <div>{item.date}</div>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {item.badges.map((badge, i) => (
                                    <span
                                      key={i}
                                      className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded"
                                    >
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="border px-3 py-2 text-center font-medium">
                                {item.result}
                              </td>
                              <td className="border px-3 py-2 text-center">
                                {item.time}
                              </td>
                              <td className="border px-3 py-2 text-center">
                                <a
                                  href={item.link}
                                  className="text-blue-600 hover:underline"
                                >
                                  Xem chi tiết
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {subTab === "fulltest" && <FullTestSection />}
              {subTab === "discussion" && <DiscussionSection />}
            </div>
          )}

          {mainTab === "solutions" && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Các phần thi:</h2>
              <ul className="list-disc ml-6 space-y-1 text-gray-700">
                {Array.from({ length: 7 }, (_, i) => (
                  <li key={i}>
                    Part {i + 1}:{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Xem đáp án
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <ToeicOnline_RightSidebar
          currentUser={currentUser}
          targetScore={750}
          examDate={"20-11-2025"}
          daysUntilExam={60}
          avatarColor={"#000000"}
        />
      </div>
    </div>
  );
};

export default PracticeTabs;
