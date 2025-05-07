"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PYTHON_TOPICS } from "@/data/puzzles";
import { LeaderboardEntry } from "@/types/game";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import { format } from "date-fns";

export function LeaderboardComponent() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLeaderboard = localStorage.getItem("pythonPuzzleLeaderboard");
      if (storedLeaderboard) {
        try {
          const parsedLeaderboard = JSON.parse(storedLeaderboard);
          setLeaderboard(parsedLeaderboard);
        } catch (e) {
          console.error("Failed to parse leaderboard:", e);
          setLeaderboard([]);
        }
      }
    }
  }, []);
  
  const filteredLeaderboard = selectedTopic 
    ? leaderboard.filter(entry => entry.topic === selectedTopic)
    : leaderboard;
  
  // Sort by score (descending) and then by time (ascending)
  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.totalTime - b.totalTime;
  });
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Python Puzzle Leaderboard
        </CardTitle>
        <CardDescription>See who's mastering Python concepts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={selectedTopic === null ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedTopic(null)}
          >
            All Topics
          </Button>
          {PYTHON_TOPICS.map(topic => (
            <Button
              key={topic.id}
              variant={selectedTopic === topic.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTopic(topic.id)}
            >
              {topic.name}
            </Button>
          ))}
        </div>
        
        {sortedLeaderboard.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Rank</th>
                  <th className="text-left py-2 px-4">Player</th>
                  <th className="text-left py-2 px-4">Topic</th>
                  <th className="text-left py-2 px-4">Score</th>
                  <th className="text-left py-2 px-4">Time</th>
                  <th className="text-left py-2 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((entry, index) => {
                  const topic = PYTHON_TOPICS.find(t => t.id === entry.topic);
                  const minutes = Math.floor(entry.totalTime / 60);
                  const seconds = entry.totalTime % 60;
                  const date = new Date(entry.date);
                  
                  return (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {index < 3 ? (
                          <Medal className={`h-5 w-5 ${
                            index === 0 
                              ? "text-yellow-500" 
                              : index === 1 
                                ? "text-gray-300" 
                                : "text-amber-600"
                          }`} />
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className="py-3 px-4">{entry.username}</td>
                      <td className="py-3 px-4">{topic?.name || "Unknown"}</td>
                      <td className="py-3 px-4">{entry.score}</td>
                      <td className="py-3 px-4">{minutes}:{seconds.toString().padStart(2, '0')}</td>
                      <td className="py-3 px-4">{format(date, 'MMM d, yyyy')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data available. Play some games to see the leaderboard!</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to Game
        </Button>
      </CardFooter>
    </Card>
  );
}