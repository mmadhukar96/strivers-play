import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

interface GameResultData {
  won: boolean;
  xpEarned: number;
  coinsEarned: number;
}

export function useGameComplete() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (result: GameResultData) => {
      const res = await fetch(api.game.complete.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      if (!res.ok) throw new Error("Failed to save game result");
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.users.me.path], data);
      // Toast handled in the UI for better context control
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving game",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
