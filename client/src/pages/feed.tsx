import { Flame } from "lucide-react";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ClaimCard } from "@/components/claim-card";
import { ResolutionCard } from "@/components/resolution-card";
import { useActiveClaims } from "@/hooks/use-claims";
import { useCurrentUser } from "@/hooks/use-user";
import { useUserBets } from "@/hooks/use-bets";
import { Skeleton } from "@/components/ui/skeleton";

export default function Feed() {
  const { data: claims, isLoading: claimsLoading } = useActiveClaims();
  const { data: user } = useCurrentUser();
  const { data: userBets } = useUserBets(user?.id || "");

  const getUserBetForClaim = (claimId: string) => {
    if (!userBets) return null;
    const bet = userBets.find(bet => bet.claimId === claimId);
    return bet ? { position: bet.position, amount: bet.amount } : null;
  };

  const hotMarkets = [
    { label: "Most Active", subtitle: "Bitcoin $80k" },
    { label: "Trending", subtitle: "Election 2024" },
    { label: "New", subtitle: "AI Breakthrough" },
  ];

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

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-gray-100 px-4">
        <div className="flex space-x-8">
          <button className="py-3 border-b-2 border-indigo-500 text-indigo-500 font-medium text-sm">
            Feed
          </button>
          <button className="py-3 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
            Profile
          </button>
          <button className="py-3 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
            Leaderboard
          </button>
        </div>
      </nav>

      <main className="pb-20">
        {/* Hot Markets Section */}
        <div className="px-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Flame className="mr-2 text-orange-500" size={20} />
              Hot Markets
            </h2>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {hotMarkets.map((market, index) => (
              <div key={index} className="bg-white rounded-lg px-3 py-2 min-w-max shadow-sm border">
                <div className="text-xs text-gray-500">{market.label}</div>
                <div className="text-sm font-medium text-gray-900">{market.subtitle}</div>
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
    </div>
  );
}
