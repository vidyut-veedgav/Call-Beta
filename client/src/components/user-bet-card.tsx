import { Clock, TrendingUp, TrendingDown, Coins } from "lucide-react";
import type { Claim } from "@shared/schema";

interface UserBetCardProps {
  claim: Claim;
  userBet: {
    position: boolean;
    amount: number;
    odds: string;
  };
}

export function UserBetCard({ claim, userBet }: UserBetCardProps) {
  const isExpired = claim.expiresAt ? new Date(claim.expiresAt) <= new Date() : false;
  const currentOdds = parseInt(userBet.odds) || 50;
  const potentialPayout = Math.round(userBet.amount * (100 / currentOdds));
  const profit = potentialPayout - userBet.amount;
  
  const totalStake = (claim.totalYesStake || 0) + (claim.totalNoStake || 0);
  const yesPercentage = totalStake === 0 ? 50 : Math.round(((claim.totalYesStake || 0) / totalStake) * 100);
  const noPercentage = 100 - yesPercentage;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with position indicator */}
      <div className={`px-4 py-3 ${
        userBet.position ? "bg-green-50 border-b border-green-200" : "bg-red-50 border-b border-red-200"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-1 rounded-full ${
              userBet.position ? "bg-green-600" : "bg-red-600"
            }`}>
              {userBet.position ? (
                <TrendingUp size={16} className="text-white" />
              ) : (
                <TrendingDown size={16} className="text-white" />
              )}
            </div>
            <span className={`text-sm font-bold ${
              userBet.position ? "text-green-800" : "text-red-800"
            }`}>
              {userBet.position ? "YES" : "NO"} Position
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
      </div>

      {/* Claim text */}
      <div className="px-4 py-3">
        <p className="text-gray-900 font-medium leading-relaxed mb-3">
          {claim.text}
        </p>
        
        {/* Current market odds */}
        <div className="relative w-full h-8 bg-gray-200 rounded-lg overflow-hidden flex items-center mb-3">
          <div 
            className="h-full bg-green-600 flex items-center justify-center text-white font-bold text-xs transition-all duration-300"
            style={{ width: `${yesPercentage}%` }}
          >
            <span>YES {yesPercentage}%</span>
          </div>
          <div 
            className="h-full bg-red-600 flex items-center justify-center text-white font-bold text-xs transition-all duration-300"
            style={{ width: `${noPercentage}%` }}
          >
            <span>NO {noPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Bet details */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Wager:</span>
              <span className="text-sm font-semibold text-gray-900 flex items-center">
                <Coins size={14} className="mr-1" />
                {userBet.amount} tokens
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Your Odds:</span>
              <span className="text-sm font-semibold text-gray-900">
                {currentOdds}%
              </span>
            </div>
          </div>
          
          {/* Right column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Potential Payout:</span>
              <span className="text-sm font-semibold text-gray-900">
                {potentialPayout} tokens
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profit:</span>
              <span className={`text-sm font-semibold ${
                profit > 0 ? "text-green-600" : "text-red-500"
              }`}>
                {profit > 0 ? "+" : ""}{profit} tokens
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status footer */}
      <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <Clock size={12} className="mr-1" />
            Bet placed on {new Date().toLocaleDateString()}
          </span>
          <span className={`font-medium ${
            isExpired ? "text-gray-600" : "text-blue-600"
          }`}>
            {isExpired ? "Awaiting Resolution" : "Active"}
          </span>
        </div>
      </div>
    </div>
  );
}