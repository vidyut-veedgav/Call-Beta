import { Trophy } from "lucide-react";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@shared/schema";

export default function Leaderboard() {
  const { data: topUsers, isLoading } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });


  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <TopNavigation />
        <div className="px-4 py-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      <TopNavigation />

      <main className="pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-8">
          <div className="text-center">
            <Trophy className="mx-auto mb-4" size={48} />
            <h1 className="text-2xl font-bold mb-2">Leaderboard</h1>
            <p className="text-indigo-100">Top predictors by accuracy score</p>
          </div>
        </div>


        {/* Full Rankings */}
        <div className="px-4 py-4">
          <div className="space-y-3">
            {topUsers?.map((user, index) => {
              const rank = index + 1;
              const winRate = (user.totalBets || 0) > 0 ? 
                Math.round(((user.totalWins || 0) / (user.totalBets || 1)) * 100) : 0;

              return (
                <Card key={user.id} className="bg-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 text-gray-500 font-semibold">
                          #{rank}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.totalBets || 0} bets • {winRate}% win rate
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {user.accuracyScore}
                        </div>
                        <Badge 
                          variant="secondary"
                          className="text-xs"
                        >
                          {user.tokenBalance} tokens
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }) || (
              <p className="text-gray-500 text-center py-8">No users found</p>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
