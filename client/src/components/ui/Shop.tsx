import React, { useState } from 'react';
import { useParadeGame } from '@/lib/stores/useParadeGame';
import { Button } from '@/components/ui/button';

export function Shop({ onClose }: { onClose?: () => void }) {
  const { coins, purchaseSkin, addCoins, spawnHelperBot } = useParadeGame();
  const [message, setMessage] = useState<string | null>(null);

  const handleBuyHelper = () => {
    const cost = 20;
    if (coins < cost) {
      setMessage('NOT_ENOUGH_COINS');
      return;
    }
    // Deduct and spawn helper
    useParadeGame.getState().addCoins(-cost);
    spawnHelperBot(12000); // 12s helper
    setMessage('HELPER_PURCHASED');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="bg-black/80 border-2 border-yellow-400 p-6 rounded-md text-white w-80">
        <h2 className="text-lg font-bold mb-3">Shop</h2>
        <div className="mb-3">Coins: {coins}</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">Helper Bot (12s)</div>
              <div className="text-sm text-gray-300">Spawns a helper bot that attracts nearby collectibles.</div>
            </div>
            <Button onClick={handleBuyHelper} className="bg-purple-700" data-testid="buy-helper">Buy 20</Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold">Golden Skin</div>
              <div className="text-sm text-gray-300">A shiny cosmetic skin.</div>
            </div>
            <Button onClick={() => { const ok = purchaseSkin('golden'); if (!ok) setMessage('NOT_ENOUGH_COINS'); else setMessage('SKIN_PURCHASED'); }} className="bg-purple-700" data-testid="buy-golden">Buy 100</Button>
          </div>
        </div>

        {message && (
          <div data-testid="shop-message" className="mt-3 p-2 bg-white/10 rounded text-sm">
            {message}
          </div>
        )}

        <div className="mt-4 text-right">
          <Button onClick={onClose} className="bg-gray-700" data-testid="close-shop">Close</Button>
        </div>
      </div>
    </div>
  );
}
