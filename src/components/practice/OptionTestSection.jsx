import PracticeModeTest from "@/components/test/PracticeModeTest";
import { useParams } from "react-router-dom";

const OptionTestSection = () => {
  const { examId } = useParams();

  return <PracticeModeTest examId={examId} />;
};

export default OptionTestSection;
