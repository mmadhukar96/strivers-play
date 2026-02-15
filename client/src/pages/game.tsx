import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useGameComplete } from "@/hooks/use-game";
import { useUser } from "@/hooks/use-user";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import { 
  Sword, 
  Shield, 
  Dices, 
  Skull, 
  Heart,
  RefreshCcw,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

type LogEntry = {
  id: number;
  text: string;
  type: 'player' | 'enemy' | 'info';
};

export default function Game() {
  const { user } = useUser();
  const { mutate: completeGame, isPending } = useGameComplete();
  
  // Game State
  const [playerHp, setPlayerHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [turn, setTurn] = useState<'player' | 'enemy'>('player');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | null>(null);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [playerAction, setPlayerAction] = useState<'attack' | 'defend' | null>(null);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // AI Turn Logic
  useEffect(() => {
    if (turn === 'enemy' && !gameOver) {
      const timer = setTimeout(() => {
        const damage = Math.floor(Math.random() * 16) + 10; // 10-25 dmg
        const finalDamage = playerAction === 'defend' ? 5 : damage;
        
        setPlayerHp(prev => Math.max(0, prev - finalDamage));
        
        const logText = playerAction === 'defend' 
          ? `Enemy attacks for ${damage} dmg! Blocked! You took 5 dmg.`
          : `Enemy attacks for ${damage} dmg!`;
          
        addLog(logText, 'enemy');
        setTurn('player');
        setPlayerAction(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver, playerAction]);

  // Check Game Over
  useEffect(() => {
    if (playerHp <= 0 && !gameOver) {
      finishGame(false);
    } else if (enemyHp <= 0 && !gameOver) {
      finishGame(true);
    }
  }, [playerHp, enemyHp]);

  const addLog = (text: string, type: LogEntry['type']) => {
    setLogs(prev => [...prev, { id: Date.now(), text, type }]);
  };

  const finishGame = (won: boolean) => {
    setGameOver(true);
    setGameResult(won ? 'win' : 'loss');
    const xp = won ? 50 : 10;
    const coins = won ? 20 : 0;
    completeGame({ won, xpEarned: xp, coinsEarned: coins });
  };

  const rollDice = () => {
    if (isRolling) return;
    setIsRolling(true);
    
    // Animation mock
    let rolls = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rolls++;
      if (rolls > 10) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        resolvePlayerTurn(finalRoll);
      }
    }, 100);
  };

  const resolvePlayerTurn = (roll: number) => {
    if (roll > 3) {
      // Attack
      setPlayerAction('attack');
      setEnemyHp(prev => Math.max(0, prev - 20));
      addLog(`Rolled ${roll}! Critical Hit! Dealt 20 damage.`, 'player');
    } else {
      // Defend
      setPlayerAction('defend');
      addLog(`Rolled ${roll}. Shield up! Damage reduced next turn.`, 'player');
    }
    setTurn('enemy');
  };

  const resetGame = () => {
    setPlayerHp(100);
    setEnemyHp(100);
    setTurn('player');
    setLogs([]);
    setGameOver(false);
    setGameResult(null);
    setDiceValue(null);
    setPlayerAction(null);
  };

  return (
    <Layout>
      {gameResult === 'win' && <ReactConfetti recycle={false} numberOfPieces={500} />}
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display font-bold">Dice Battle Arena</h1>
          <div className="px-4 py-2 bg-secondary/50 rounded-lg text-sm font-medium">
            Turn: <span className={turn === 'player' ? 'text-primary' : 'text-red-500'}>
              {turn === 'player' ? "Your Turn" : "Enemy Turn"}
            </span>
          </div>
        </div>

        {/* Battle Arena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Player Card */}
          <div className={cn(
            "relative p-6 rounded-2xl border-2 transition-all duration-300",
            turn === 'player' ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]" : "border-border bg-card"
          )}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">{user?.username}</h3>
                <p className="text-sm text-muted-foreground">Level {user?.level}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>HP</span>
                <span>{playerHp}/100</span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: "100%" }}
                  animate={{ width: `${playerHp}%` }}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center h-24 items-center">
              {playerAction === 'attack' && <Sword className="w-12 h-12 text-accent animate-bounce" />}
              {playerAction === 'defend' && <Shield className="w-12 h-12 text-primary animate-pulse" />}
            </div>
          </div>

          {/* Enemy Card */}
          <div className={cn(
            "relative p-6 rounded-2xl border-2 transition-all duration-300",
            turn === 'enemy' ? "border-red-500 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.15)]" : "border-border bg-card"
          )}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold">Dark Knight</h3>
                <p className="text-sm text-muted-foreground">Level ??</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Skull className="w-6 h-6 text-red-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>HP</span>
                <span>{enemyHp}/100</span>
              </div>
              <div className="h-4 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                  initial={{ width: "100%" }}
                  animate={{ width: `${enemyHp}%` }}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center h-24 items-center">
               <div className="text-6xl font-display font-bold text-muted-foreground/20">VS</div>
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Battle Log */}
          <div className="md:col-span-2 bg-black/40 rounded-2xl p-4 h-48 overflow-y-auto border border-white/5 font-mono text-sm">
            <div className="space-y-2">
              {logs.length === 0 && <p className="text-muted-foreground italic">Battle started...</p>}
              {logs.map((log) => (
                <div key={log.id} className={cn(
                  "py-1 px-2 rounded",
                  log.type === 'player' ? "bg-primary/10 text-primary-foreground" : 
                  log.type === 'enemy' ? "bg-red-500/10 text-red-200" : "text-muted-foreground"
                )}>
                  <span className="opacity-50 mr-2">[{new Date(log.id).toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                  {log.text}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Action Panel */}
          <div className="bg-card rounded-2xl p-6 border border-border flex flex-col items-center justify-center gap-4">
             {!gameOver ? (
               <>
                 <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center border-2 border-white/10">
                   {diceValue ? (
                     <span className="text-4xl font-bold">{diceValue}</span>
                   ) : (
                     <Dices className="w-8 h-8 text-muted-foreground" />
                   )}
                 </div>
                 
                 <Button 
                   size="lg" 
                   className="w-full text-lg h-12 bg-primary hover:bg-primary/90"
                   onClick={rollDice}
                   disabled={turn !== 'player' || isRolling}
                 >
                   {isRolling ? "Rolling..." : "Roll Dice"}
                 </Button>
                 <p className="text-xs text-muted-foreground text-center">
                   Roll &gt; 3 to Attack (20 dmg)<br/>
                   Roll &le; 3 to Defend
                 </p>
               </>
             ) : (
               <div className="text-center space-y-4 w-full">
                 {gameResult === 'win' ? (
                   <div>
                     <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                     <h3 className="text-xl font-bold text-yellow-500">Victory!</h3>
                     <p className="text-sm text-muted-foreground">+50 XP, +20 Coins</p>
                   </div>
                 ) : (
                   <div>
                     <Skull className="w-12 h-12 text-red-500 mx-auto mb-2" />
                     <h3 className="text-xl font-bold text-red-500">Defeat</h3>
                     <p className="text-sm text-muted-foreground">+10 XP</p>
                   </div>
                 )}
                 <Button onClick={resetGame} variant="outline" className="w-full">
                   <RefreshCcw className="w-4 h-4 mr-2" /> Play Again
                 </Button>
               </div>
             )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
