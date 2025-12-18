import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Trophy, Target, Star } from "lucide-react";

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
      title: "🎭 How to Play",
      icon: Trophy,
      content: (
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4 space-y-3">
            <p className="text-white text-lg">
              Catch throws from parade floats before the level ends!
            </p>
            <p className="text-yellow-300 font-bold">
              Your Goal: Catch as many items as you can
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "🎮 Controls",
      icon: Target,
      content: (
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4">
            {isMobile ? (
              <div className="space-y-2 text-white">
                <p className="text-lg">• Tap screen to move</p>
                <p className="text-lg">• Get close to items to catch them</p>
              </div>
            ) : (
              <div className="space-y-2 text-white">
                <p className="text-lg">• Move: <kbd className="px-2 py-1 bg-white/20 rounded mx-1">WASD</kbd> or Arrow Keys</p>
                <p className="text-lg">• Click anywhere to move there</p>
                <p className="text-yellow-300 text-lg">✨ Auto-catch when close to items</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "🎯 Tips",
      icon: Star,
      content: (
        <div className="space-y-4">
          <div className="bg-black/30 rounded-lg p-4 space-y-2 text-white text-lg">
            <p>• Match your color for <span className="text-yellow-300 font-bold">3x points</span></p>
            <p>• Catch quickly to build combos</p>
            <p>• Watch for power-ups (⚡💎)</p>
            <p>• Avoid obstacles and floats</p>
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
        <Card className="bg-purple-900/95 border-2 border-yellow-400 p-4 sm:p-6 max-w-sm sm:max-w-lg mx-4 text-white">
          <div className="mb-3 sm:mb-4 text-center">
            <h1 className="text-lg sm:text-2xl font-bold text-yellow-300">{currentStep.title}</h1>
            <div className="text-[10px] sm:text-xs text-white/60 mt-1 sm:mt-2">
              {step + 1} of {tutorialSteps.length}
            </div>
          </div>
          
          <div className="mb-3 sm:mb-4 text-sm sm:text-base">
            {currentStep.content}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={skipTutorial}
              size="sm"
              variant="outline"
              className="flex-1 border-yellow-400 text-white hover:bg-yellow-400/20 text-xs sm:text-sm"
            >
              Skip
            </Button>
            <Button
              onClick={nextStep}
              size="sm"
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-bold text-xs sm:text-sm"
            >
              {step < tutorialSteps.length - 1 ? "Next" : "Start!"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
