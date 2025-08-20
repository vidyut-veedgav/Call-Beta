import { useState } from "react";
import { Plus, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TopNavigation } from "@/components/top-navigation";
import { BottomNavigation } from "@/components/bottom-navigation";
import { useCurrentUser } from "@/hooks/use-user";
import { useCreateClaim } from "@/hooks/use-claims";
import { useToast } from "@/hooks/use-toast";

export default function CreateClaim() {
  const [claimText, setClaimText] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const { data: user } = useCurrentUser();
  const { mutate: createClaim, isPending } = useCreateClaim();
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!user || !claimText.trim() || !expirationDate) return;
    
    const expiresAt = new Date(expirationDate);
    if (expiresAt <= new Date()) {
      toast({
        title: "Invalid Date",
        description: "Expiration date must be in the future.",
        variant: "destructive",
      });
      return;
    }

    createClaim({
      text: claimText.trim(),
      creatorId: user.id,
      creatorUsername: user.username,
      expiresAt,
      status: "open",
      resolutionOutcome: null,
    }, {
      onSuccess: () => {
        toast({
          title: "Claim Created!",
          description: "Your prediction is now live for betting.",
        });
        setClaimText("");
        setExpirationDate("");
        // Navigate back to feed after successful creation
        window.location.href = "/";
      },
      onError: (error: any) => {
        toast({
          title: "Failed to Create Claim",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      },
    });
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const suggestedClaims = [
    "Apple will announce a new product category in 2025",
    "Bitcoin will hit a new all-time high before summer 2025",
    "Netflix will acquire a major gaming studio by end of 2025",
    "Tesla will deliver 3 million vehicles in 2025",
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      <TopNavigation />
      
      <main className="pb-20 px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Create Prediction</h1>
          <div className="w-16"></div> {/* Spacer for center alignment */}
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Prediction
            </label>
            <Textarea
              placeholder="What do you predict will happen? Be specific..."
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              className="min-h-24"
              maxLength={280}
            />
            <div className="text-xs text-gray-500 mt-1">
              {claimText.length}/280 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Resolution Date
            </label>
            <Input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              min={getMinDate()}
            />
            <div className="text-xs text-gray-500 mt-1">
              When should this prediction be resolved?
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Need inspiration? Try these:
            </label>
            <div className="space-y-2">
              {suggestedClaims.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setClaimText(suggestion)}
                  className="text-left text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 p-3 rounded-lg w-full transition-colors border border-gray-200"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              💡 Good predictions are specific, time-bound, and verifiable. 
              Avoid vague statements like "will be popular" - use measurable outcomes instead!
            </p>
          </div>

          <Button
            className="w-full font-semibold py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSubmit}
            disabled={isPending || !claimText.trim() || !expirationDate || !user}
          >
            {isPending ? "Creating..." : "Create Prediction"}
          </Button>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}