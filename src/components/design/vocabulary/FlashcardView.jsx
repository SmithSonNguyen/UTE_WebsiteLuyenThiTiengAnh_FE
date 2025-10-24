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
} from "lucide-react";

export const FlashcardView = ({ words, lessonTitle, onBack, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipState, setFlipState] = useState("front");
  const [shuffledWords, setShuffledWords] = useState(words);

  const currentWord = shuffledWords[currentIndex];
  const progress = ((currentIndex + 1) / shuffledWords.length) * 100;

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipState("front");
    } else {
      // finished flashcards
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
    if (flipState === "front") {
      setFlipState("pronunciation");
    } else if (flipState === "pronunciation") {
      setFlipState("examples");
    } else {
      setFlipState("front");
    }
  };

  const handleShuffle = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setFlipState("front");
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Lessons
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {currentIndex + 1} of {shuffledWords.length}
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

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{lessonTitle}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-8 flex justify-center perspective-1000">
        <Card
          className={`w-full max-w-lg h-96 cursor-pointer transition-transform duration-500 ${
            flipState !== "front" ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip}
          style={{ transformStyle: "preserve-3d" }}
        >
          {flipState === "front" ? (
            <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center p-8 text-center rounded-lg">
              <h1 className="text-4xl font-bold mb-4">{currentWord.english}</h1>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentWord.english);
                }}
                className="gap-2 mb-6"
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </Button>
              <p className="text-white/80 text-sm">
                Click to see meaning & pronunciation
              </p>
            </div>
          ) : flipState === "pronunciation" ? (
            <div className="h-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex flex-col items-center justify-center p-8 text-center rounded-lg">
              <h2 className="text-3xl font-bold mb-2">
                {currentWord.vietnamese}
              </h2>
              <p className="text-xl mb-4 font-mono text-yellow-200">
                {currentWord.pronunciation}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  speak(currentWord.english);
                }}
                className="gap-2 mb-6 border-white/20 text-white hover:bg-white/10"
              >
                <Volume2 className="w-4 h-4" />
                Listen Again
              </Button>
              <p className="text-white/80 text-sm">
                Click to see example sentences
              </p>
            </div>
          ) : (
            <div className="h-full bg-gradient-to-br from-orange-500 to-pink-600 text-white flex flex-col justify-center p-8 rounded-lg overflow-y-auto">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center">
                  Example Sentences
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-lg">
                    <p className="font-medium mb-2">English:</p>
                    <p className="text-lg">{currentWord.exampleEn}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <p className="font-medium mb-2">Vietnamese:</p>
                    <p className="text-lg">{currentWord.exampleVi}</p>
                  </div>
                </div>
                <p className="text-center text-white/80 text-sm">
                  Click to return to word
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-center mb-8">
        <Button
          onClick={handleFlip}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-2 px-8 py-3 text-lg hover:shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          {flipState === "front"
            ? "Show Meaning"
            : flipState === "pronunciation"
            ? "Show Examples"
            : "Back to Word"}
        </Button>
      </div>

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
            Click the card to reveal more information
          </p>
        </div>

        <Button
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-2"
        >
          {currentIndex < shuffledWords.length - 1 ? (
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
    </div>
  );
};
