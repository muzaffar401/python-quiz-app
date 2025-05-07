"use client";

import { useGameState } from "@/hooks/use-game-state";
import { PYTHON_TOPICS } from "@/data/puzzles";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Variable, Shuffle, Package, List, Text, Brackets, KeyRound, 
  CircleDot, Snowflake, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  "Variable": <Variable className="h-6 w-6" />,
  "Shuffle": <Shuffle className="h-6 w-6" />,
  "Package": <Package className="h-6 w-6" />,
  "List": <List className="h-6 w-6" />,
  "Text": <Text className="h-6 w-6" />,
  "Brackets": <Brackets className="h-6 w-6" />,
  "KeyRound": <KeyRound className="h-6 w-6" />,
  "CircleDot": <CircleDot className="h-6 w-6" />,
  "Snowflake": <Snowflake className="h-6 w-6" />,
};

export function TopicSelector() {
  const { gameState, selectTopic, startGame } = useGameState();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Choose a Python Topic</CardTitle>
        <CardDescription>Select a topic to practice Python concepts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PYTHON_TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => selectTopic(topic.id)}
              className={cn(
                "p-4 rounded-lg border border-border transition-colors",
                "hover:bg-accent hover:border-primary",
                gameState.selectedTopic === topic.id ? "bg-accent border-primary" : "bg-background"
              )}
            >
              <div className="flex items-center gap-3">
                {iconMap[topic.icon]}
                <div className="text-left">
                  <h3 className="font-medium">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={startGame}
          disabled={!gameState.selectedTopic}
          className="flex items-center gap-2"
        >
          Start Game <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}