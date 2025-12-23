import { useParadeGame } from "@/lib/stores/useParadeGame";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { joystickEnabled, toggleJoystick } = useParadeGame();
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
      <Card className="bg-purple-900/95 border-2 border-yellow-400 p-6 max-w-sm mx-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-yellow-300" />
            <h2 className="text-xl font-bold text-yellow-300">Settings</h2>
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

        <div className="space-y-4">
          {isMobile && (
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-semibold">Joystick Controls</p>
                <p className="text-xs text-gray-300 mt-1">
                  Use on-screen joystick for movement
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  How to use: touch and drag the round joystick. Release to stop.
                  Drag up/down/left/right to move in that direction. The joystick
                  supports multi-touch and pointer events for modern browsers.
                </p>
                <p className="text-xs text-yellow-300 mt-2 font-semibold">
                  Tip: Enable joystick for tablet & phone gameplay.
                </p>
              </div>
              <Switch
                checked={joystickEnabled}
                onCheckedChange={toggleJoystick}
                className="ml-3"
              />
            </div>
          )}

          {!isMobile && (
            <div className="p-4 bg-black/30 rounded-lg text-center">
              <p className="text-sm text-gray-300">
                Settings are available on mobile and tablet devices.
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={onClose}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
