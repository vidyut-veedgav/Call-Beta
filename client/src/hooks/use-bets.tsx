import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Bet, InsertBet } from "@shared/schema";

export function useUserBets(userId: string) {
  return useQuery<Bet[]>({
    queryKey: ["/api/users", userId, "bets"],
    enabled: !!userId,
  });
}

export function useClaimBets(claimId: string) {
  return useQuery<Bet[]>({
    queryKey: ["/api/claims", claimId, "bets"],
    enabled: !!claimId,
  });
}

export function usePlaceBet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bet: InsertBet) => {
      const response = await apiRequest("POST", "/api/bets", bet);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      queryClient.invalidateQueries({ queryKey: ["/api/claims", variables.claimId] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", variables.userId, "bets"] });
    },
  });
}
