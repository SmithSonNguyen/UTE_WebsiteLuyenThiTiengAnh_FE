import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MyVocabCarousel from "@/components/design/myvocabulary/MyVocabCarousel";
import { MyVocabFlashcardView } from "@/components/design/myvocabulary/MyVocabFlashcardView";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const MyVocabularyPage = () => {
  const [appState, setAppState] = useState("list"); // "list" hoặc "flashcards"
  const [vocabularies, setVocabularies] = useState([]);
  const [filteredVocabs, setFilteredVocabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all"); // "all", "favorites", "recent"

  // ✅ Lấy user từ Redux
  const currentUser = useSelector((state) => state?.auth?.login?.currentUser);
  const accessToken = useSelector((state) => state?.auth?.login?.accessToken);

  // Check authentication
  const isAuthenticated = !!(currentUser || accessToken);

  // ✅ Fetch user's vocabularies
  useEffect(() => {
    const fetchMyVocabularies = async () => {
      if (!isAuthenticated) {
        console.log("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("=== FETCHING USER VOCABULARIES ===");

        // Fetch vocabularies với pagination
        const vocabRes = await axiosInstance.get(
          `/lessons/my-vocabulary?page=1&limit=100&sortBy=createdAt&sortOrder=desc`
        );

        console.log("My vocabulary response:", vocabRes);

        const vocabData = Array.isArray(vocabRes)
          ? vocabRes
          : vocabRes?.data || [];

        console.log("Vocabulary data:", vocabData);
        console.log("Total vocabularies:", vocabData.length);

        if (vocabData.length === 0) {
          toast({
            title: "No Vocabulary Yet",
            description:
              "Start saving words to build your personal vocabulary!",
          });
        }

        setVocabularies(vocabData);
        setFilteredVocabs(vocabData);

        // Fetch stats
        try {
          const statsRes = await axiosInstance.get(
            `/lessons/my-vocabulary/stats`
          );
          console.log("Stats:", statsRes);
          setStats(statsRes?.data || statsRes);
        } catch (statsError) {
          console.warn("Could not fetch stats:", statsError);
        }

        if (vocabData.length > 0) {
          toast({
            title: "Vocabularies Loaded",
            description: `${vocabData.length} words ready to review!`,
          });
        }
      } catch (error) {
        console.error("=== ERROR FETCHING VOCABULARIES ===");
        console.error("Error:", error);

        if (error?.response?.status === 401 || error?.status === 401) {
          toast({
            title: "Session Expired",
            description: "Please login again to continue.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          toast({
            title: "Error Loading Vocabularies",
            description:
              error.message || "Could not fetch your saved vocabularies.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyVocabularies();
  }, [isAuthenticated]);

  // ✅ Filter vocabularies
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredVocabs(vocabularies);
    } else if (selectedFilter === "favorites") {
      setFilteredVocabs(vocabularies.filter((v) => v.isFavorite));
    } else if (selectedFilter === "recent") {
      // Already sorted by createdAt desc
      setFilteredVocabs(vocabularies.slice(0, 20));
    }
  }, [selectedFilter, vocabularies]);

  // ✅ Handle delete vocabulary
  const handleDeleteVocab = async (vocabId) => {
    try {
      await axiosInstance.delete(`/lessons/my-vocabulary/${vocabId}`);

      setVocabularies((prev) => prev.filter((v) => v._id !== vocabId));

      toast({
        title: "Deleted",
        description: "Vocabulary removed successfully",
      });
    } catch (error) {
      console.error("Error deleting vocabulary:", error);
      toast({
        title: "Error",
        description: "Could not delete vocabulary",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle toggle favorite
  const handleToggleFavorite = async (vocabId) => {
    try {
      const result = await axiosInstance.patch(
        `/lessons/my-vocabulary/${vocabId}/favorite`
      );

      setVocabularies((prev) =>
        prev.map((v) =>
          v._id === vocabId
            ? { ...v, isFavorite: result?.data?.isFavorite ?? !v.isFavorite }
            : v
        )
      );

      toast({
        title: "Updated",
        description: "Favorite status changed",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Could not update favorite status",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle start flashcards
  const handleStartFlashcards = () => {
    if (filteredVocabs.length === 0) {
      toast({
        title: "No Words Available",
        description: "Please add some vocabularies first",
        variant: "destructive",
      });
      return;
    }

    setAppState("flashcards");
    toast({
      title: "Flashcards Started!",
      description: `Reviewing ${filteredVocabs.length} words.`,
    });
  };

  // ✅ Handle flashcards complete
  const handleFlashcardsComplete = () => {
    setAppState("list");
    toast({
      title: "Great Job! 🎉",
      description: "You've reviewed all your vocabularies!",
    });
  };

  const handleBackToList = () => {
    setAppState("list");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">
            Loading your vocabularies...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đăng nhập để truy cập vào thư viện từ vựng cá nhân của bạn.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            📖 My Vocabulary
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Review and manage your personal vocabulary collection
          </p>
          {currentUser && (
            <p className="text-sm text-muted-foreground mt-2">
              Logged in as:{" "}
              <span className="font-semibold">
                {currentUser.email || currentUser.username || currentUser.name}
              </span>
            </p>
          )}

          {/* Stats Display */}
          {stats && appState === "list" && (
            <div className="flex justify-center gap-6 mt-6">
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total || 0}
                </p>
                <p className="text-sm text-gray-600">Total Words</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.favorites || 0}
                </p>
                <p className="text-sm text-gray-600">Favorites</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalReviews || 0}
                </p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
            </div>
          )}
        </header>

        <main>
          {appState === "list" && (
            <>
              {/* Filter Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setSelectedFilter("all")}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All ({vocabularies.length})
                </button>
                <button
                  onClick={() => setSelectedFilter("favorites")}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === "favorites"
                      ? "bg-yellow-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ⭐ Favorites (
                  {vocabularies.filter((v) => v.isFavorite).length})
                </button>
                <button
                  onClick={() => setSelectedFilter("recent")}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === "recent"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  🕒 Recent (20)
                </button>
              </div>

              {vocabularies.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Vocabularies Yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start using the translator to save words to your personal
                    collection!
                  </p>
                </div>
              ) : (
                <MyVocabCarousel
                  vocabularies={filteredVocabs}
                  onStartFlashcards={handleStartFlashcards}
                  onDeleteVocab={handleDeleteVocab}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </>
          )}

          {appState === "flashcards" && filteredVocabs.length > 0 && (
            <MyVocabFlashcardView
              vocabularies={filteredVocabs}
              onComplete={handleFlashcardsComplete}
              onBack={handleBackToList}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MyVocabularyPage;
