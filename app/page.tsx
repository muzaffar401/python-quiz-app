"use client";

import { useGameState } from "@/hooks/use-game-state";
import { UsernameForm } from "@/components/username-form";
import { TopicSelector } from "@/components/topic-selector";
import { PuzzleCard } from "@/components/puzzle-card";
import { ResultsCard } from "@/components/results-card";
import { Brain, Code, Lightbulb } from "lucide-react";

export default function Home() {
  const { gameState } = useGameState();

  // Helper function to determine current step
  const renderCurrentStep = () => {
    if (gameState.gameFinished) {
      return <ResultsCard />;
    }
    
    if (gameState.gameStarted) {
      return <PuzzleCard />;
    }
    
    if (gameState.username) {
      return <TopicSelector />;
    }
    
    return <UsernameForm />;
  };

  return (
    <div className="container py-8">
      {/* Game Logo & Title Section */}
      {!gameState.gameStarted && (
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Python Puzzle Game</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Test your Python knowledge with interactive puzzles. Learn, practice, and improve your skills!
          </p>
        </div>
      )}
      
      {/* Main Game Content */}
      <div className="py-4">
        {renderCurrentStep()}
      </div>
      
      {/* Features Section - only on initial screen */}
      {!gameState.username && (
        <div className="mt-12 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Improve Your Python Skills</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">9 Python Topics</h3>
              <p className="text-muted-foreground">
                Practice everything from basic variables to complex data structures like dictionaries and sets.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Interactive Learning</h3>
              <p className="text-muted-foreground">
                Solve puzzles with code examples and get instant feedback on your answers.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your performance and compare with others on the leaderboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}