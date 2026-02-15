import { useUpgrade, useUser } from "@/hooks/use-user";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Zap, Check, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Upgrade() {
  const { user } = useUser();
  const { mutate: upgrade, isPending } = useUpgrade();

  const features = [
    "2x Experience Points from Battles",
    "Exclusive 'PRO' Badge on Profile",
    "Priority Leaderboard Ranking",
    "Access to Future Beta Features",
    "Support Indie Development"
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Level Up Your Experience</h1>
          <p className="text-lg text-muted-foreground">Join the elite ranks of Strivers with the Pro Plan.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-3xl border border-border bg-card/50 opacity-75 hover:opacity-100 transition-opacity">
            <h3 className="text-xl font-bold mb-2">Standard</h3>
            <div className="text-3xl font-display font-bold mb-6">Free</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" /> Standard Battle Access
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" /> Global Leaderboard
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-green-500" /> Basic Stats
              </li>
            </ul>
            <Button variant="outline" className="w-full" disabled>Current Plan</Button>
          </div>

          {/* Pro Plan */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative p-8 rounded-3xl border border-primary bg-gradient-to-b from-primary/10 to-card shadow-2xl shadow-primary/20"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
              Recommended
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-primary">Pro Gamer</h3>
              <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="text-4xl font-display font-bold mb-6 flex items-baseline gap-1">
              $9<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              className="w-full h-12 text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
              onClick={() => upgrade()}
              disabled={user?.isPro || isPending}
            >
              {isPending ? "Processing..." : user?.isPro ? "Already Pro" : "Upgrade Now"}
            </Button>
            <p className="text-xs text-center mt-4 text-muted-foreground">
              One-time simulated payment. No real money required.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
