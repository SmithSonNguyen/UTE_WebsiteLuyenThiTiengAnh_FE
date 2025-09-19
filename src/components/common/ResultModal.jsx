import React from "react";
import { Modal } from "antd";

export default function ResultModal({ answers, questions, onClose }) {
  const score = questions.reduce((acc, q, i) => {
    return acc + (answers[i] === q.answer ? 1 : 0);
  }, 0);

  let level = "Beginner";
  if (score >= 15) level = "B2";
  else if (score >= 10) level = "B1";
  else if (score >= 5) level = "A2";

  return (
    <Modal open={true} onCancel={onClose} footer={null} title="Test Result">
      <p className="mt-4">
        You got <span className="font-bold">{score}</span> / {questions.length}{" "}
        correct.
      </p>
      <p className="mt-2">
        Your TOEIC Level: <b>{level}</b>
      </p>
    </Modal>
  );
}
