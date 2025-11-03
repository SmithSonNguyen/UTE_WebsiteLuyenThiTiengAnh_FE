import React, { useState } from "react";

const DiscussionSection = () => {
  const [comments, setComments] = useState([
    {
      user: "Nguyễn Minh Anh",
      time: "2 giờ trước",
      content:
        "Mình thấy Part 3 khá khó, đặc biệt là mấy câu hỏi về hàm ý câu nói 😅",
      parts: ["Part 3"],
    },
    {
      user: "Trần Quốc Bảo",
      time: "1 ngày trước",
      content:
        "Theo mình luyện nghe Part 2 thường xuyên giúp phản xạ nhanh hơn rất nhiều.",
      parts: ["Part 2"],
    },
    {
      user: "Lê Thu Hằng",
      time: "3 ngày trước",
      content:
        "Mình mới làm xong bài, được 850 điểm 🎉 Cảm ơn trang web đã giúp mình ôn luyện hiệu quả!",
      parts: ["Chung"],
    },
  ]);

  const allParts = [
    "Part 1",
    "Part 2",
    "Part 3",
    "Part 4",
    "Part 5",
    "Part 6",
    "Part 7",
    "Chung",
  ];
  const [selectedParts, setSelectedParts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newParts, setNewParts] = useState([]);

  const handlePartFilter = (part) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleNewCommentParts = (part) => {
    setNewParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return alert("Vui lòng nhập nội dung bình luận.");
    if (newParts.length === 0)
      return alert("Vui lòng chọn ít nhất một Part liên quan.");

    const newCmt = {
      user: "Bạn",
      time: "Vừa xong",
      content: newComment.trim(),
      parts: newParts,
    };
    setComments([newCmt, ...comments]);
    setNewComment("");
    setNewParts([]);
  };

  const filteredComments =
    selectedParts.length === 0
      ? comments
      : comments.filter((cmt) =>
          cmt.parts.some((p) => selectedParts.includes(p))
        );

  return (
    <div className="p-4 bg-gray-50 rounded-lg text-gray-800">
      <h2 className="text-lg font-semibold mb-4">💬 Khu vực thảo luận</h2>

      {/* Bộ lọc */}
      <div className="mb-4 border-b pb-3">
        <p className="font-medium mb-2 text-gray-700">🔎 Lọc theo Part:</p>
        <div className="flex flex-wrap gap-2">
          {allParts.map((part) => (
            <label
              key={part}
              className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                selectedParts.includes(part)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <input
                type="checkbox"
                className="hidden"
                onChange={() => handlePartFilter(part)}
                checked={selectedParts.includes(part)}
              />
              {part}
            </label>
          ))}
        </div>
      </div>

      {/* Danh sách bình luận */}
      <div className="space-y-4 mb-6">
        {filteredComments.map((cmt, index) => (
          <div
            key={index}
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-800">{cmt.user}</span>
              <span className="text-sm text-gray-500">{cmt.time}</span>
            </div>
            <p className="text-gray-700 mb-2">{cmt.content}</p>
            <div className="flex flex-wrap gap-2">
              {cmt.parts.map((p, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <p className="text-center text-gray-500 italic">
            Không có bình luận nào cho phần này.
          </p>
        )}
      </div>

      {/* Form thêm bình luận */}
      <form
        onSubmit={handleAddComment}
        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
      >
        <textarea
          className="w-full border rounded-lg p-2 text-gray-700 mb-3 focus:ring-2 focus:ring-blue-400"
          rows={3}
          placeholder="Nhập bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <div className="mb-3">
          <p className="font-medium mb-2 text-gray-700">
            🏷️ Gắn nhãn Part liên quan:
          </p>
          <div className="flex flex-wrap gap-2">
            {allParts.map((part) => (
              <label
                key={part}
                className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${
                  newParts.includes(part)
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  onChange={() => handleNewCommentParts(part)}
                  checked={newParts.includes(part)}
                />
                {part}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Gửi bình luận
        </button>
      </form>
    </div>
  );
};

export default DiscussionSection;
