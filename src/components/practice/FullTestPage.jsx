import DisplayFullTest from "@/components/test/DisplayFullTest";
import { useParams } from "react-router-dom";

const FullTestPage = () => {
  const { examId } = useParams();

  const fullTestConfig = JSON.parse(
    sessionStorage.getItem("fullTestConfig") || "{}",
  );

  return <DisplayFullTest examId={examId} testName={fullTestConfig.testName} />;
};

export default FullTestPage;
