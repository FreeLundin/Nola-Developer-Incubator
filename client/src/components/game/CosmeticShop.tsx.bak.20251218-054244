import { useState } from "react";
import { useParadeGame, type PlayerSkin, SKIN_PRICES } from "@/lib/stores/useParadeGame";

const SKIN_INFO: Record<PlayerSkin, { name: string; emoji: string; description: string; color: string }> = {
  default: {
    name: "Classic",
    emoji: "🎭",
    description: "The original parade-goer",
    color: "#9b59b6"
  },
  golden: {
    name: "Golden",
    emoji: "👑",
    description: "Shimmer like Mardi Gras royalty",
    color: "#FFD700"
  },
  rainbow: {
    name: "Rainbow",
    emoji: "🌈",
    description: "Celebrate with all the colors",
    color: "linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)"
  },
  ghost: {
    name: "Ghost",
    emoji: "👻",
    description: "Spooky parade spirit",
    color: "#E0E0E0"
  },
  king: {
    name: "King Cake",
    emoji: "🎂",
    description: "Sweet and festive",
    color: "#8B4513"
  },
  jester: {
    name: "Jester",
    emoji: "🃏",
    description: "Colorful and playful",
    color: "#FF1493"
  }
};

export function CosmeticShop({ onClose }: { onClose: () => void }) {
  const { coins, playerSkin, unlockedSkins, purchaseSkin, setSkin } = useParadeGame();
  const [selectedSkin, setSelectedSkin] = useState<PlayerSkin>(playerSkin);
  
  const handlePurchase = (skin: PlayerSkin) => {
    if (purchaseSkin(skin)) {
      setSelectedSkin(skin);
    }
  };
  
  const handleEquip = (skin: PlayerSkin) => {
    setSkin(skin);
    setSelectedSkin(skin);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-purple-900/95 to-orange-900/95 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-4 border-yellow-400 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-yellow-300">Cosmetic Shop</h2>
          <div className="flex items-center gap-4">
            <div className="bg-black/40 rounded-lg px-4 py-2 border-2 border-yellow-500">
              <span className="text-yellow-300 font-bold text-xl">💰 {coins}</span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-yellow-300 text-3xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(SKIN_INFO).map(([skin, info]) => {
            const skinKey = skin as PlayerSkin;
            const isUnlocked = unlockedSkins.includes(skinKey);
            const isEquipped = playerSkin === skinKey;
            const price = SKIN_PRICES[skinKey];
            const canAfford = coins >= price;
            
            return (
              <div
                key={skin}
                className={`bg-black/40 rounded-xl p-4 border-3 transition-all ${
                  isEquipped 
                    ? "border-green-400 shadow-lg shadow-green-400/50" 
                    : selectedSkin === skinKey
                    ? "border-yellow-400"
                    : "border-purple-600"
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{info.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{info.name}</h3>
                  <p className="text-sm text-gray-300 mb-3">{info.description}</p>
                  
                  {isEquipped ? (
                    <div className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                      ✓ Equipped
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleEquip(skinKey)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                    >
                      Equip
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchase(skinKey)}
                      disabled={!canAfford}
                      className={`w-full font-bold py-2 px-4 rounded-lg transition-all ${
                        canAfford
                          ? "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? `Buy ${price} 💰` : `Need ${price} 💰`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 bg-black/40 rounded-lg p-4 border-2 border-purple-600">
          <p className="text-white text-center">
            <span className="text-yellow-300 font-bold">💡 Tip:</span> Earn coins by catching throws! Higher combos give bonus coins.
          </p>
        </div>
      </div>
    </div>
  );
}
