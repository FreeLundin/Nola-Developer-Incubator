import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { ArrowRight, Trophy, Target, Zap, Star, Flag } from "lucide-react";

interface FirstLevelTutorialProps {
  onComplete: () => void;
}

export function FirstLevelTutorial({ onComplete }: FirstLevelTutorialProps) {
  const [step, setStep] = useState(0);
  const level = useParadeGame((state) => state.level);
  const isMobile = useIsMobile();
  
  // Only show tutorial on level 1
  if (level !== 1) {
    return null;
  }
  
  const tutorialSteps = [
    {
      title: "🎭 Welcome to Mardi Gras Parade Simulator!",
      icon: Trophy,
      content: (
        <div className="space-y-4">
          <p className="text-lg text-white">
            Get ready to catch throws from the Mardi Gras parade floats!
          </p>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 space-y-2">
            <h3 className="text-yellow-300 font-bold text-xl">🎯 Your Goal:</h3>
            <ul className="space-y-2 text-white">
              <li className="flex items-start gap-2">
                <Star className="text-yellow-400 flex-shrink-0 mt-1" size={16} />
                <span>Catch as many throws as possible before all parade floats pass by</span>
              </li>
              <li className="flex items-start gap-2">
                <Flag className="text-green-400 flex-shrink-0 mt-1" size={16} />
                <span>Each level ends when all floats have passed (not when you hit a score target)</span>
              </li>
              <li className="flex items-start gap-2">
                <Trophy className="text-purple-400 flex-shrink-0 mt-1" size={16} />
                <span>Compete against AI bots who are also trying to catch throws!</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "🎮 How to Move",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4">
            {isMobile ? (
              <div className="space-y-3">
                <h3 className="text-yellow-300 font-bold text-lg">Touch Controls:</h3>
                <ul className="space-y-2 text-white">
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">🕹️</span>
                    <span>Use the left joystick to move around the street</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    <span>Tap the <strong>CATCH</strong> button when near glowing items</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="text-yellow-300 font-bold text-lg">Keyboard Controls:</h3>
                <ul className="space-y-2 text-white">
                  <li className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <kbd className="px-3 py-1 bg-white/20 rounded font-bold">W</kbd>
                      <kbd className="px-3 py-1 bg-white/20 rounded font-bold">A</kbd>
                      <kbd className="px-3 py-1 bg-white/20 rounded font-bold">S</kbd>
                      <kbd className="px-3 py-1 bg-white/20 rounded font-bold">D</kbd>
                    </div>
                    <span>or Arrow Keys to move</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <kbd className="px-3 py-1 bg-white/20 rounded font-bold">Click</kbd>
                    <span>anywhere to move to that spot</span>
                  </li>
                  <li className="text-yellow-300 text-sm">
                    ✨ Items are caught automatically when you get close!
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "🎯 Catching Throws",
      icon: Star,
      content: (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <h3 className="text-yellow-300 font-bold text-lg">How Catching Works:</h3>
            <ul className="space-y-2 text-white">
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">📍</span>
                <span><strong>Target markers</strong> show where throws will land before they hit the ground</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">✨</span>
                <span>Items <strong>glow and pulse</strong> when you can catch them</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">⏱️</span>
                <span>Catch items quickly (within 3 seconds) to build <strong>combo chains!</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">🔥</span>
                <span>Higher combos = MORE POINTS!</span>
              </li>
            </ul>
          </div>
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-3 border-2 border-purple-400">
            <p className="text-white font-semibold">
              💡 <strong>Pro Tip:</strong> Items disappear after 5 seconds on the ground, so move fast!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "🎨 Your Special Color Bonus",
      icon: Star,
      content: (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <h3 className="text-yellow-300 font-bold text-lg">Color Matching System:</h3>
            <p className="text-white">
              At the start of each level, you're assigned a special color (shown in the top-left corner).
            </p>
            <div className="bg-purple-900/60 rounded-lg p-4 border-2 border-yellow-400">
              <p className="text-2xl text-yellow-300 font-black text-center">
                ⭐ CATCH YOUR COLOR = 3X POINTS! ⭐
              </p>
            </div>
            <p className="text-white text-center">
              Regular catches give you 1 point, but matching your color gives you 3 points!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "⚡ Power-Ups & Special Items",
      icon: Zap,
      content: (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <h3 className="text-yellow-300 font-bold text-lg">Special Items to Watch For:</h3>
            <ul className="space-y-3 text-white">
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">⚡</span>
                <div>
                  <strong>Speed Boost</strong> (Cyan)<br/>
                  <span className="text-sm">Move 50% faster for 5 seconds</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">💎</span>
                <div>
                  <strong>Double Points</strong> (Gold)<br/>
                  <span className="text-sm">2x scoring for 8 seconds</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">👑</span>
                <div>
                  <strong>King Cake</strong> (Orange)<br/>
                  <span className="text-sm">Rare! Worth 5 bonus points instantly</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "⚠️ Obstacles & Hazards",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <h3 className="text-yellow-300 font-bold text-lg">Watch Out For:</h3>
            <ul className="space-y-3 text-white">
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">🚧</span>
                <div>
                  <strong>Moving Obstacles</strong> (Wandering spheres)<br/>
                  <span className="text-sm">Breaks your combo chain if you hit them</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">👥</span>
                <div>
                  <strong>Aggressive NPCs</strong> (Black/white squares)<br/>
                  <span className="text-sm">Chase you for 5 seconds if you hit them - deducts 1 point if they catch you!</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">🎪</span>
                <div>
                  <strong>Parade Floats</strong><br/>
                  <span className="text-sm">Getting hit by a float ends your run! Stay clear!</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-2xl flex-shrink-0">🤖</span>
                <div>
                  <strong>Competitor Bots</strong> (Colored spheres)<br/>
                  <span className="text-sm">Compete against you for catches - beat their scores!</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "🎯 Ready to Play!",
      icon: Trophy,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-600/40 to-green-600/40 backdrop-blur-md rounded-lg p-6 border-2 border-yellow-400">
            <h3 className="text-2xl text-yellow-300 font-black text-center mb-4">
              🎭 Remember:
            </h3>
            <ul className="space-y-2 text-white text-lg">
              <li>✅ Level ends when all floats pass</li>
              <li>✅ Catch your special color for 3x points</li>
              <li>✅ Build combos for bonus points</li>
              <li>✅ Collect power-ups for advantages</li>
              <li>✅ Avoid obstacles and floats</li>
              <li>✅ Beat the competitor bots!</li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-2">
              🎉 Let's catch some throws! 🎉
            </p>
            <p className="text-yellow-300">
              Laissez les bons temps rouler!
            </p>
          </div>
        </div>
      ),
    },
  ];
  
  const currentStep = tutorialSteps[step];
  const IconComponent = currentStep.icon;
  
  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };
  
  const skipTutorial = () => {
    onComplete();
  };
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <Card className="bg-gradient-to-br from-purple-900/95 to-green-900/95 border-3 border-yellow-400 shadow-2xl p-8 max-w-3xl mx-4 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <IconComponent className="text-yellow-400" size={32} />
              <h1 className="text-3xl font-black text-yellow-300">{currentStep.title}</h1>
            </div>
            <button
              onClick={skipTutorial}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Skip Tutorial →
            </button>
          </div>
          
          <div className="mb-6">
            {currentStep.content}
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 justify-center mb-6">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? "w-8 bg-yellow-400"
                    : i < step
                    ? "w-2 bg-green-400"
                    : "w-2 bg-white/30"
                }`}
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-white/60">
              Step {step + 1} of {tutorialSteps.length}
            </div>
            <Button
              onClick={nextStep}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-black text-lg px-8"
            >
              {step < tutorialSteps.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-2" size={20} />
                </>
              ) : (
                "Start Game! 🎉"
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
