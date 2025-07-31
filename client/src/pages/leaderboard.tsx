import { Trophy, Medal, Award, Crown } from "lucide-react";
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return <Trophy className="text-gray-300" size={16} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

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

        {/* Top 3 Podium */}
        {topUsers && topUsers.length >= 3 && (
          <div className="px-4 py-6 bg-gray-50">
            <div className="flex items-end justify-center space-x-4">
              {/* 2nd Place */}
              <div className="text-center">
                <div className="w-16 h-20 bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-lg flex items-end justify-center pb-2">
                  <Medal className="text-white" size={24} />
                </div>
                <div className="bg-white rounded-lg p-3 mt-2 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900">
                    {topUsers[1]?.username || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {topUsers[1]?.accuracyScore || "0.00"}
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center">
                <div className="w-16 h-24 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-lg flex items-end justify-center pb-2">
                  <Crown className="text-white" size={28} />
                </div>
                <div className="bg-white rounded-lg p-3 mt-2 shadow-sm border-2 border-yellow-300">
                  <div className="text-sm font-semibold text-gray-900">
                    {topUsers[0]?.username || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {topUsers[0]?.accuracyScore || "0.00"}
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-b from-amber-500 to-amber-600 rounded-t-lg flex items-end justify-center pb-2">
                  <Award className="text-white" size={20} />
                </div>
                <div className="bg-white rounded-lg p-3 mt-2 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900">
                    {topUsers[2]?.username || "N/A"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {topUsers[2]?.accuracyScore || "0.00"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings */}
        <div className="px-4 py-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Rankings</h2>
          <div className="space-y-3">
            {topUsers?.map((user, index) => {
              const rank = index + 1;
              const winRate = user.totalBets > 0 ? 
                Math.round((user.totalWins / user.totalBets) * 100) : 0;

              return (
                <Card key={user.id} className={getRankColor(rank)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8">
                          {getRankIcon(rank)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            #{rank} {user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.totalBets} bets • {winRate}% win rate
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {user.accuracyScore}
                        </div>
                        <Badge 
                          variant={rank <= 10 ? "default" : "secondary"}
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
