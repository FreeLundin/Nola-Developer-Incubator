import { useState, useEffect } from "react";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, ShoppingBag, Heart, DollarSign, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CosmeticShop } from "./CosmeticShop";
import { AdminModal } from '@/components/ui/AdminModal';
import { FirstLevelTutorial } from "./FirstLevelTutorial";
import { SettingsModal } from "./SettingsModal";
import { toast } from "sonner";

export function GameUI() {
  const { phase, score, targetScore, level, combo, startGame, activePowerUps, lastCatchTime, playerColor, botScores, coins } = useParadeGame();
  const { isMuted, toggleMute } = useAudio();
  const backgroundMusic = useAudio((s) => s.backgroundMusic);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showFirstLevelTutorial, setShowFirstLevelTutorial] = useState(false);
  const [comboVisible, setComboVisible] = useState(false);
  const [comboTimeLeft, setComboTimeLeft] = useState(100);
  const [, forceUpdate] = useState(0); // For power-up countdown updates
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPersonas, setShowPersonas] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('showPersonas') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [showAdmin, setShowAdmin] = useState(false);
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
  
  // Update showPersonas in localStorage
  useEffect(() => {
    try { if (typeof window !== 'undefined') localStorage.setItem('showPersonas', String(showPersonas)); } catch { }
  }, [showPersonas]);
  
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
  
  const unlockAudio = () => {
    try {
      // Try to play/pause the background music to unlock audio on browsers
      if (backgroundMusic) {
        backgroundMusic.play();
        backgroundMusic.pause();
      }
      // Ensure store is unmuted
      if (useAudio.getState().isMuted) {
        useAudio.getState().toggleMute();
      }
      console.log('Attempted to unlock audio via user action');
    } catch (e) {
      console.warn('Unlock audio failed:', e);
    }
  };

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
            <Card className="bg-purple-900/95 border-2 border-yellow-400 p-4 sm:p-8 max-w-sm sm:max-w-lg mx-4 text-white">
              <h1 className="text-xl sm:text-3xl font-bold text-yellow-300 mb-3 sm:mb-4 text-center">NDI_MardiGrasParade</h1>
              
              <div className="space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-lg text-center">
                  Catch throws from parade floats!
                </p>
                
                <div className="bg-black/30 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {!isMobile ? (
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm">• Move: <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-white/20 rounded text-[10px] sm:text-xs">WASD</kbd> or <kbd className="px-1 sm:px-2 py-0.5 sm:py-1 bg-white/20 rounded text-[10px] sm:text-xs">Arrows</kbd></p>
                      <p className="text-xs sm:text-sm">• Click to move to location</p>
                      <p className="text-xs sm:text-sm">• Get close to items to catch them</p>
                    </div>
                  ) : (
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm">• Move: Tap screen to move</p>
                      <p className="text-xs sm:text-sm">• Get close to items to catch them</p>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-yellow-300 font-bold">• Match your color for 3x points!</p>
                </div>
                
                <Button
                  onClick={handleStartGame}
                  size="lg"
                  className="w-full text-base sm:text-xl py-4 sm:py-6 bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-bold"
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
          {/* Top HUD Bar - Phone Optimized */}
          <div className="absolute top-2 md:top-4 left-2 md:left-4 right-2 md:right-4 flex justify-between items-start pointer-events-auto">
            {/* Level and Score - Compact for phones */}
            <div className="flex flex-col gap-1 md:gap-2">
              <Card className="bg-black/70 border-2 border-yellow-400 px-2 py-1 md:px-4 md:py-2">
                <div className="space-y-0">
                  <div className="text-xs md:text-sm text-yellow-300 font-bold">L{level}</div>
                  <div className="text-lg md:text-2xl font-bold text-white">{score}</div>
                </div>
              </Card>
              
              {/* Player Color - Hide on small phones, show on tablets */}
              <Card className="hidden sm:flex bg-black/70 border-2 px-2 py-1 md:px-3 md:py-2" style={{ borderColor: playerColorInfo.color }}>
                <div className="flex items-center gap-1 md:gap-2">
                  <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: playerColorInfo.color }} />
                  <div className="text-[10px] md:text-xs font-bold text-white">
                    {playerColorInfo.name.toUpperCase()}
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right side - Compact */}
            <div className="flex flex-col gap-1 md:gap-2">
              {/* Coins - Hide shop button on phones */}
              <div className="flex gap-1 md:gap-2">
                <Card className="bg-black/70 border-2 border-yellow-400 px-2 py-1 md:px-3 md:py-2">
                  <div className="text-sm md:text-lg font-bold text-white">💰 {coins}</div>
                </Card>
                <Button
                  onClick={() => setShowShop(true)}
                  size="sm"
                  className="hidden sm:flex bg-purple-700 hover:bg-purple-600 border-2 border-yellow-400 text-white"
                >
                  <ShoppingBag size={18} />
                </Button>
              </div>
              
              {/* Active Power-ups - Compact */}
              {activePowerUps.map((powerUp) => {
                const timeLeft = Math.max(0, powerUp.endTime - Date.now());
                return (
                  <Card key={powerUp.type} className="bg-cyan-600/90 border-2 border-cyan-300 px-2 py-1 md:px-3 md:py-2">
                    <div className="flex items-center gap-1">
                      <div className="text-[10px] md:text-xs text-white font-bold">
                        {powerUp.type === "speed_boost" ? "⚡" : "💎"}
                      </div>
                      <div className="text-white text-[10px] md:text-xs font-bold">{Math.ceil(timeLeft / 1000)}s</div>
                    </div>
                  </Card>
                );
              })}
              
              <Button
                onClick={toggleMute}
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 border-2 border-yellow-400 text-white p-1 md:p-2"
              >
                {isMuted ? <VolumeX size={14} className="md:w-[18px] md:h-[18px]" /> : <Volume2 size={14} className="md:w-[18px] md:h-[18px]" />}
              </Button>
              <Button
                onClick={unlockAudio}
                size="sm"
                className="ml-2 bg-green-600 hover:bg-green-500 border-2 border-yellow-400 text-white p-1 md:p-2"
              >
                Enable Audio
              </Button>
              
              {isMobile && (
                <Button
                  onClick={() => setShowSettings(true)}
                  size="sm"
                  className="bg-purple-700 hover:bg-purple-600 border-2 border-yellow-400 text-white p-1 md:p-2"
                >
                  <Settings size={14} className="md:w-[18px] md:h-[18px]" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Admin & Controls - Hidden on phones */}
          <div className="hidden md:flex absolute bottom-4 right-4 pointer-events-auto flex-col gap-2">
            <Button onClick={() => setShowAdmin(true)} size="lg" className="bg-gray-800 text-white border-2 border-yellow-400">Admin</Button>
            <Button onClick={() => { fetch('/bots.override.json').then(()=>window.dispatchEvent(new Event('bots:updated'))); }} size="lg" className="bg-purple-700 text-white border-2 border-yellow-400">Reload config</Button>
          </div>
          
          {/* Combo Timer - Top Center - Compact on phones */}
          {combo > 0 && (
            <div className="absolute top-2 md:top-4 left-1/2 transform -translate-x-1/2">
              <Card className="bg-gradient-to-br from-yellow-500/40 to-orange-600/40 backdrop-blur-lg border-2 md:border-3 border-yellow-300 shadow-2xl px-3 py-1 md:px-8 md:py-3 animate-pulse">
                <div className="text-center">
                  <div className="text-xs md:text-sm text-yellow-200 font-black tracking-wider md:tracking-widest">🔥 COMBO 🔥</div>
                  <div className="text-2xl md:text-5xl font-black text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">{combo}x</div>
                  <Progress value={comboTimeLeft} className="h-1 md:h-2 w-16 md:w-32 mt-1 md:mt-2 shadow-lg" />
                </div>
              </Card>
            </div>
          )}
          
          {/* Combo Display - Hidden on small phones */}
          <AnimatePresence>
            {comboVisible && combo > 1 && (
              <motion.div
                className="hidden sm:block absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
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
          
          {/* Bot Scores - Hidden on phones */}
          <div className="hidden md:block absolute bottom-4 left-4 pointer-events-auto">
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
                      <span className="text-xs text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{bot.displayName ?? bot.id}{showPersonas && bot.persona ? ` — ${bot.persona}` : ''}</span>
                    </div>
                    <span className="text-base font-black text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{bot.catches}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Small HUD toggles - top-right compact */}
          <div className="absolute top-4 right-4">
            <div className="bg-black/60 p-2 rounded-md pointer-events-auto">
              <label className="flex items-center gap-2 text-white text-xs">
                <input type="checkbox" checked={showPersonas} onChange={(e) => setShowPersonas(e.target.checked)} />
                <span>Show Personas (debug)</span>
              </label>
            </div>
          </div>
          
          {/* Controls Hint - Hidden on phones */}
          <div className="hidden md:block absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
              {isMobile ? (
                "Tap screen to move • Get close to catch • Catch fast for combos!"
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
      
      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      
      {/* First Level Tutorial */}
      {showFirstLevelTutorial && <FirstLevelTutorial onComplete={handleTutorialComplete} />}
      
      {/* Admin Modal */}
      {showAdmin && <AdminModal isOpen={showAdmin} onClose={() => setShowAdmin(false)} />}
    </>
  );
}
