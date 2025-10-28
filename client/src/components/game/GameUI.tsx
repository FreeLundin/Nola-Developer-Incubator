import { useState, useEffect } from "react";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useAudio } from "@/lib/stores/useAudio";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function GameUI() {
  const { phase, score, targetScore, level, combo, cameraMode, startGame, toggleCamera } = useParadeGame();
  const { isMuted, toggleMute } = useAudio();
  const [showTutorial, setShowTutorial] = useState(true);
  const [comboVisible, setComboVisible] = useState(false);
  const isMobile = useIsMobile();
  
  // Show combo animation when combo changes
  useEffect(() => {
    if (combo > 1) {
      setComboVisible(true);
      const timer = setTimeout(() => setComboVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [combo]);
  
  const handleStartGame = () => {
    setShowTutorial(false);
    startGame();
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
                <h1 className="text-4xl font-bold text-yellow-300">Krew of Boo Parade</h1>
                <button
                  onClick={handleStartGame}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <p className="text-xl text-yellow-200">
                  Welcome to the New Orleans Halloween parade! Catch throws from the parade floats to win!
                </p>
                
                <div className="bg-black/30 rounded-lg p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-4">Controls</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!isMobile && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-yellow-200">PC Controls:</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• <kbd className="px-2 py-1 bg-white/20 rounded">W A S D</kbd> or <kbd className="px-2 py-1 bg-white/20 rounded">Arrow Keys</kbd> - Move</li>
                          <li>• <kbd className="px-2 py-1 bg-white/20 rounded">C</kbd> - Toggle Camera View</li>
                        </ul>
                      </div>
                    )}
                    
                    {isMobile && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-yellow-200">Touch Controls:</h3>
                        <ul className="space-y-1 text-sm">
                          <li>• Use left joystick to move around</li>
                          <li>• Tap <span className="text-yellow-300 font-semibold">CATCH 🎯</span> button when near highlighted items</li>
                          <li>• Tap camera button to switch view</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-yellow-200">Gameplay:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Move close to falling items to catch them</li>
                        <li>• Catch quickly for combo bonuses!</li>
                        <li>• Complete levels to increase difficulty</li>
                        <li>• Switch camera views for better positioning</li>
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
            {/* Level and Progress */}
            <Card className="bg-gradient-to-r from-purple-900/90 to-orange-900/90 border-2 border-yellow-400 px-6 py-3">
              <div className="space-y-2">
                <div className="text-xs text-yellow-300 font-semibold">LEVEL {level}</div>
                <div className="text-2xl font-bold text-white">
                  {score} / {targetScore}
                </div>
                <Progress value={progressPercentage} className="h-2 w-32" />
              </div>
            </Card>
            
            {/* Camera and Sound Controls */}
            <div className="flex gap-2">
              <Button
                onClick={toggleMute}
                size="lg"
                className="bg-purple-900/90 hover:bg-purple-800 border-2 border-yellow-400 text-white"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
              
              <Button
                onClick={toggleCamera}
                size="lg"
                className="bg-purple-900/90 hover:bg-purple-800 border-2 border-yellow-400 text-white"
              >
                <Camera className="mr-2" size={20} />
                {cameraMode === "third-person" ? "3rd" : "1st"}
              </Button>
            </div>
          </div>
          
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
          
          {/* Controls Hint - Bottom Center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
              {isMobile ? (
                "Joystick to move • 🎯 CATCH button when items glow • Catch fast for combos!"
              ) : (
                <>
                  <kbd className="px-2 py-1 bg-white/20 rounded mx-1">WASD</kbd> Move •
                  <kbd className="px-2 py-1 bg-white/20 rounded mx-1">C</kbd> Camera • Catch fast for combos!
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
