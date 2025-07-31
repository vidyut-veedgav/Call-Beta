import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCurrentUser } from "@/hooks/use-user";
import { usePlaceBet } from "@/hooks/use-bets";
import { useToast } from "@/hooks/use-toast";
import type { Claim } from "@shared/schema";

interface BetModalProps {
  claim: Claim;
  position: boolean | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BetModal({ claim, position, isOpen, onClose }: BetModalProps) {
  const [betAmount, setBetAmount] = useState("");
  const { data: user } = useCurrentUser();
  const { mutate: placeBet, isPending } = usePlaceBet();
  const { toast } = useToast();

  const totalStake = claim.totalYesStake + claim.totalNoStake;
  const currentOdds = totalStake === 0 ? 50 : position ? 
    Math.round((claim.totalYesStake / totalStake) * 100) : 
    Math.round((claim.totalNoStake / totalStake) * 100);

  const betAmountNum = parseInt(betAmount) || 0;
  const potentialPayout = betAmountNum > 0 ? Math.round(betAmountNum * (100 / currentOdds)) : 0;
  const profit = potentialPayout - betAmountNum;
  const profitPercentage = betAmountNum > 0 ? Math.round((profit / betAmountNum) * 100) : 0;

  const handleSubmit = () => {
    if (!user || !position !== null || betAmountNum <= 0) return;
    
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
      position: position!,
      amount: betAmountNum,
      odds: currentOdds.toString(),
    }, {
      onSuccess: () => {
        toast({
          title: "Bet Placed!",
          description: `You bet ${betAmountNum} tokens on ${position ? "YES" : "NO"}`,
        });
        onClose();
        setBetAmount("");
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

  const quickAmounts = [10, 25, 50, 100];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Place Bet
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-2">{claim.text}</p>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Betting on:</span>
                <span className={`text-sm font-semibold ${
                  position ? "call-yes" : "call-no"
                }`}>
                  {position ? "YES" : "NO"} ({currentOdds}%)
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bet Amount
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="Enter tokens"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="pr-16"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                tokens
              </div>
            </div>
            <div className="flex space-x-2 mt-2">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setBetAmount(amount.toString())}
                  className="text-xs"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>

          {betAmountNum > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Potential Payout:</span>
                <span className="text-sm font-semibold text-gray-900">
                  +{potentialPayout} tokens
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Profit:</span>
                <span className={`text-sm font-semibold ${profit > 0 ? "text-green-600" : "text-red-500"}`}>
                  {profit > 0 ? "+" : ""}{profit} tokens ({profitPercentage}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Balance After:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {(user?.tokenBalance || 0) - betAmountNum} tokens
                </span>
              </div>
            </div>
          )}

          <Button
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
              position ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
            } text-white`}
            onClick={handleSubmit}
            disabled={isPending || betAmountNum <= 0 || !user}
          >
            {isPending ? "Placing Bet..." : "Confirm Bet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
