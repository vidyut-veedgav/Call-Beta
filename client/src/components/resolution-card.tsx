import { Gavel, Check, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import type { Claim, Resolution } from "@shared/schema";

interface ResolutionCardProps {
  claim: Claim;
  resolutions: Resolution[];
  onVote?: (resolutionId: string, isValid: boolean) => void;
}

export function ResolutionCard({ claim, resolutions, onVote }: ResolutionCardProps) {
  const timeUntilExpiry = formatDistanceToNow(new Date(claim.expiresAt), { addSuffix: true });

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Gavel className="text-amber-600" size={16} />
            <span className="text-sm font-semibold text-amber-800">Resolution Required</span>
          </div>
          <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full font-medium">
            Ends {timeUntilExpiry}
          </span>
        </div>
        <p className="text-gray-900 font-medium leading-relaxed">
          {claim.text}
        </p>
      </div>

      <div className="px-4 py-4">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Proposed Resolution Sources:
          </h4>
          <div className="space-y-3">
            {resolutions.map(resolution => {
              const totalVotes = resolution.votesValid + resolution.votesInvalid;
              const validPercentage = totalVotes > 0 ? 
                Math.round((resolution.votesValid / totalVotes) * 100) : 0;

              return (
                <div key={resolution.id} className="bg-white rounded-lg p-3 border border-amber-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium mb-1">
                        {resolution.sourceDescription}
                      </p>
                      <p className="text-xs text-gray-500">
                        Source: {resolution.sourceLink} • Proposed by user
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {validPercentage}% Valid
                      </div>
                      <div className="text-xs text-gray-500">
                        {totalVotes} votes
                      </div>
                    </div>
                  </div>
                  {onVote && (
                    <div className="flex space-x-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-green-100 text-green-800 hover:bg-green-200"
                        onClick={() => onVote(resolution.id, true)}
                      >
                        <Check size={14} className="mr-1" />
                        Valid
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-red-100 text-red-800 hover:bg-red-200"
                        onClick={() => onVote(resolution.id, false)}
                      >
                        <X size={14} className="mr-1" />
                        Invalid
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-amber-100 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            <Info size={12} className="inline mr-1" />
            Vote on resolution sources to earn rewards. Incorrect votes lose reputation.
          </p>
        </div>
      </div>
    </div>
  );
}
