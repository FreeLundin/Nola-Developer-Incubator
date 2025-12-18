import { useEffect } from "react";
import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useAudio } from "@/lib/stores/useAudio";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Zap } from "lucide-react";

export function WinScreen() {
  const { phase, score, level, maxCombo, totalCatches, nextLevel, resetGame, offerAdReward } = useParadeGame();
  const { playFireworks } = useAudio();
  
  const handleAdBonus = () => {
    offerAdReward("power_up");
  };
  
  useEffect(() => {
    if (phase === "won") {
      // Play fireworks sound on level completion
      playFireworks();
      
      // Play additional fireworks for celebration
      setTimeout(() => playFireworks(), 300);
      setTimeout(() => playFireworks(), 600);
    }
  }, [phase, playFireworks]);
  
  if (phase !== "won") return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        colors={["#9b59b6", "#ff6b35", "#ffd700", "#e74c3c"]}
        numberOfPieces={300}
        recycle={false}
        gravity={0.3}
      />
      
      <Card className="bg-gradient-to-br from-purple-900/95 to-orange-900/95 border-4 border-yellow-400 p-12 max-w-2xl mx-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <Trophy className="w-24 h-24 text-yellow-400" />
          </div>
          
          <h1 className="text-5xl font-bold text-yellow-300 mb-4">
            Level {level} Complete!
          </h1>
          
          <div className="text-2xl text-white mb-8">
            You caught all {score} throws!
          </div>
          
          {/* Stats Display */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-yellow-300 font-semibold">Max Combo</span>
              </div>
              <div className="text-4xl font-bold text-white">{maxCombo}x</div>
            </div>
            
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                <span className="text-yellow-300 font-semibold">Total Catches</span>
              </div>
              <div className="text-4xl font-bold text-white">{totalCatches}</div>
            </div>
          </div>
          
          <p className="text-xl text-yellow-200 mb-8">
            {maxCombo >= 5 ? "🔥 Amazing combo streak!" : maxCombo >= 3 ? "⚡ Great combo!" : "Keep practicing your combos!"}
          </p>
          
          {/* Optional Ad Bonus */}
          <div className="mb-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-4 border-2 border-green-400">
            <div className="text-green-300 font-semibold mb-2">💡 Bonus Opportunity</div>
            <p className="text-sm text-white mb-3">
              Watch a short video to start Level {level + 1} with both Speed Boost + Double Points activated!
            </p>
            <Button
              onClick={handleAdBonus}
              size="sm"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
            >
              Watch Ad for Power-Up Boost (+10 coins)
            </Button>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={nextLevel}
              size="lg"
              className="flex-1 text-2xl py-6 px-8 bg-yellow-500 hover:bg-yellow-400 text-purple-900 font-bold"
            >
              Next Level →
            </Button>
            
            <Button
              onClick={resetGame}
              size="lg"
              variant="outline"
              className="text-xl py-6 px-8 border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400/20"
            >
              Start Over
            </Button>
          </div>
          
          <div className="mt-6 text-sm text-yellow-200/70">
            Level {level + 1} will be harder - faster floats and more throws!
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
