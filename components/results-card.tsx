"use client";

import { useRouter } from "next/navigation";
import { useGameState } from "@/hooks/use-game-state";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PYTHON_TOPICS, PUZZLES } from "@/data/puzzles";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Clock, Home } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from 'react-confetti';
import { useState, useEffect } from "react";

export function ResultsCard() {
  const { gameState, resetGame } = useGameState();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);
  
  const topic = PYTHON_TOPICS.find(t => t.id === gameState.selectedTopic);
  const totalQuestions = gameState.selectedTopic ? PUZZLES[gameState.selectedTopic].length : 0;
  const percentage = Math.round((gameState.score / totalQuestions) * 100);
  
  const totalTimeSpent = gameState.answers.reduce((total, answer) => total + answer.timeSpent, 0);
  const minutes = Math.floor(totalTimeSpent / 60);
  const seconds = totalTimeSpent % 60;
  
  const handlePlayAgain = () => {
    resetGame();
    router.push("/");
  };
  
  return (
    <>
      {showConfetti && percentage > 70 && <Confetti />}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-3xl mx-auto neon-border">
          <CardHeader>
            <CardTitle className="text-2xl neon-text">Game Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div 
              className="text-center space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy className="h-16 w-16 mx-auto text-primary animate-float" />
              <h2 className="text-4xl font-bold neon-text">{percentage}%</h2>
              <p className="text-muted-foreground">
                You scored {gameState.score} out of {totalQuestions} in {topic?.name}
              </p>
            </motion.div>
            
            <div className="flex items-center justify-center gap-4 text-center">
              <motion.div 
                className="bg-secondary rounded-lg p-4 hover-glow"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <CheckCircle2 className="h-6 w-6 mx-auto text-green-500 mb-2" />
                <p className="text-2xl font-semibold">{gameState.score}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </motion.div>
              <motion.div 
                className="bg-secondary rounded-lg p-4 hover-glow"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <XCircle className="h-6 w-6 mx-auto text-red-500 mb-2" />
                <p className="text-2xl font-semibold">{totalQuestions - gameState.score}</p>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </motion.div>
              <motion.div 
                className="bg-secondary rounded-lg p-4 hover-glow"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Clock className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-2xl font-semibold">{minutes}:{seconds.toString().padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-muted rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-semibold mb-2">Question Summary</h3>
              <div className="space-y-2">
                {gameState.answers.map((answer, index) => {
                  const puzzle = PUZZLES[gameState.selectedTopic!]?.[index];
                  return (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      {answer.correct ? 
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" /> : 
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      }
                      <p className="text-sm truncate">{puzzle?.question}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-between">
            <Button 
              variant="outline" 
              onClick={() => router.push("/leaderboard")}
              className="hover-glow"
            >
              View Leaderboard
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => router.push("/")} 
                className="flex items-center gap-1 hover-glow"
              >
                <Home className="h-4 w-4" /> Home
              </Button>
              <Button 
                onClick={handlePlayAgain} 
                className="flex items-center gap-1 hover-glow"
              >
                <RotateCcw className="h-4 w-4" /> Play Again
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  );
}