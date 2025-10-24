// score.js
// score.js

const listeningScores = [
  5, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
  105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175,
  180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245, 250,
  255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325,
  330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 395, 400, 405,
  410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470, 475, 480,
  485, 490, 495, 495, 495, 495, 495,
];

const readingScores = [
  5, 5, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
  95, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170,
  175, 180, 185, 190, 195, 200, 205, 210, 215, 220, 225, 230, 235, 240, 245,
  250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320,
  325, 330, 335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395,
  400, 405, 410, 415, 420, 425, 430, 435, 440, 445, 450, 455, 460, 465, 470,
  475, 480, 485, 490, 495,
];

/**
 * Hàm tính điểm Listening
 */
export function calculateListeningScore(correct) {
  if (typeof correct !== "number" || !Number.isFinite(correct)) {
    console.error("Invalid listening correct value:", correct);
    return 0;
  }
  const n = Math.max(0, Math.min(100, Math.floor(correct)));
  return listeningScores[n];
}

/**
 * Hàm tính điểm Reading
 */
export function calculateReadingScore(correct) {
  if (typeof correct !== "number" || !Number.isFinite(correct)) {
    console.error("Invalid reading correct value:", correct);
    return 0;
  }
  const n = Math.max(0, Math.min(100, Math.floor(correct)));
  return readingScores[n];
}

/**
 * Tính tổng điểm TOEIC
 */
export function calculateTotalScore(listeningCorrect, readingCorrect) {
  const listening = calculateListeningScore(listeningCorrect);
  const reading = calculateReadingScore(readingCorrect);
  const total = listening + reading;
  return {
    listeningCorrect,
    readingCorrect,
    listening,
    reading,
    total,
  };
}

// Default export để tương thích với cả 2 cách import
export default {
  calculateListeningScore,
  calculateReadingScore,
  calculateTotalScore,
};
