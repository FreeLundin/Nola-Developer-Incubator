import { useState, useEffect } from "react";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, ShoppingBag, Heart, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CosmeticShop } from "./CosmeticShop";
import { FirstLevelTutorial } from "./FirstLevelTutorial";
import { toast } from "sonner";

export function GameUI() {
  const { phase, score, targetScore, level, combo, startGame, activePowerUps, lastCatchTime, playerColor, botScores, coins } = useParadeGame();
  const { isMuted, toggleMute } = useAudio();
  const [showTutorial, setShowTutorial] = useState(true);
  const [showFirstLevelTutorial, setShowFirstLevelTutorial] = useState(false);
  const [comboVisible, setComboVisible] = useState(false);
  const [comboTimeLeft, setComboTimeLeft] = useState(100);
  const [, forceUpdate] = useState(0); // For power-up countdown updates
  const [showShop, setShowShop] = useState(false);
  const isMobile = useIsMobile();
  
  // Map player color to display info
  const colorDisplayMap = {
    beads: { name: "Purple Beads", color: "#9b59b6" },
    doubloon: { name: "Gold Doubloon", color: "#f1c40f" },
    cup: { name: "Red Cup", color: "#e74c3c" },
  };
  const playerColorInfo = colorDisplayMap[playerColor];
  
  // Sort bots by catches (descending)
  const sortedBots = [...botScores].sort((a, b) => b.catches - a.catches);
  
  // Show combo animation when combo changes
  useEffect(() => {
    if (combo > 1) {
      setComboVisible(true);
      const timer = setTimeout(() => setComboVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [combo]);
  
  // Update combo timer
  useEffect(() => {
    if (combo > 0 && lastCatchTime > 0) {
      const interval = setInterval(() => {
        const now = Date.now();
        const timeSinceLastCatch = now - lastCatchTime;
        const timeLeft = Math.max(0, 3000 - timeSinceLastCatch);
        setComboTimeLeft((timeLeft / 3000) * 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [combo, lastCatchTime]);
  
  // Update power-up UI countdown
  useEffect(() => {
    if (activePowerUps.length > 0) {
      const interval = setInterval(() => {
        forceUpdate(n => n + 1); // Force re-render to update countdown
      }, 100);
      return () => clearInterval(interval);
    }
  }, [activePowerUps.length]);
  
  const handleStartGame = () => {
    setShowTutorial(false);
    // Show first-level tutorial on level 1
    if (level === 1) {
      setShowFirstLevelTutorial(true);
    } else {
      startGame();
    }
  };
  
  const handleTutorialComplete = () => {
    setShowFirstLevelTutorial(false);
    startGame();
  };
  
  const handleChimeDonation = () => {
    const chimeSign = "$nolaDevelopmentIncubator";
    navigator.clipboard.writeText(chimeSign).then(() => {
      toast.success("Copied to clipboard!", {
        description: `Send via Chime Pay Anyone to ${chimeSign}`,
        duration: 5000,
      });
    }).catch(() => {
      toast.info("Chime Donation", {
        description: `Send via Chime Pay Anyone to ${chimeSign}`,
        duration: 5000,
      });
    });
  };
  
  const progressPercentage = (score / targetScore) * 100;
  
  return (
    <>
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {phase === "tutorial" && showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <Card className="bg-gradient-to-br from-purple-900/95 to-orange-900/95 border-2 border-yellow-400 p-8 max-w-2xl mx-4 text-white">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-bold text-yellow-300">Mardi Gras Parade Simulator</h1>
                <button
                  onClick={handleStartGame}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl text-yellow-200">
                  Welcome to the Mardi Gras parade! Catch throws from the parade floats to win!
                </p>
                
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-4">Controls</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!isMobile && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-yellow-200">PC Controls:</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• <kbd className="px-2 py-1 bg-white/20 rounded">W A S D</kbd> or <kbd className="px-2 py-1 bg-white/20 rounded">Arrow Keys</kbd> - Move</li>
                          <li>• <kbd className="px-2 py-1 bg-white/20 rounded">Click</kbd> anywhere to move there</li>
                          <li>• Move close to highlighted items to catch them</li>
                        </ul>
                      </div>
                    )}
                    
                    {isMobile && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-yellow-200">Touch Controls:</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Use left joystick to move around</li>
                          <li>• Tap <span className="text-yellow-300 font-semibold">CATCH 🎯</span> button when near highlighted items</li>
                          <li>• Items glow and pulse when you can catch them</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-yellow-200">Gameplay:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Move close to falling items to catch them</li>
                        <li>• <span className="text-yellow-300 font-bold">3x points for your color!</span></li>
                        <li>• Target markers show where throws will land</li>
                        <li>• Catch quickly for combo bonuses!</li>
                        <li>• Compete with colorful bots for catches!</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="w-full text-xl py-6 bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-bold"
                >
                  Start Game
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* In-Game HUD */}
      {phase === "playing" && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Top HUD Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
            {/* Level and Progress - Enhanced with glassmorphism */}
            <div className="flex flex-col gap-2">
              <Card className="bg-gradient-to-br from-purple-600/30 to-orange-600/30 backdrop-blur-md border-2 border-yellow-400 shadow-2xl px-6 py-3">
                <div className="space-y-2">
                  <div className="text-xs text-yellow-300 font-bold tracking-wider flex items-center gap-2">
                    <span className="text-2xl">👑</span> LEVEL {level}
                  </div>
                  <div className="text-3xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {score} <span className="text-yellow-300">/ {targetScore}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 w-32 shadow-lg" />
                </div>
              </Card>
              
              {/* Player Color Indicator - Enhanced */}
              <Card className="bg-black/40 backdrop-blur-md border-2 px-4 py-2 shadow-2xl" style={{ borderColor: playerColorInfo.color, boxShadow: `0 0 12px ${playerColorInfo.color}40` }}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full animate-pulse" 
                    style={{ 
                      backgroundColor: playerColorInfo.color,
                      boxShadow: `0 0 12px ${playerColorInfo.color}, inset 0 0 8px rgba(255,255,255,0.5)`
                    }}
                  />
                  <div className="text-xs font-bold" style={{ color: playerColorInfo.color, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                    YOUR COLOR: {playerColorInfo.name.toUpperCase()}
                  </div>
                </div>
                <div className="text-[11px] text-yellow-300 font-semibold mt-1">
                  ⭐ 3x points for matching color!
                </div>
              </Card>
            </div>
            
            {/* Right side - Coins, Power-ups and Controls */}
            <div className="flex flex-col gap-2">
              {/* Coins and Shop Button - Enhanced */}
              <div className="flex gap-2">
                <Card className="bg-gradient-to-br from-yellow-600/40 to-orange-600/40 backdrop-blur-md border-2 border-yellow-400 shadow-2xl px-4 py-2">
                  <div className="text-xs text-yellow-200 font-bold tracking-wide">COINS</div>
                  <div className="text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">💰 {coins}</div>
                </Card>
                <Button
                  onClick={() => setShowShop(true)}
                  size="lg"
                  className="bg-purple-600/50 hover:bg-purple-500/60 backdrop-blur-md border-2 border-yellow-400 text-white shadow-2xl font-bold"
                >
                  <ShoppingBag size={20} />
                </Button>
              </div>
              
              {/* Active Power-ups - Enhanced */}
              {activePowerUps.map((powerUp) => {
                const timeLeft = Math.max(0, powerUp.endTime - Date.now());
                const percentage = (timeLeft / 8000) * 100;
                return (
                  <Card key={powerUp.type} className="bg-gradient-to-br from-cyan-500/40 to-blue-600/40 backdrop-blur-md border-2 border-cyan-300 shadow-2xl px-4 py-2 animate-pulse">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-cyan-100 font-bold whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {powerUp.type === "speed_boost" ? "⚡ SPEED BOOST" : "💎 2X POINTS"}
                      </div>
                      <div className="text-white text-sm font-black">{Math.ceil(timeLeft / 1000)}s</div>
                    </div>
                    <Progress value={percentage} className="h-2 w-28 mt-1 shadow-lg" />
                  </Card>
                );
              })}
              
              <Button
                onClick={toggleMute}
                size="lg"
                className="bg-purple-600/50 hover:bg-purple-500/60 backdrop-blur-md border-2 border-yellow-400 text-white shadow-2xl font-bold"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            </div>
          </div>
          
          {/* Donate Buttons - Bottom Right */}
          <div className="absolute bottom-4 right-4 pointer-events-auto flex flex-col gap-2">
            <Button
              onClick={() => window.open('https://replit.com/refer/blundin', '_blank')}
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 border-2 border-yellow-400 text-white font-bold shadow-lg"
            >
              <Heart size={20} className="mr-2" fill="currentColor" />
              Support Development
            </Button>
            <Button
              onClick={handleChimeDonation}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-2 border-yellow-400 text-white font-bold shadow-lg"
            >
              <DollarSign size={20} className="mr-2" />
              Donate via Chime
            </Button>
          </div>
          
          {/* Combo Timer - Top Center - Enhanced */}
          {combo > 0 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <Card className="bg-gradient-to-br from-yellow-500/40 to-orange-600/40 backdrop-blur-lg border-3 border-yellow-300 shadow-2xl px-8 py-3 animate-pulse">
                <div className="text-center">
                  <div className="text-sm text-yellow-200 font-black tracking-widest">🔥 COMBO 🔥</div>
                  <div className="text-5xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">{combo}x</div>
                  <Progress value={comboTimeLeft} className="h-2 w-32 mt-2 shadow-lg" />
                </div>
              </Card>
            </div>
          )}
          
          {/* Combo Display - Center */}
          <AnimatePresence>
            {comboVisible && combo > 1 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                <div className="text-center">
                  <div className="text-6xl font-bold text-yellow-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                    {combo}x
                  </div>
                  <div className="text-2xl text-white font-bold mt-2">
                    COMBO!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Bot Scores - Bottom Left - Enhanced */}
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <Card className="bg-black/40 backdrop-blur-md border-2 border-gray-400 shadow-2xl px-4 py-3">
              <div className="text-sm text-gray-200 font-black mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">🤖 COMPETITOR CATCHES</div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {sortedBots.map((bot) => (
                  <div key={bot.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ 
                          backgroundColor: bot.color,
                          boxShadow: `0 0 10px ${bot.color}, inset 0 0 6px rgba(255,255,255,0.4)`
                        }}
                      />
                      <span className="text-xs text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{bot.id}</span>
                    </div>
                    <span className="text-base font-black text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{bot.catches}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Controls Hint - Bottom Center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
              {isMobile ? (
                "Joystick to move • 🎯 CATCH button when items glow • Catch fast for combos!"
              ) : (
                <>
                  <kbd className="px-2 py-1 bg-white/20 rounded mx-1">WASD</kbd> or <kbd className="px-2 py-1 bg-white/20 rounded mx-1">Click</kbd> to move • Catch fast for combos!
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Cosmetic Shop Modal */}
      {showShop && <CosmeticShop onClose={() => setShowShop(false)} />}
      
      {/* First Level Tutorial */}
      {showFirstLevelTutorial && <FirstLevelTutorial onComplete={handleTutorialComplete} />}
    </>
  );
}
