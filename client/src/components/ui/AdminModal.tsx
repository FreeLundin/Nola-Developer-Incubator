import React, { useState, useEffect } from 'react';
import { useParadeGame } from '@/lib/stores/useParadeGame';

export function AdminModal({ isOpen, onClose } : { isOpen: boolean; onClose: () => void }) {
  const botScores = useParadeGame((s) => s.botScores);
  const [local, setLocal] = useState(() => botScores.map(b => ({ id: b.id, displayName: b.displayName || b.id, persona: b.persona || '' })));

  useEffect(() => {
    setLocal(botScores.map(b => ({ id: b.id, displayName: b.displayName || b.id, persona: b.persona || '' })));
  }, [botScores, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const payload = { bots: local };
    try {
      await fetch('/admin/bots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      // trigger reload
      window.dispatchEvent(new Event('bots:updated'));
      onClose();
    } catch (e) {
      console.error('Failed saving bots', e);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white text-black p-4 rounded max-w-lg w-full">
        <h3 className="font-bold mb-2">Admin: Edit Bot Names (local only)</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto mb-3">
          {local.map((b, i) => (
            <div key={b.id} className="flex gap-2 items-center">
              <div className="w-16">{b.id}</div>
              <input className="flex-1 p-1 border" value={b.displayName} onChange={(e) => { const copy = [...local]; copy[i].displayName = e.target.value; setLocal(copy); }} />
              <input className="w-28 p-1 border" value={b.persona} onChange={(e) => { const copy = [...local]; copy[i].persona = e.target.value; setLocal(copy); }} placeholder="persona" />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1 bg-gray-200" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 bg-blue-600 text-white" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
