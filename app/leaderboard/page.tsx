"use client";

import { LeaderboardComponent } from "@/components/leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you stack up against other Python enthusiasts
        </p>
      </div>
      
      <LeaderboardComponent />
    </div>
  );
}