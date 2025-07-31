import { Users, Coins, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BetModal } from "./bet-modal";
import { formatDistanceToNow } from "date-fns";
import type { Claim } from "@shared/schema";

interface ClaimCardProps {
  claim: Claim;
  userBet?: { position: boolean; amount: number } | null;
}

export function ClaimCard({ claim, userBet }: ClaimCardProps) {
  const [betModalOpen, setBetModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<boolean | null>(null);

  const totalStake = claim.totalYesStake + claim.totalNoStake;
  const yesOdds = totalStake === 0 ? 50 : Math.round((claim.totalYesStake / totalStake) * 100);
  const noOdds = 100 - yesOdds;

  const timeUntilExpiry = formatDistanceToNow(new Date(claim.expiresAt), { addSuffix: true });
  const isExpired = new Date(claim.expiresAt) <= new Date();

  const handleBetClick = (position: boolean) => {
    if (isExpired) return;
    setSelectedPosition(position);
    setBetModalOpen(true);
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
        userBet ? "bg-blue-50 border-blue-200" : ""
      }`}>
        {/* Claim Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">@{claim.creatorUsername}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(claim.createdAt), { addSuffix: true })}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                isExpired 
                  ? "text-gray-600 bg-gray-100" 
                  : "text-amber-600 bg-amber-50"
              }`}>
                {isExpired ? "Expired" : `Expires ${timeUntilExpiry}`}
              </span>
            </div>
          </div>
          <p className="text-gray-900 font-medium leading-relaxed">
            {claim.text}
          </p>
        </div>

        {/* User's Bet Indicator */}
        {userBet && (
          <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
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

        {/* Odds Display */}
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center flex-1">
              <div className="text-2xl font-bold call-yes">{yesOdds}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">YES</div>
            </div>
            <div className="px-4">
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 rounded-full transition-all duration-300" 
                  style={{ width: `${yesOdds}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="text-2xl font-bold call-no">{noOdds}%</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">NO</div>
            </div>
          </div>
          
          {/* Betting Buttons */}
          <div className="flex space-x-3">
            <Button 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              onClick={() => handleBetClick(true)}
              disabled={isExpired}
            >
              <ThumbsUp size={16} />
              <span>Bet YES</span>
            </Button>
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              onClick={() => handleBetClick(false)}
              disabled={isExpired}
            >
              <ThumbsDown size={16} />
              <span>Bet NO</span>
            </Button>
          </div>
        </div>

        {/* Betting Stats */}
        <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Users size={16} className="mr-1" />
              {claim.totalBettors} bettors
            </span>
            <span className="flex items-center">
              <Coins size={16} className="mr-1" />
              {(totalStake / 1000).toFixed(1)}k staked
            </span>
          </div>
          <button className="text-indigo-500 hover:text-indigo-700">
            <TrendingUp size={16} />
          </button>
        </div>
      </div>

      <BetModal
        claim={claim}
        position={selectedPosition}
        isOpen={betModalOpen}
        onClose={() => setBetModalOpen(false)}
      />
    </>
  );
}
