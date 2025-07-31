import { Wallet as WalletIcon, TrendingUp, TrendingDown, History, Plus } from "lucide-react";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useCurrentUser } from "@/hooks/use-user";
import { useUserBets } from "@/hooks/use-bets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Wallet() {
  const { data: user, isLoading } = useCurrentUser();
  const { data: userBets } = useUserBets(user?.id || "");

  const totalStaked = userBets?.reduce((sum, bet) => sum + bet.amount, 0) || 0;
  const totalPayout = userBets?.reduce((sum, bet) => sum + (bet.payout || 0), 0) || 0;
  const netProfit = totalPayout - totalStaked;

  const recentTransactions = userBets?.slice(0, 10).map(bet => ({
    id: bet.id,
    type: "bet",
    amount: -bet.amount,
    description: `Bet ${bet.position ? "YES" : "NO"}`,
    date: new Date(bet.createdAt),
    status: bet.isResolved ? (bet.payout > 0 ? "won" : "lost") : "pending",
    payout: bet.payout,
  })) || [];

  const stats = [
    {
      icon: WalletIcon,
      label: "Current Balance",
      value: `${user?.tokenBalance || 0} tokens`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Total Staked",
      value: `${totalStaked} tokens`,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: netProfit >= 0 ? TrendingUp : TrendingDown,
      label: "Net Profit/Loss",
      value: `${netProfit > 0 ? "+" : ""}${netProfit} tokens`,
      color: netProfit >= 0 ? "text-green-600" : "text-red-600",
      bgColor: netProfit >= 0 ? "bg-green-50" : "bg-red-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <TopNavigation />
        <div className="px-4 py-4">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 rounded-lg"></div>
              <div className="h-16 bg-gray-200 rounded-lg"></div>
              <div className="h-16 bg-gray-200 rounded-lg"></div>
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
        {/* Wallet Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WalletIcon className="text-indigo-600" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your tokens and view transaction history</p>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4 mb-8">
          {stats.map(({ icon: Icon, label, value, color, bgColor }) => (
            <Card key={label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
              <Plus size={20} />
              <span className="text-sm">Add Tokens</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center space-y-2">
              <History size={20} />
              <span className="text-sm">View History</span>
            </Button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentTransactions.map(transaction => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.amount < 0 ? "bg-red-50" : "bg-green-50"
                      }`}>
                        {transaction.amount < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {transaction.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.amount < 0 ? "text-red-600" : "text-green-600"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                      </div>
                      <Badge 
                        variant={
                          transaction.status === "won" ? "default" :
                          transaction.status === "lost" ? "destructive" :
                          "secondary"
                        }
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                  {transaction.status === "won" && transaction.payout > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="text-sm text-green-600">
                        Payout: +{transaction.payout} tokens
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {recentTransactions.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Place your first bet to see activity here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
