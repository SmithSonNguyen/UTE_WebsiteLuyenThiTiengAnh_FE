import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Volume2,
  RotateCcw,
  Star,
  CheckCircle,
} from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";

export const MyVocabFlashcardView = ({ vocabularies, onBack, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipState, setFlipState] = useState("front"); // "front" or "back"
  const [shuffledVocabs, setShuffledVocabs] = useState(vocabularies);
  const [reviewedIds, setReviewedIds] = useState(new Set());

  const currentVocab = shuffledVocabs[currentIndex];
  const progress = ((currentIndex + 1) / shuffledVocabs.length) * 100;

  // ✅ Track review count
  const trackReview = async (vocabId) => {
    if (reviewedIds.has(vocabId)) return; // Đã review rồi

    try {
      await axiosInstance.patch(`/lessons/my-vocabulary/${vocabId}/review`);
      setReviewedIds((prev) => new Set([...prev, vocabId]));
      console.log(`Tracked review for vocab ${vocabId}`);
    } catch (error) {
      console.error("Error tracking review:", error);
    }
  };

  const handleNext = () => {
    // Track review khi chuyển sang từ tiếp theo
    if (flipState === "back") {
      trackReview(currentVocab._id);
    }

    if (currentIndex < shuffledVocabs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipState("front");
    } else {
      // Finished all flashcards
      if (typeof onComplete === "function") onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipState("front");
    }
  };

  const handleFlip = () => {
    setFlipState(flipState === "front" ? "back" : "front");
  };

  const handleShuffle = () => {
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    setShuffledVocabs(shuffled);
    setCurrentIndex(0);
    setFlipState("front");
    setReviewedIds(new Set()); // Reset review tracking
  };

  // ✅ Text-to-speech
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      // Loại bỏ phần phát âm nếu có
      const cleanText = text.split("/")[0].trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {currentIndex + 1} of {shuffledVocabs.length}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShuffle}
            className="gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">My Vocabulary Review</span>
          <span className="text-sm text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <div className="mb-8 flex justify-center perspective-1000">
        <Card
          className={`w-full max-w-lg h-96 cursor-pointer transition-transform duration-500 ${
            flipState === "back" ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
          style={{ transformStyle: "preserve-3d" }}
        >
          {flipState === "front" ? (
            // ✅ FRONT: Hiển thị từ tiếng Anh
            <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center p-8 text-center rounded-lg relative">
              {/* Favorite indicator */}
              {currentVocab.isFavorite && (
                <div className="absolute top-4 right-4">
                  <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                </div>
              )}

              <h1 className="text-5xl font-bold mb-6">{currentVocab.word}</h1>

              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentVocab.word);
                }}
                className="gap-2 mb-6"
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </Button>

              <p className="text-white/80 text-sm">
                Click to see Vietnamese meaning
              </p>

              {/* Review count badge */}
              {currentVocab.reviewCount > 0 && (
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {currentVocab.reviewCount} reviews
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            // ✅ BACK: Hiển thị nghĩa tiếng Việt + context example
            <div className="h-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex flex-col justify-center p-8 rounded-lg overflow-y-auto">
              <div className="space-y-6">
                {/* Vietnamese Meaning */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">
                    {currentVocab.explanation}
                  </h2>
                </div>

                {/* Context Example if available */}
                {currentVocab.contextExample && (
                  <div className="p-4 bg-white/10 rounded-lg">
                    <p className="font-medium mb-2 text-sm">Example:</p>
                    <p className="text-base italic">
                      {currentVocab.contextExample}
                    </p>
                  </div>
                )}

                {/* Tags if available */}
                {currentVocab.tags && currentVocab.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {currentVocab.tags.map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-white/10 text-white border-white/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentVocab.word);
                  }}
                  className="gap-2 border-white/20 text-white hover:bg-white/10 mx-auto block"
                >
                  <Volume2 className="w-4 h-4" />
                  Listen Again
                </Button>

                <p className="text-center text-white/80 text-sm">
                  Click to return to word
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Flip Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleFlip}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-2 px-8 py-3 text-lg hover:shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          {flipState === "front" ? "Show Meaning" : "Back to Word"}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Click the card to flip and reveal
          </p>
        </div>

        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-2"
        >
          {currentIndex < shuffledVocabs.length - 1 ? (
            <>
              Next
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Finish
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Review Progress Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          {reviewedIds.size} of {shuffledVocabs.length} words reviewed in this
          session
        </p>
      </div>
    </div>
  );
};
