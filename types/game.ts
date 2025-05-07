// Topic types
export interface PythonTopic {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Puzzle types
export interface Puzzle {
  id: string;
  question: string;
  code?: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

// User progress and game state
export interface GameState {
  username: string;
  selectedTopic: string | null;
  currentPuzzleIndex: number;
  score: number;
  answers: {
    puzzleId: string;
    userAnswer: number;
    correct: boolean;
    timeSpent: number;
  }[];
  gameStarted: boolean;
  gameFinished: boolean;
  timer: number;
}

// Leaderboard entry
export interface LeaderboardEntry {
  username: string;
  topic: string;
  score: number;
  totalTime: number;
  date: string;
}