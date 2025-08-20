import { Users, Coins, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-user";
import { usePlaceBet } from "@/hooks/use-bets";
import { useToast } from "@/hooks/use-toast";
import type { Claim } from "@shared/schema";

interface ClaimCardProps {
  claim: Claim;
  userBet?: { position: boolean; amount: number } | null;
}

export function ClaimCard({ claim, userBet }: ClaimCardProps) {
  const [selectedPosition, setSelectedPosition] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [betAmount, setBetAmount] = useState("100");
  
  const { data: user } = useCurrentUser();
  const { mutate: placeBet, isPending } = usePlaceBet();
  const { toast } = useToast();

  const totalStake = (claim.totalYesStake || 0) + (claim.totalNoStake || 0);
  const yesPercentage = totalStake === 0 ? 50 : Math.round(((claim.totalYesStake || 0) / totalStake) * 100);
  const noPercentage = 100 - yesPercentage;

  const isExpired = claim.expiresAt ? new Date(claim.expiresAt) <= new Date() : false;

  const betAmountNum = parseInt(betAmount) || 0;
  const currentOdds = selectedPosition === true ? yesPercentage : selectedPosition === false ? noPercentage : 50;
  const potentialPayout = betAmountNum > 0 ? Math.round(betAmountNum * (100 / currentOdds)) : 0;
  const profit = potentialPayout - betAmountNum;
  const profitPercentage = betAmountNum > 0 ? Math.round((profit / betAmountNum) * 100) : 0;

  const handleBetClick = (position: boolean) => {
    if (isExpired) return;
    setSelectedPosition(selectedPosition === position ? null : position);
  };

  const handleConfirmBet = () => {
    if (!user || selectedPosition === null || betAmountNum <= 0) return;
    
    if (betAmountNum > user.tokenBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough tokens for this bet.",
        variant: "destructive",
      });
      return;
    }

    placeBet({
      userId: user.id,
      claimId: claim.id,
      position: selectedPosition,
      amount: betAmountNum,
      odds: currentOdds.toString(),
    }, {
      onSuccess: () => {
        toast({
          title: "Bet Placed!",
          description: `You bet ${betAmountNum} tokens on ${selectedPosition ? "YES" : "NO"}`,
        });
        setSelectedPosition(null);
        setBetAmount("100");
        setIsExpanded(false);
      },
      onError: (error: any) => {
        toast({
          title: "Failed to Place Bet",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <>
      <div 
        className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer ${
          userBet ? "bg-blue-50 border-blue-200" : ""
        }`}
        onClick={() => {
          if (!userBet) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {/* Claim Header */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">@{claim.creatorUsername}</span>
              <span className="text-xs text-gray-500">
                {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : ''}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                isExpired 
                  ? "text-gray-600 bg-gray-100" 
                  : "text-amber-600 bg-amber-50"
              }`}>
                {isExpired ? "Expired" : claim.expiresAt ? `Expires ${new Date(claim.expiresAt).toLocaleDateString()}` : "No expiration"}
              </span>
            </div>
          </div>
          <p className="text-gray-900 font-medium leading-relaxed">
            {claim.text}
          </p>
        </div>


        {/* Odds Display - Always Visible */}
        <div className="px-4 py-3">
          <div className="relative w-full h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center">
            {/* YES section (dark green) */}
            <div 
              className="h-full bg-green-700 flex items-center justify-center text-white font-bold text-sm transition-all duration-300"
              style={{ width: `${yesPercentage}%` }}
            >
              <span>YES {yesPercentage}%</span>
            </div>
            {/* NO section (dark red) */}
            <div 
              className="h-full bg-red-700 flex items-center justify-center text-white font-bold text-sm transition-all duration-300"
              style={{ width: `${noPercentage}%` }}
            >
              <span>NO {noPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Betting Stats - Always Visible */}
        <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-between border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Users size={16} className="mr-1" />
              {claim.totalBettors} bettors
            </span>
            <span className="flex items-center">
              <Coins size={16} className="mr-1" />
              {totalStake > 1000 ? `${(totalStake / 1000).toFixed(1)}k` : totalStake} staked
            </span>
          </div>
          <button className="text-indigo-500 hover:text-indigo-700">
            <TrendingUp size={16} />
          </button>
        </div>
        
        {/* User's Bet Indicator - Always Visible When User Has Bet */}
        {userBet && (
          <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-blue-800">Your Bet</span>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                {userBet.amount} tokens on {userBet.position ? "YES" : "NO"}
              </span>
            </div>
          </div>
        )}
        
        {/* Expanded Content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {/* Betting Interface */}
          <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex space-x-4">
                {/* Left side - Betting buttons in vertical column */}
                <div className="flex flex-col space-y-2 w-36">
                  <Button 
                    variant="outline"
                    className={`py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      selectedPosition === true 
                        ? "bg-green-700 text-white border-green-700 hover:bg-green-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBetClick(true);
                    }}
                    disabled={isExpired}
                  >
                    <ThumbsUp size={16} />
                    <span>Bet YES</span>
                  </Button>
                  <Button 
                    variant="outline"
                    className={`py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      selectedPosition === false 
                        ? "bg-red-700 text-white border-red-700 hover:bg-red-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBetClick(false);
                    }}
                    disabled={isExpired}
                  >
                    <ThumbsDown size={16} />
                    <span>Bet NO </span>
                  </Button>
                </div>

                {/* Right side - Bet amount input and calculations */}
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Enter tokens"
                        value={betAmount}
                        onChange={(e) => {
                          e.stopPropagation();
                          setBetAmount(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="pr-16"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                        tokens
                      </div>
                    </div>
                    
                    {/* Quick amount buttons */}
                    <div className="flex space-x-1 mt-2">
                      {[10, 25, 50, 100, 500].map(amount => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBetAmount(amount.toString());
                          }}
                          className="text-xs px-2 py-1"
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Payout calculations - shown when amount is entered */}
                  {betAmountNum > 0 && selectedPosition !== null && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Potential Payout:</span>
                        <span className="font-semibold">{potentialPayout} tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit:</span>
                        <span className={`font-semibold ${profit > 0 ? "text-green-600" : "text-red-500"}`}>
                          {profit > 0 ? "+" : ""}{profit} tokens ({profitPercentage}%)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Confirm bet button */}
                  {selectedPosition !== null && betAmountNum > 0 && (
                    <Button
                      className={`w-full font-semibold py-2 px-4 rounded-lg transition-all duration-200 ${
                        selectedPosition ? "bg-green-700 hover:bg-green-700" : "bg-red-700 hover:bg-red-700"
                      } text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmBet();
                      }}
                      disabled={isExpired || isPending || !user}
                    >
                      {isPending ? "Placing Bet..." : "Confirm Bet"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>

    </>
  );
}
