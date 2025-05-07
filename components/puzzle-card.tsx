"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/use-game-state";
import { CodeBlock } from "@/components/code-block";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HelpCircle, Clock, Zap } from "lucide-react";
import { PUZZLES } from "@/data/puzzles";

export function PuzzleCard() {
  const { gameState, getCurrentPuzzle, submitAnswer, useHint, remainingTime } = useGameState();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const currentPuzzle = getCurrentPuzzle();
  
  if (!currentPuzzle) {
    return <div>No puzzle available</div>;
  }
  
  const timePercentage = (remainingTime / gameState.timer) * 100;
  const currentIndex = gameState.currentPuzzleIndex;
  const totalPuzzles = gameState.selectedTopic ? PUZZLES[gameState.selectedTopic].length : 0;
  
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    submitAnswer(index);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-3xl mx-auto neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              Question {currentIndex + 1} of {totalPuzzles}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={useHint}
                className="hover-glow"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 bg-secondary rounded-full px-3 py-1">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{remainingTime}s</span>
              </div>
            </div>
          </div>
          <Progress value={timePercentage} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.h3 
            className="text-lg font-medium neon-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {currentPuzzle.question}
          </motion.h3>
          
          {currentPuzzle.code && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CodeBlock code={currentPuzzle.code} />
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 gap-3 mt-4">
            <AnimatePresence>
              {currentPuzzle.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`justify-start h-auto py-3 px-4 font-mono text-left w-full hover-glow
                      ${selectedOption === index ? 'border-primary' : ''}`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}