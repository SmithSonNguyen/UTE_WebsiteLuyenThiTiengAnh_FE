// src/pages/FreeEntryTest.jsx
import React, { useState } from "react";
import { Progress, Button } from "antd";
import ResultModal from "../components/common/ResultModal";

const sampleQuestions = [
  {
    id: 1,
    type: "listening",
    audio: "/audio/q1.mp3",
    question: "What does the man mean?",
    options: ["He is busy.", "He agrees.", "He doesn’t know.", "He is late."],
    answer: 1,
  },
  {
    id: 2,
    type: "reading",
    question: "Choose the correct word: She _____ to school every day.",
    options: ["go", "goes", "going", "gone"],
    answer: 1,
  },
  // ...
];

export default function FreeEntryTest() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [current]: optionIndex });
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const progress = ((current + 1) / sampleQuestions.length) * 100;
  const q = sampleQuestions[current];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">TOEIC Entry Test</h1>

      <Progress value={progress} className="mb-6" />

      <div className="bg-white rounded-2xl shadow p-6">
        {q.type === "listening" && (
          <audio controls src={q.audio} className="mb-4" />
        )}
        <h2 className="text-lg font-semibold mb-4">{q.question}</h2>
        <ul className="space-y-3">
          {q.options.map((opt, i) => (
            <li
              key={i}
              onClick={() => handleAnswer(i)}
              className={`p-3 border rounded-lg cursor-pointer ${
                answers[current] === i ? "bg-blue-100 border-blue-500" : ""
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          disabled={current === 0}
          onClick={() => setCurrent(current - 1)}
        >
          Previous
        </Button>
        {current < sampleQuestions.length - 1 ? (
          <Button onClick={() => setCurrent(current + 1)}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit Test</Button>
        )}
      </div>

      {showResult && (
        <ResultModal
          answers={answers}
          questions={sampleQuestions}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
}
