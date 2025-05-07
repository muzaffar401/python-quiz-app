"use client";

import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Code2, Trophy, Home } from "lucide-react";

export function Header() {
  const router = useRouter();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Code2 className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline-block">Python Puzzle Game</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/")}
            className="hidden sm:flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/leaderboard")}
            className="hidden sm:flex items-center gap-1"
          >
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}