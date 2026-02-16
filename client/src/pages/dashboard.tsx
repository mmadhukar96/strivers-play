import { useUser } from "@/hooks/use-user";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Gamepad2, 
  Trophy, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Swords
} from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();

  if (!user) return null;

  const stats = [
    { label: "Level", value: user.level, icon: TrendingUp, color: "text-green-500" },
    { label: "Total XP", value: user.xp, icon: Zap, color: "text-yellow-500" },
    { label: "Coins", value: user.coins, icon: Trophy, color: "text-purple-500" },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-card to-card border border-white/5 p-6 md:p-12">
          <div className="absolute top-0 right-0 p-4 opacity-10 hidden sm:block">
            <Gamepad2 className="w-48 h-48 md:w-64 md:h-64 rotate-12" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4"
            >
              Ready for battle, <span className="text-gradient">{user.username}</span>?
            </motion.h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Your next challenge awaits. Win battles to earn XP and climb the global leaderboards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/game">
                <Button size="lg" className="h-12 md:h-14 px-8 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl w-full sm:w-auto">
                  <Swords className="mr-2 w-5 h-5" />
                  Play Dice Battle
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" size="lg" className="h-12 md:h-14 px-8 text-lg border-white/10 hover:bg-white/5 rounded-xl w-full sm:w-auto">
                  View Leaderboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-colors"
            >
              <div>
                <p className="text-muted-foreground font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-display font-bold">{stat.value}</h3>
              </div>
              <div className={`p-4 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/upgrade">
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-accent cursor-pointer hover:bg-white/5 transition-all">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold font-display">Upgrade to Pro</h3>
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <p className="text-muted-foreground mb-4">Unlock exclusive features and 2x XP boost.</p>
              <div className="flex items-center text-accent font-semibold text-sm">
                Check Plan <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>

          <Link href="/leaderboard">
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary cursor-pointer hover:bg-white/5 transition-all">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold font-display">Top Players</h3>
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">See where you stand among the legends.</p>
              <div className="flex items-center text-primary font-semibold text-sm">
                View Rankings <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
