import { Flame, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ClaimCard } from "@/components/claim-card";
import { ResolutionCard } from "@/components/resolution-card";
import { CreateClaimModal } from "@/components/create-claim-modal";
import { useActiveClaims } from "@/hooks/use-claims";
import { useCurrentUser } from "@/hooks/use-user";
import { useUserBets } from "@/hooks/use-bets";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Feed() {
  const { data: claims, isLoading: claimsLoading } = useActiveClaims();
  const { data: user } = useCurrentUser();
  const { data: userBets } = useUserBets(user?.id || "");
  const [createClaimOpen, setCreateClaimOpen] = useState(false);

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
        {/* Create Claim & Hot Markets Section */}
        <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Flame className="mr-2 text-orange-500" size={20} />
              Hot Markets
            </h2>
            <Button 
              size="sm" 
              onClick={() => setCreateClaimOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1"
            >
              <Plus size={14} className="mr-1" />
              Create
            </Button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {hotMarkets.map((market, index) => (
              <div key={index} className="bg-white rounded-lg px-3 py-2 min-w-max shadow-sm border">
                <div className="flex items-center space-x-1 mb-1">
                  <div className="text-xs text-gray-500">{market.label}</div>
                  <TrendingUp size={10} className="text-orange-500" />
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">{market.subtitle}</div>
                <div className="text-xs text-gray-400">{market.count}</div>
                {market.stake && (
                  <div className="text-xs text-indigo-600 font-medium">{market.stake} staked</div>
                )}
              </div>
            ))}
          </div>
        </div>

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
      
      <CreateClaimModal 
        isOpen={createClaimOpen}
        onClose={() => setCreateClaimOpen(false)}
      />
    </div>
  );
}
