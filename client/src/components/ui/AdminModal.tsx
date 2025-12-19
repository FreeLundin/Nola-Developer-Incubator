// Minimal AdminModal for editing bot names and personas (development only)
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog';
import { Button } from './button';

interface BotOverride {
  id: string;
  displayName?: string;
  persona?: string;
}

export function AdminModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [overrides, setOverrides] = useState<BotOverride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch('/bots.override.json')
      .then((r) => {
        if (!r.ok) return [] as any;
        return r.json();
      })
      .then((json) => {
        if (Array.isArray(json)) setOverrides(json);
        else if (json && typeof json === 'object' && Array.isArray(json.bots)) setOverrides(json.bots);
        else setOverrides([]);
      })
      .catch(() => setOverrides([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const save = async () => {
    setError(null);
    try {
      const body = overrides;
      const res = await fetch('/admin/bots', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('save failed');
      // notify running app to reload overrides
      window.dispatchEvent(new Event('bots:updated'));
      onClose();
    } catch (e: any) {
      setError(e?.message ?? 'failed');
    }
  };

  const changeName = (index: number, value: string) => setOverrides((s) => s.map((b, i) => (i === index ? { ...b, displayName: value } : b)));
  const changePersona = (index: number, value: string) => setOverrides((s) => s.map((b, i) => (i === index ? { ...b, persona: value } : b)));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin — Bot Overrides</DialogTitle>
          <DialogDescription>Edit bot display names and persona labels (local only).</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {loading && <div>Loading...</div>}
          {!loading && overrides.length === 0 && <div className="text-sm text-muted-foreground">No override file found — create one at project root as bots.override.json</div>}
          {!loading && overrides.map((b, i) => (
            <div key={b.id} className="grid grid-cols-2 gap-2 items-center">
              <div className="text-xs text-muted-foreground">{b.id}</div>
              <div className="flex gap-2">
                <input value={b.displayName || ''} onChange={(e) => changeName(i, e.target.value)} className="border p-1 rounded w-36" placeholder="Display name" />
                <input value={b.persona || ''} onChange={(e) => changePersona(i, e.target.value)} className="border p-1 rounded w-36" placeholder="Persona" />
              </div>
            </div>
          ))}
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <DialogFooter>
          <Button onClick={save} className="bg-green-600 text-white">Save</Button>
          <Button onClick={onClose} className="ml-2">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminModal;

