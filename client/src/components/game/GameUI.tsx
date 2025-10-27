import { useState } from "react";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function GameUI() {
  const { phase, score, targetScore, cameraMode, startGame, toggleCamera } = useParadeGame();
  const [showTutorial, setShowTutorial] = useState(true);
  const isMobile = useIsMobile();
  
  const handleStartGame = () => {
    setShowTutorial(false);
    startGame();
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
                  Welcome to the New Orleans Halloween parade! Catch 5 throws from the parade floats to win!
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
                          <li>• Use on-screen joystick to move</li>
                          <li>• Tap camera button to switch view</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-yellow-200">Gameplay:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Move close to falling items to catch them</li>
                        <li>• Highlighted rings show catch zones</li>
                        <li>• Switch camera views for better tactical positioning</li>
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
          {/* Score Display - Top Center */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
            <Card className="bg-gradient-to-r from-purple-900/90 to-orange-900/90 border-2 border-yellow-400 px-6 py-3">
              <div className="text-center">
                <div className="text-sm text-yellow-300 font-semibold">Catches</div>
                <div className="text-3xl font-bold text-white">
                  {score} / {targetScore}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Camera Toggle Button - Top Right */}
          <div className="absolute top-4 right-4 pointer-events-auto">
            <Button
              onClick={toggleCamera}
              size="lg"
              className="bg-purple-900/90 hover:bg-purple-800 border-2 border-yellow-400 text-white"
            >
              <Camera className="mr-2" size={20} />
              {cameraMode === "third-person" ? "3rd Person" : "1st Person"}
            </Button>
          </div>
          
          {/* Controls Hint - Bottom Center */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
              {isMobile ? (
                "Use joystick to move • Tap camera to switch view"
              ) : (
                <>
                  <kbd className="px-2 py-1 bg-white/20 rounded mx-1">WASD</kbd> Move •
                  <kbd className="px-2 py-1 bg-white/20 rounded mx-1">C</kbd> Camera
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
