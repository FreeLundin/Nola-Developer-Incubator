import {useParadeGame} from "@/lib/stores/useParadeGame";
import {useIsMobile} from "@/hooks/use-is-mobile";
import {Settings, Volume2, VolumeX, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Switch} from "@/components/ui/switch";
import {useEffect, useState} from "react";
import {useAudio} from "@/lib/stores/useAudio";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { joystickEnabled, toggleJoystick } = useParadeGame();
  const isMobile = useIsMobile();
  const { isMuted, toggleMute } = useAudio();

  // HUD toggles persisted in localStorage
  const [showFloatLabels, setShowFloatLabels] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showFloatLabels') === null ? true : localStorage.getItem('hud:showFloatLabels') === 'true'; } catch { return true; }
  });
  const [showPowerUps, setShowPowerUps] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showPowerUps') === null ? true : localStorage.getItem('hud:showPowerUps') === 'true'; } catch { return true; }
  });
  const [showCompetitors, setShowCompetitors] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showCompetitors') === null ? true : localStorage.getItem('hud:showCompetitors') === 'true'; } catch { return true; }
  });
  const [showRemainingFloats, setShowRemainingFloats] = useState<boolean>(() => {
    try { return localStorage.getItem('hud:showRemainingFloats') === null ? true : localStorage.getItem('hud:showRemainingFloats') === 'true'; } catch { return true; }
  });
  const [enableAdvancedPost, setEnableAdvancedPost] = useState<boolean>(() => {
    try { return localStorage.getItem('visual:advancedPost') === null ? false : localStorage.getItem('visual:advancedPost') === 'true'; } catch { return false; }
  });
  const [enableConfetti, setEnableConfetti] = useState<boolean>(() => {
    try { return localStorage.getItem('visual:confetti') === null ? true : localStorage.getItem('visual:confetti') === 'true'; } catch { return true; }
  });
  const [enableHDRI, setEnableHDRI] = useState<boolean>(() => {
    try { return localStorage.getItem('visual:hdri') === null ? false : localStorage.getItem('visual:hdri') === 'true'; } catch { return false; }
  });

  useEffect(() => { try { localStorage.setItem('hud:showFloatLabels', String(showFloatLabels)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showFloatLabels]);
  useEffect(() => { try { localStorage.setItem('hud:showPowerUps', String(showPowerUps)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showPowerUps]);
  useEffect(() => { try { localStorage.setItem('hud:showCompetitors', String(showCompetitors)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showCompetitors]);
  useEffect(() => { try { localStorage.setItem('hud:showRemainingFloats', String(showRemainingFloats)); window.dispatchEvent(new Event('hud:updated')); } catch {} }, [showRemainingFloats]);
  useEffect(() => { try { localStorage.setItem('visual:advancedPost', String(enableAdvancedPost)); window.dispatchEvent(new Event('visual:updated')); } catch {} }, [enableAdvancedPost]);
  useEffect(() => { try { localStorage.setItem('visual:confetti', String(enableConfetti)); window.dispatchEvent(new Event('visual:updated')); } catch {} }, [enableConfetti]);
  useEffect(() => { try { localStorage.setItem('visual:hdri', String(enableHDRI)); window.dispatchEvent(new Event('visual:updated')); } catch {} }, [enableHDRI]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
      <Card className="bg-purple-900/95 border-2 border-yellow-400 p-6 max-w-md mx-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-yellow-300" />
            <h2 className="text-2xl font-extrabold text-yellow-300">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:text-yellow-300"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Joystick toggle (mobile) */}
          {isMobile && (
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div>
                <p className="text-sm font-semibold">Joystick Controls</p>
                <p className="text-xs text-gray-300 mt-1">On-screen joystick for mobile controls.</p>
              </div>
              <Switch checked={joystickEnabled} onCheckedChange={toggleJoystick} className="ml-3" data-testid="joystick-toggle" />
            </div>
          )}

          {/* Audio toggle */}
          <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
            <div className="flex items-center gap-3">
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-300" />}
              <div>
                <p className="text-sm font-semibold">Audio</p>
                <p className="text-xs text-gray-300 mt-1">Toggle game audio on/off.</p>
              </div>
            </div>
            <Switch checked={isMuted} onCheckedChange={() => toggleMute()} className="ml-3" data-testid="audio-toggle" />
          </div>

          {/* HUD toggles */}
          <div className="p-3 bg-black/30 rounded-lg">
            <p className="text-sm font-semibold mb-2">HUD Options</p>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-white text-xs">
                <div>
                  <div className="font-semibold">Show Float Labels</div>
                  <div className="text-[11px] text-gray-300">Display numbers above/in front of floats.</div>
                </div>
                <Switch checked={showFloatLabels} onCheckedChange={(v) => setShowFloatLabels(Boolean(v))} />
              </label>

              <label className="flex items-center justify-between text-white text-xs">
                <div>
                  <div className="font-semibold">Show Power-ups</div>
                  <div className="text-[11px] text-gray-300">Show active power-up icons and timers.</div>
                </div>
                <Switch checked={showPowerUps} onCheckedChange={(v) => setShowPowerUps(Boolean(v))} />
              </label>

              <label className="flex items-center justify-between text-white text-xs">
                <div>
                  <div className="font-semibold">Show Competitors</div>
                  <div className="text-[11px] text-gray-300">Show competitor bot catches list.</div>
                </div>
                <Switch checked={showCompetitors} onCheckedChange={(v) => setShowCompetitors(Boolean(v))} />
              </label>

              <label className="flex items-center justify-between text-white text-xs">
                <div>
                  <div className="font-semibold">Show Remaining Floats</div>
                  <div className="text-[11px] text-gray-300">Show remaining float counter (dev only).</div>
                </div>
                <Switch checked={showRemainingFloats} onCheckedChange={(v) => setShowRemainingFloats(Boolean(v))} />
              </label>
            </div>
          </div>

          {/* Visual / Performance toggles */}
          <div className="mt-3 border-t border-white/5 pt-3">
            <p className="text-xs text-gray-300 mb-2">Visual Options</p>
            <label className="flex items-center justify-between text-white text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Advanced Post-processing</span>
                  <span className="px-2 py-0.5 text-[11px] rounded bg-red-700 text-yellow-100 font-bold">High</span>
                </div>
                <div className="text-[11px] text-gray-300">Enable depth-of-field and LUT color grading (may reduce performance).</div>
              </div>
              <Switch checked={enableAdvancedPost} onCheckedChange={(v) => setEnableAdvancedPost(Boolean(v))} />
            </label>

            <label className="flex items-center justify-between text-white text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Confetti Particle Effects</span>
                  <span className="px-2 py-0.5 text-[11px] rounded bg-amber-700 text-white font-semibold">Medium</span>
                </div>
                <div className="text-[11px] text-gray-300">Enable small confetti bursts for celebrations.</div>
              </div>
              <Switch checked={enableConfetti} onCheckedChange={(v) => setEnableConfetti(Boolean(v))} />
            </label>

            <label className="flex items-center justify-between text-white text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">HDR Environment</span>
                  <span className="px-2 py-0.5 text-[11px] rounded bg-red-700 text-yellow-100 font-bold">High</span>
                </div>
                <div className="text-[11px] text-gray-300">Use HDRI lighting for richer materials (increases memory).</div>
              </div>
              <Switch checked={enableHDRI} onCheckedChange={(v) => setEnableHDRI(Boolean(v))} />
            </label>
          </div>

          <div className="pt-2">
            <Button
              onClick={onClose}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold"
              data-testid="settings-close"
            >
              Done
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
