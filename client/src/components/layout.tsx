import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import {
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Zap,
  LogOut,
  User as UserIcon,
  Coins,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/game", label: "Dice Battle", icon: Gamepad2 },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/upgrade", label: "Upgrade Pro", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-background flex text-foreground font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-display font-bold text-gradient">
            STRIVERS
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground">Lvl {user.level}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Nav Placeholder - for simplicity in this generated version, we focus on desktop-first but responsive layout structure */}
      
      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative">
        {/* Top Navbar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
          <div className="md:hidden font-display font-bold text-xl text-gradient">
            STRIVERS
          </div>
          
          <div className="ml-auto flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 text-yellow-500">
                  <Coins className="w-4 h-4" />
                  <span>{user.coins}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Star className="w-4 h-4" />
                  <span>{user.xp} XP</span>
                </div>
                {user.isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-accent text-[10px] font-bold text-white uppercase tracking-wider">
                    PRO
                  </span>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
