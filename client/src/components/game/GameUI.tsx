import React, {useEffect, useState} from "react";
import {useParadeGame} from "@/lib/stores/useParadeGame";
import {useAudio} from "@/lib/stores/useAudio";
import {useIsMobile} from "@/hooks/use-is-mobile";
import {AnimatePresence, motion} from "framer-motion";
import {Settings as SettingsIcon, ShoppingBag, Volume2, VolumeX} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {CosmeticShop} from "./CosmeticShop";
import {AdminModal} from "@/components/ui/AdminModal";
import {FirstLevelTutorial} from "./FirstLevelTutorial";
import {SettingsModal} from "./SettingsModal";
import {MinimalHUD} from "@/components/ui/MinimalHUD";

export function GameUI() {
  const { phase, score, level, combo, startGame, activePowerUps, lastCatchTime, playerColor, botScores, coins, joystickEnabled, totalFloats, floatsPassed } = useParadeGame();
  const { isMuted, toggleMute } = useAudio();
  const [showTutorial, setShowTutorial] = useState(true);
  const [showFirstLevelTutorial, setShowFirstLevelTutorial] = useState(false);
  const [comboVisible, setComboVisible] = useState(false);
  const [comboTimeLeft, setComboTimeLeft] = useState(100);
  const [, forceUpdate] = useState(0); // For power-up countdown updates
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPersonas, setShowPersonas] = useState<boolean>(() => {
    try { return typeof window !== 'undefined' && localStorage.getItem('showPersonas') === 'true'; } catch { return false; }
  });
  const [showAdmin, setShowAdmin] = useState(false);
  const isMobile = useIsMobile();

  // Development: Minimal HUD toggle
  const [minimalHud, setMinimalHud] = useState<boolean>(() => {
    try { return typeof window !== 'undefined' && localStorage.getItem('minimalHud') === 'true'; } catch { return false; }
  });

  // Force HUD for tests (localStorage flag) — helpful so automated tests can access shop without completing tutorial
  const forceHudForTests = typeof window !== 'undefined' && (() => {
    try { return localStorage.getItem('TEST_FORCE_HUD') === 'true'; } catch { return false; }
  })();

  // Expose a test helper to open the shop programmatically when running tests.
  useEffect(() => {
    if (forceHudForTests && typeof window !== 'undefined') {
      (window as any).__OPEN_SHOP = () => setShowShop(true);
      return () => { try { delete (window as any).__OPEN_SHOP; } catch {} };
    }
  }, [forceHudForTests]);

  useEffect(() => {
    const handler = () => {
      try { setMinimalHud(localStorage.getItem('minimalHud') === 'true'); } catch { }
    };
    window.addEventListener('minimalHud:updated', handler);
    return () => window.removeEventListener('minimalHud:updated', handler);
  }, []);
  
  // HUD toggles persisted in localStorage (per-element)
  const [showFloatLabels, setShowFloatLabels] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showFloatLabels') === null ? true : localStorage.getItem('hud:showFloatLabels') === 'true'; } catch { return true; }
  });
  const [showPowerUps, setShowPowerUps] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showPowerUps') === null ? true : localStorage.getItem('hud:showPowerUps') === 'true'; } catch { return true; }
  });
  const [showCompetitors, setShowCompetitors] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showCompetitors') === null ? true : localStorage.getItem('hud:showCompetitors') === 'true'; } catch { return true; }
  });
  const [showRemainingFloats, setShowRemainingFloats] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showRemainingFloats') === null ? true : localStorage.getItem('hud:showRemainingFloats') === 'true'; } catch { return true; }
  });

  // Allow preview builds to force a minimal HUD via Vite env flag (VITE_MINIMAL_HUD=true)
  // This is safe because the flag will only be set in preview CI jobs and not in production builds.
  const previewMinimalHud = (import.meta as any).env?.VITE_MINIMAL_HUD === 'true';
  const effectiveMinimalHud = previewMinimalHud || minimalHud;

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

  // Persist HUD toggles and notify listeners
  useEffect(() => { try { localStorage.setItem('hud:showFloatLabels', String(showFloatLabels)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showFloatLabels]);
  useEffect(() => { try { localStorage.setItem('hud:showPowerUps', String(showPowerUps)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showPowerUps]);
  useEffect(() => { try { localStorage.setItem('hud:showCompetitors', String(showCompetitors)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showCompetitors]);
  useEffect(() => { try { localStorage.setItem('hud:showRemainingFloats', String(showRemainingFloats)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showRemainingFloats]);

  const handleStartGame = () => {
    // When launching the first-level tutorial, delay hiding the tutorial overlay
    // briefly so the click event can complete without the element being detached.
    if (level === 1) {
      // Keep the main tutorial visible for a short tick, then show the multi-step tutorial.
      setTimeout(() => {
        setShowTutorial(false);
        setShowFirstLevelTutorial(true);
      }, 50);
    } else {
      setShowTutorial(false);
      startGame();
    }
  };

  const handleTutorialComplete = () => {
    setShowFirstLevelTutorial(false);
    startGame();
  };

  // Render a minimal HUD when requested in dev or preview builds
  if (effectiveMinimalHud) {
    return (
      <>
        {phase === 'tutorial' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <Card className="bg-black/80 border-2 border-yellow-400 p-6 max-w-xs text-white">
              <h2 className="text-lg font-bold text-yellow-300 text-center mb-2">NDI_MardiGrasParade</h2>
              <p className="text-sm text-center mb-4">A simplified HUD preview for development.</p>
              <Button onClick={handleStartGame} className="w-full bg-yellow-500 text-purple-900 font-bold">Start</Button>
            </Card>
          </div>
        )}

        {phase === 'playing' && (
          <MinimalHUD floatsRemaining={Math.max(0, (totalFloats || 0) - (floatsPassed || 0))} score={score} />
        )}
      </>
    );
  }

  return (
    <>
      {/* Settings button moved to lower-right to avoid overlapping top HUD */}
      <div style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 2147483647, pointerEvents: 'auto' }}>
        <button
          onClick={() => setShowSettings(true)}
          data-testid="settings-button"
          aria-label="Open Settings"
          title="Settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(180deg, rgba(60,20,100,0.98), rgba(35,10,60,0.95))',
            color: 'white',
            border: '2px solid rgba(245, 215, 110, 0.98)',
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SettingsIcon style={{ width: 20, height: 20 }} />
          </div>
        </button>
      </div>

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
                      <p className="text-xs sm:text-sm">• Joystick available in Settings for on-screen movement</p>
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
      {(phase === "playing" || forceHudForTests) && (
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
                  data-testid="open-shop"
                >
                  <ShoppingBag size={18} />
                </Button>
              </div>
              
              {/* Active Power-ups - Compact */}
              {showPowerUps && activePowerUps.map((powerUp) => {
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
            </div>
          </div>
          
          {/* Remaining floats indicator (compact) - show only in dev or when tests force HUD and when enabled */}
          {/* (RemainingFloats now renders globally above so it is always detectable by tests) */}

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
          
          {/* Bot Scores - Hidden on phones (desktop view) - but show compact overlay on mobile when joystick enabled */}
          {showCompetitors && (
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
          )}
          
          {/* Mobile compact bot overlay when joystick enabled - positioned above joystick to avoid overlap */}
          {isMobile && joystickEnabled && showCompetitors && (
            <div className="block md:hidden absolute bottom-40 left-2 right-2 pointer-events-auto">
              <Card className="bg-black/50 backdrop-blur-md border-2 border-gray-400 shadow-2xl px-3 py-2">
                <div className="flex items-center justify-between text-xs text-gray-200 font-black mb-1">🤖 COMPETITORS</div>
                <div className="flex gap-2 overflow-x-auto">
                  {sortedBots.slice(0,4).map(bot => (
                    <div key={bot.id} className="flex-shrink-0 flex flex-col items-center w-16">
                      <div className="w-6 h-6 rounded-full mb-1" style={{ backgroundColor: bot.color }} />
                      <div className="text-[11px] text-white text-center">{bot.catches}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          
          {/* Small HUD toggles removed (these belong in SettingsModal) */}

          {/* Test hook: expose a visible DOM marker when tests opt-in via localStorage */}
          {forceHudForTests && (
            <div data-testid="player-entity" style={{ position: 'absolute', left: 8, top: 8, zIndex: 60, background: 'rgba(255,255,255,0.02)', padding: '2px 6px', borderRadius: 4, color: 'white', pointerEvents: 'none' }}>
              Player
            </div>
          )}
          
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
