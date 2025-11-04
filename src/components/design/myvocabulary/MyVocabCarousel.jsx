import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, Star, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

const MyVocabCarousel = ({
  vocabularies,
  onStartFlashcards,
  onDeleteVocab,
  onToggleFavorite,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDelete = (e, vocabId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this vocabulary?")) {
      onDeleteVocab(vocabId);
    }
  };

  const handleToggleFavorite = (e, vocabId) => {
    e.stopPropagation();
    onToggleFavorite(vocabId);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Start Flashcards Button */}
      <div className="flex justify-center">
        <Button
          onClick={onStartFlashcards}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white gap-2 px-8 py-6 text-lg hover:shadow-lg"
          disabled={vocabularies.length === 0}
        >
          <Play className="w-5 h-5" />
          Start Flashcards Review ({vocabularies.length} words)
        </Button>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vocabularies.map((vocab) => {
          const isExpanded = expandedId === vocab._id;

          return (
            <Card
              key={vocab._id}
              className="p-6 transition-all hover:shadow-lg hover-lift cursor-pointer relative"
              onClick={() => setExpandedId(isExpanded ? null : vocab._id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{vocab.word}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {vocab.explanation}
                    </p>
                  </div>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={(e) => handleToggleFavorite(e, vocab._id)}
                  className="ml-2 flex-shrink-0"
                >
                  <Star
                    className={`w-5 h-5 ${
                      vocab.isFavorite
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-400"
                    } hover:scale-110 transition-transform`}
                  />
                </button>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3 animate-slide-down">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Word:
                    </p>
                    <p className="text-base font-medium">{vocab.word}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Meaning:
                    </p>
                    <p className="text-base">{vocab.explanation}</p>
                  </div>
                  {vocab.contextExample && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Example:
                      </p>
                      <p className="text-sm italic text-gray-700">
                        {vocab.contextExample}
                      </p>
                    </div>
                  )}
                  {vocab.tags && vocab.tags.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">
                        Tags:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {vocab.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(vocab.createdAt)}</span>
                </div>
                {vocab.reviewCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {vocab.reviewCount} reviews
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(isExpanded ? null : vocab._id);
                  }}
                  className="flex-1"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleDelete(e, vocab._id)}
                  className="gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {vocabularies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Vocabularies Found
          </h3>
          <p className="text-gray-600">
            Try changing your filter or add new vocabularies
          </p>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyVocabCarousel;
