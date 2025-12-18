import { useParadeGame } from "@/lib/stores/useParadeGame";

export function AdRewardScreen() {
  const { phase, adRewardType, watchAd, skipAd } = useParadeGame();
  
  if (phase !== "ad_offer" || !adRewardType) return null;
  
  const rewardInfo = {
    continue: {
      title: "Continue Playing!",
      description: "Watch a short video to keep playing and earn 10 bonus coins",
      icon: "🎮",
      benefit: "Resume your parade run"
    },
    bonus_time: {
      title: "Extra Time!",
      description: "Watch a video to add 5 more floats to this level and earn 10 coins",
      icon: "⏱️",
      benefit: "More time to catch throws"
    },
    power_up: {
      title: "Power-Up Boost!",
      description: "Watch a video to activate both Speed Boost + Double Points and earn 10 coins",
      icon: "⚡",
      benefit: "8 seconds of enhanced abilities"
    }
  };
  
  const info = rewardInfo[adRewardType];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-900/95 to-orange-900/95 rounded-2xl p-8 max-w-md mx-4 border-4 border-yellow-400 shadow-2xl">
        <div className="text-center">
          <div className="text-7xl mb-4">{info.icon}</div>
          <h2 className="text-4xl font-bold text-yellow-300 mb-3">{info.title}</h2>
          <p className="text-xl text-white mb-2">{info.description}</p>
          <div className="bg-black/30 rounded-lg p-3 mb-6">
            <p className="text-green-300 font-semibold">✓ {info.benefit}</p>
            <p className="text-yellow-300 font-semibold">✓ +10 Coins</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={skipAd}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-all border-2 border-gray-500"
            >
              No Thanks
            </button>
            <button
              onClick={watchAd}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all border-2 border-yellow-300 shadow-lg text-lg"
            >
              Watch Video
            </button>
          </div>
          
          <p className="text-xs text-gray-300 mt-4">Video ads help keep this game free!</p>
        </div>
      </div>
    </div>
  );
}
