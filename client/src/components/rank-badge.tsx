import { RANKS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function RankBadge({ rank, className }: { rank: string, className?: string }) {
  const rankData = RANKS.find(r => r.name === rank) || RANKS[0];
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Badge 
            className={cn(
              "ml-2 bg-gradient-to-r font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 border-none text-white",
              rankData.color,
              rankData.glow,
              className
            )}
          >
            {rank}
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Competitive Rank: {rank}</p>
      </TooltipContent>
    </Tooltip>
  );
}
