import { useParams } from "react-router-dom";
import DisplayOptionTest from "@/components/test/DisplayOptionTest";

const PracticeTestPage = () => {
  const { examId } = useParams();

  const config = JSON.parse(sessionStorage.getItem("practiceConfig") || "{}");

  return (
    <DisplayOptionTest
      examId={examId}
      testName={config.testName || "Đang làm bài"}
      selectedParts={config.selectedParts || []}
      timeLimitMinutes={config.timeLimit || 0}
    />
  );
};

export default PracticeTestPage;
