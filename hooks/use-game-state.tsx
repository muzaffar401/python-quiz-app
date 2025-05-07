"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { GameState, Puzzle } from "@/types/game";
import { PUZZLES } from "@/data/puzzles";
import { useToast } from "@/hooks/use-toast";

const initialGameState: GameState = {
  username: "",
  selectedTopic: null,
  currentPuzzleIndex: 0,
  score: 0,
  answers: [],
  gameStarted: false,
  gameFinished: false,
  timer: 30, // 30 seconds per question
};

type GameContextType = {
  gameState: GameState;
  setUsername: (name: string) => void;
  selectTopic: (topicId: string) => void;
  startGame: () => void;
  resetGame: () => void;
  getCurrentPuzzle: () => Puzzle | null;
  submitAnswer: (answer: number) => void;
  useHint: () => void;
  remainingTime: number;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [remainingTime, setRemainingTime] = useState(initialGameState.timer);
  const { toast } = useToast();

  // Load saved state from localStorage on mount only
  useEffect(() => {
    const savedState = localStorage.getItem("pythonPuzzleGameState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setGameState(parsedState);
        setRemainingTime(parsedState.timer);
      } catch (e) {
        console.error("Failed to parse saved game state:", e);
      }
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pythonPuzzleGameState", JSON.stringify(gameState));
  }, [gameState]);

  // Timer effect
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    
    if (gameState.gameStarted && !gameState.gameFinished) {
      setRemainingTime(gameState.timer);
      
      timerInterval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            // Time's up - auto submit with no answer
            clearInterval(timerInterval!);
            submitAnswer(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [gameState.gameStarted, gameState.gameFinished, gameState.currentPuzzleIndex, gameState.timer]);

  // Set username
  const setUsername = (name: string) => {
    setGameState((prev) => ({ ...prev, username: name }));
  };

  // Select topic
  const selectTopic = (topicId: string) => {
    setGameState((prev) => ({ 
      ...prev, 
      selectedTopic: topicId,
      currentPuzzleIndex: 0,
      score: 0,
      answers: [],
      gameFinished: false
    }));
  };

  // Start game
  const startGame = () => {
    if (!gameState.username || !gameState.selectedTopic) {
      toast({
        title: "Unable to start game",
        description: "Please enter your name and select a topic",
        variant: "destructive"
      });
      return;
    }
    
    setGameState((prev) => ({ ...prev, gameStarted: true }));
  };

  // Reset game
  const resetGame = () => {
    setGameState(initialGameState);
  };

  // Get current puzzle
  const getCurrentPuzzle = (): Puzzle | null => {
    if (!gameState.selectedTopic || !gameState.gameStarted) return null;
    
    const puzzles = PUZZLES[gameState.selectedTopic];
    if (!puzzles || gameState.currentPuzzleIndex >= puzzles.length) return null;
    
    return puzzles[gameState.currentPuzzleIndex];
  };

  // Submit answer
  const submitAnswer = (answer: number) => {
    const currentPuzzle = getCurrentPuzzle();
    if (!currentPuzzle) return;
    
    const isCorrect = answer === currentPuzzle.correctOption;
    const timeSpent = gameState.timer - remainingTime;
    
    setGameState((prev) => {
      const newAnswers = [
        ...prev.answers,
        {
          puzzleId: currentPuzzle.id,
          userAnswer: answer,
          correct: isCorrect,
          timeSpent
        }
      ];
      
      const newScore = isCorrect ? prev.score + 1 : prev.score;
      const newIndex = prev.currentPuzzleIndex + 1;
      
      const allPuzzles = PUZZLES[prev.selectedTopic!];
      const gameFinished = newIndex >= allPuzzles.length;
      
      // If game is finished, save to leaderboard
      if (gameFinished) {
        const leaderboard = JSON.parse(localStorage.getItem("pythonPuzzleLeaderboard") || "[]");
        const totalTime = newAnswers.reduce((total, answer) => total + answer.timeSpent, 0);
        
        leaderboard.push({
          username: prev.username,
          topic: prev.selectedTopic,
          score: newScore,
          totalTime,
          date: new Date().toISOString()
        });
        
        localStorage.setItem("pythonPuzzleLeaderboard", JSON.stringify(leaderboard));
      }
      
      return {
        ...prev,
        answers: newAnswers,
        score: newScore,
        currentPuzzleIndex: newIndex,
        gameFinished
      };
    });

    // Show feedback toast
    toast({
      title: isCorrect ? "Correct!" : "Incorrect",
      description: currentPuzzle.explanation,
      variant: isCorrect ? "default" : "destructive"
    });
  };

  // Use hint - reveal one incorrect option
  const useHint = () => {
    const currentPuzzle = getCurrentPuzzle();
    if (!currentPuzzle) return;
    
    const correctIndex = currentPuzzle.correctOption;
    let incorrectIndices = currentPuzzle.options
      .map((_, index) => (index !== correctIndex ? index : -1))
      .filter(index => index !== -1);
    
    if (incorrectIndices.length === 0) return;
    
    // Randomly select one incorrect option to reveal
    const randomIndex = Math.floor(Math.random() * incorrectIndices.length);
    const revealedIncorrectIndex = incorrectIndices[randomIndex];
    
    toast({
      title: "Hint",
      description: `"${currentPuzzle.options[revealedIncorrectIndex]}" is not the correct answer.`,
      variant: "default"
    });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      setUsername,
      selectTopic,
      startGame,
      resetGame,
      getCurrentPuzzle,
      submitAnswer,
      useHint,
      remainingTime
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameProvider");
  }
  return context;
}