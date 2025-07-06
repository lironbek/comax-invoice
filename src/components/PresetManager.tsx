import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Save } from "lucide-react";
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

  const allPresets = [...SYSTEM_PRESETS, ...customPresets];

  const handlePresetSelect = (presetId: string) => {
    const preset = allPresets.find(p => p.id === presetId);
    if (preset) {
      onSettingsChange({
        backgroundColor: preset.backgroundColor,
        innerFrameColor: preset.innerFrameColor,
        outerFrameColor: preset.outerFrameColor,
        font: preset.font,
      });
    }
  };

  const handleSavePreset = () => {
    if (!presetName.trim()) return;

    const newPreset: DesignPreset = {
      id: `custom-${Date.now()}`,
      name: presetName,
      backgroundColor: settings.backgroundColor,
      innerFrameColor: settings.innerFrameColor,
      outerFrameColor: settings.outerFrameColor,
      font: settings.font,
      isSystemPreset: false,
    };

    setCustomPresets(prev => [...prev, newPreset]);
    setPresetName("");
    setIsDialogOpen(false);
  };

  const handleDeletePreset = (presetId: string) => {
    setCustomPresets(prev => prev.filter(p => p.id !== presetId));
  };

  return (
    <div className="space-y-4">
      {/* Design Presets Dropdown */}
      <div className="space-y-2">
        <Label className="font-medium">Design Presets</Label>
        <div className="flex gap-2">
          <Select onValueChange={handlePresetSelect}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Choose a preset" />
            </SelectTrigger>
            <SelectContent>
              {SYSTEM_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  {preset.name}
                </SelectItem>
              ))}
              {customPresets.length > 0 && (
                <>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    Custom Presets
                  </div>
                  {customPresets.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{preset.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePreset(preset.id);
                          }}
                          className="h-6 w-6 p-0 ml-2"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>

          {/* Save Preset Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Save Design Preset</DialogTitle>
                <DialogDescription>
                  Save your current design configuration as a custom preset.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="preset-name">Preset Name</Label>
                  <Input
                    id="preset-name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Enter preset name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleSavePreset}
                  disabled={!presetName.trim()}
                >
                  Save Preset
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
