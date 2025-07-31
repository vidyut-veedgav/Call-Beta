import { User, Trophy, Target, TrendingUp } from "lucide-react";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useCurrentUser } from "@/hooks/use-user";
import { useUserBets } from "@/hooks/use-bets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Profile() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: userBets } = useUserBets(user?.id || "");

  const winRate = user && user.totalBets > 0 ? 
    Math.round((user.totalWins / user.totalBets) * 100) : 0;

  const stats = [
    {
      icon: Target,
      label: "Total Bets",
      value: user?.totalBets || 0,
      color: "text-blue-600",
    },
    {
      icon: Trophy,
      label: "Win Rate",
      value: `${winRate}%`,
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Accuracy Score",
      value: user?.accuracyScore || "0.00",
      color: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <TopNavigation />
        <div className="px-4 py-4">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      <TopNavigation />

      <main className="pb-20 px-4 py-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-indigo-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {user?.username || "Anonymous User"}
          </h1>
          <Badge variant="secondary" className="mb-4">
            Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Unknown"}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Bets */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bets</h2>
          <div className="space-y-3">
            {userBets?.slice(0, 5).map(bet => (
              <div key={bet.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={bet.position ? "default" : "destructive"}>
                    {bet.position ? "YES" : "NO"}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {bet.amount} tokens
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Bet placed on {new Date(bet.createdAt).toLocaleDateString()}
                </div>
                {bet.isResolved && (
                  <div className="mt-2">
                    <Badge variant={bet.payout > bet.amount ? "default" : "destructive"}>
                      {bet.payout > bet.amount ? `Won ${bet.payout}` : "Lost"}
                    </Badge>
                  </div>
                )}
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No bets placed yet</p>
            )}
          </div>
        </div>

        {/* Achievement Badges */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center">
              <Trophy className="text-yellow-600 mx-auto mb-2" size={24} />
              <div className="text-sm font-medium text-yellow-800">First Bet</div>
              <div className="text-xs text-yellow-600">Placed your first prediction</div>
            </div>
            
            {user && user.totalBets >= 10 && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <Target className="text-blue-600 mx-auto mb-2" size={24} />
                <div className="text-sm font-medium text-blue-800">Active Predictor</div>
                <div className="text-xs text-blue-600">Made 10+ predictions</div>
              </div>
            )}
            
            {winRate >= 70 && (
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                <TrendingUp className="text-green-600 mx-auto mb-2" size={24} />
                <div className="text-sm font-medium text-green-800">Accurate Oracle</div>
                <div className="text-xs text-green-600">70%+ win rate</div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
