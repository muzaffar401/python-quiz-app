"use client";

import { useState } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function UsernameForm() {
  const { gameState, setUsername } = useGameState();
  const [inputName, setInputName] = useState(gameState.username);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to continue",
        variant: "destructive",
      });
      return;
    }
    
    setUsername(inputName);
    toast({
      title: "Welcome!",
      description: `Hello, ${inputName}! Now select a Python topic to begin.`,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome to Python Puzzle</CardTitle>
        <CardDescription>Enter your name to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Your Name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full"
            autoFocus
          />
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}