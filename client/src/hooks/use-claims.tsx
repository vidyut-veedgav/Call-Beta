import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Claim, InsertClaim } from "@shared/schema";

export function useClaims() {
  return useQuery<Claim[]>({
    queryKey: ["/api/claims"],
  });
}

export function useActiveClaims() {
  return useQuery<Claim[]>({
    queryKey: ["/api/claims/active"],
  });
}

export function useClaim(id: string) {
  return useQuery<Claim>({
    queryKey: ["/api/claims", id],
    enabled: !!id,
  });
}

export function useCreateClaim() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (claim: InsertClaim) => {
      const response = await apiRequest("POST", "/api/claims", claim);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
    },
  });
}
