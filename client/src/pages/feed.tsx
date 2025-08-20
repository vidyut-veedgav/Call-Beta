import { Flame, Plus, TrendingUp } from "lucide-react";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ClaimCard } from "@/components/claim-card";
import { ResolutionCard } from "@/components/resolution-card";
import { useActiveClaims } from "@/hooks/use-claims";
import { useCurrentUser } from "@/hooks/use-user";
import { useUserBets } from "@/hooks/use-bets";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Feed() {
  const { data: claims, isLoading: claimsLoading } = useActiveClaims();
  const { data: user } = useCurrentUser();
  const { data: userBets } = useUserBets(user?.id || "");

  const getUserBetForClaim = (claimId: string) => {
    if (!userBets) return null;
    const bet = userBets.find(bet => bet.claimId === claimId);
    return bet ? { position: bet.position, amount: bet.amount } : null;
  };

  // Generate hot markets based on actual claims data
  const getHotMarkets = () => {
    if (!claims || claims.length === 0) {
      return [
        { label: "Most Active", subtitle: "Bitcoin $80k", count: "124 bets" },
        { label: "Trending", subtitle: "Apple Foldable", count: "89 bets" },
        { label: "New", subtitle: "SpaceX Mars", count: "45 bets" },
      ];
    }

    const sortedByActivity = [...claims]
      .sort((a, b) => (b.totalYesStake + b.totalNoStake) - (a.totalYesStake + a.totalNoStake))
      .slice(0, 3);

    return sortedByActivity.map((claim, index) => {
      const labels = ["Most Active", "Trending", "Hot"];
      const words = claim.text.split(' ');
      const shortTitle = words.slice(0, 2).join(' ');
      const totalStake = claim.totalYesStake + claim.totalNoStake;
      
      return {
        label: labels[index] || "Popular",
        subtitle: shortTitle,
        count: `${claim.totalBettors} bettors`,
        stake: `${(totalStake / 1000).toFixed(1)}k`
      };
    });
  };

  const hotMarkets = getHotMarkets();

  if (claimsLoading) {
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
        {/* Claims Feed */}
        <div className="space-y-4 px-4 py-4">
          {claims?.map(claim => {
            const userBet = getUserBetForClaim(claim.id);
            
            // Show resolution card for expired claims
            if (claim.status === "expired" || new Date(claim.expiresAt) <= new Date()) {
              return (
                <ResolutionCard
                  key={claim.id}
                  claim={claim}
                  resolutions={[]} // We'd need to fetch resolutions here
                />
              );
            }

            return (
              <ClaimCard
                key={claim.id}
                claim={claim}
                userBet={userBet}
              />
            );
          })}

          {claims?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No active claims available</p>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
