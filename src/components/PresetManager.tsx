import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save } from "lucide-react";
import { DesignPreset, SYSTEM_PRESETS } from "@/types/presets";
import { InvoiceSettings } from "./InvoiceCustomizer";

interface PresetManagerProps {
  settings: InvoiceSettings;
  onSettingsChange: (settings: Partial<InvoiceSettings>) => void;
}

export default function PresetManager({ settings, onSettingsChange }: PresetManagerProps) {
  const [customPresets, setCustomPresets] = useState<DesignPreset[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [presetName, setPresetName] = useState("");

  const handlePresetSelect = (presetId: string) => {
    const preset = SYSTEM_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onSettingsChange({
        backgroundColor: preset.backgroundColor,
        innerFrameColor: preset.innerFrameColor,
        outerFrameColor: preset.outerFrameColor,
        font: preset.font,
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {SYSTEM_PRESETS.map((preset) => (
        <div
          key={preset.id}
          className="preset-card p-3 rounded-lg cursor-pointer border hover:border-primary"
          onClick={() => handlePresetSelect(preset.id)}
        >
          <div className="space-y-2">
            <div className="text-sm font-medium font-hebrew">{preset.name}</div>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: preset.backgroundColor }} />
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: preset.innerFrameColor }} />
              <div className="w-4 h-4 rounded border" style={{ backgroundColor: preset.outerFrameColor }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}