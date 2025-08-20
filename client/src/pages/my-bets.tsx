import { useCurrentUser } from "@/hooks/use-user";
import { useUserBets } from "@/hooks/use-bets";
import { useQuery } from "@tanstack/react-query";
import { UserBetCard } from "@/components/user-bet-card";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins, TrendingUp } from "lucide-react";
import type { Claim } from "@shared/schema";

export default function MyBets() {
  const { data: user } = useCurrentUser();
  const { data: userBets, isLoading: betsLoading } = useUserBets(user?.id || "");
  
  // Fetch claims for the user's bets to get claim details
  const { data: claims } = useQuery<Claim[]>({
    queryKey: ["/api/claims"],
    enabled: !!userBets?.length,
  });

  // Combine bets with their corresponding claims
  const betsWithClaims = userBets?.map(bet => {
    const claim = claims?.find(c => c.id === bet.claimId);
    return claim ? { bet, claim } : null;
  }).filter((item): item is { bet: typeof userBets[0], claim: Claim } => item !== null) || [];

  // Filter active bets (not expired and not resolved)
  const activeBets = betsWithClaims.filter(({ claim, bet }) => {
    const isExpired = claim.expiresAt ? new Date(claim.expiresAt) <= new Date() : false;
    return !bet.isResolved && !isExpired;
  });

  // Calculate total active stake
  const totalActiveStake = activeBets.reduce((sum, { bet }) => sum + bet.amount, 0);

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <TopNavigation />
        <div className="px-4 py-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Please log in to view your bets.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (betsLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        <TopNavigation />
        <div className="px-4 py-4 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-20 w-full mb-4" />
              <div className="flex space-x-3">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 flex-1" />
              </div>
            </div>
          ))}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      <TopNavigation />
      
      <main className="pb-20">
        {/* Header with stats */}
        {activeBets.length > 0 && (
          <div className="px-4 py-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp size={20} className="text-blue-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{activeBets.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Active Bets</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Coins size={20} className="text-green-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{totalActiveStake}</span>
                  </div>
                  <p className="text-sm text-gray-600">Total Staked</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bets list */}
        <div className="space-y-4 px-4 py-4">
          {activeBets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Bets</h3>
              <p className="text-gray-500 mb-4">
                You haven't placed any bets yet. Head to the feed to start betting on predictions!
              </p>
            </div>
          ) : (
            activeBets.map(({ bet, claim }) => (
              <UserBetCard
                key={bet.id}
                claim={claim}
                userBet={{
                  position: bet.position,
                  amount: bet.amount,
                  odds: bet.odds.toString(),
                }}
              />
            ))
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}