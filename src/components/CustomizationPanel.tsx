import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Save, RotateCcw } from "lucide-react";
import { InvoiceSettings } from "./InvoiceCustomizer";
import { AVAILABLE_FONTS, SYSTEM_PRESETS } from "@/types/presets";

interface CustomizationPanelProps {
  settings: InvoiceSettings;
  onSettingsChange: (settings: Partial<InvoiceSettings>) => void;
  onSocialMediaChange: (platform: keyof InvoiceSettings["socialMedia"], value: string) => void;
  onFileRemove: (field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => void;
  onSave: () => void;
  isSaving: boolean;
  onReset?: () => void;
}

export default function CustomizationPanel({
  settings,
  onSettingsChange,
  onSocialMediaChange,
  onFileRemove,
  onSave,
  isSaving,
  onReset
}: CustomizationPanelProps) {
  
  const handlePresetSelect = (presetId: string) => {
    const preset = SYSTEM_PRESETS.find(p => p.id === presetId);
    if (preset) {
      onSettingsChange({
        backgroundColor: preset.backgroundColor,
        font: preset.font
      });
    }
  };

  const [dragStates, setDragStates] = useState({
    bannerImage: false,
    secondaryBannerImage: false,
    logo: false
  });

  const handleFileUpload = (file: File, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    onSettingsChange({ [field]: imageUrl });
  };

  const handleInputFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, field);
    }
  };

  const handleDragOver = (e: React.DragEvent, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e: React.DragEvent, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file, field);
      }
    }
  };

  const DragDropArea = ({ 
    label,
    file,
    onFileUpload,
    onInputFileUpload,
    onRemove,
    isDragOver,
    onDragOver,
    onDragLeave,
    onDrop
  }: {
    label: string;
    file: string | null;
    onFileUpload: (file: File) => void;
    onInputFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  }) => {
    const inputId = `${label}-upload`;
    
    return (
      <div className="space-y-2">
        <Label className="text-sm text-right">{label}</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragOver 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          {file ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-green-600">✓ תמונה הועלתה</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div>
              <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">גרור קובץ או לחץ להעלאה</p>
            </div>
          )}
          <input
            type="file"
            id={inputId}
            className="sr-only"
            accept="image/*"
            onChange={onInputFileUpload}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-right">ניהול עיצוב</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection Dropdown */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-right">תבניות עיצוב</Label>
          <Select onValueChange={handlePresetSelect}>
            <SelectTrigger className="w-full text-right">
              <SelectValue placeholder="בחר תבנית עיצוב" />
            </SelectTrigger>
            <SelectContent>
              {SYSTEM_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id} className="text-right">
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Logo and Banner Upload */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-right block">תמונות</Label>
          <div className="space-y-3">
            <DragDropArea
              label="בנר עליון"
              file={settings.bannerImage}
              onFileUpload={(file) => handleFileUpload(file, 'bannerImage')}
              onInputFileUpload={(e) => handleInputFileUpload(e, 'bannerImage')}
              onRemove={() => onFileRemove('bannerImage')}
              isDragOver={dragStates.bannerImage}
              onDragOver={(e) => handleDragOver(e, 'bannerImage')}
              onDragLeave={(e) => handleDragLeave(e, 'bannerImage')}
              onDrop={(e) => handleDrop(e, 'bannerImage')}
            />
            <DragDropArea
              label="לוגו"
              file={settings.logo}
              onFileUpload={(file) => handleFileUpload(file, 'logo')}
              onInputFileUpload={(e) => handleInputFileUpload(e, 'logo')}
              onRemove={() => onFileRemove('logo')}
              isDragOver={dragStates.logo}
              onDragOver={(e) => handleDragOver(e, 'logo')}
              onDragLeave={(e) => handleDragLeave(e, 'logo')}
              onDrop={(e) => handleDrop(e, 'logo')}
            />
            <DragDropArea
              label="בנר תחתון"
              file={settings.secondaryBannerImage}
              onFileUpload={(file) => handleFileUpload(file, 'secondaryBannerImage')}
              onInputFileUpload={(e) => handleInputFileUpload(e, 'secondaryBannerImage')}
              onRemove={() => onFileRemove('secondaryBannerImage')}
              isDragOver={dragStates.secondaryBannerImage}
              onDragOver={(e) => handleDragOver(e, 'secondaryBannerImage')}
              onDragLeave={(e) => handleDragLeave(e, 'secondaryBannerImage')}
              onDrop={(e) => handleDrop(e, 'secondaryBannerImage')}
            />
          </div>
        </div>

        {/* Font Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-right">גופן</Label>
          <Select value={settings.font} onValueChange={(value) => onSettingsChange({ font: value })}>
            <SelectTrigger className="w-full text-right">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_FONTS.map((font) => (
                <SelectItem key={font} value={font} className="text-right">
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Customization */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-right block">צבעים</Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <Label className="text-sm text-right">צבע רקע</Label>
            </div>
            <div className="flex items-center justify-between">
              <Input
                type="color"
                value={settings.textColor}
                onChange={(e) => onSettingsChange({ textColor: e.target.value })}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <Label className="text-sm text-right">צבע טקסט</Label>
            </div>
            <div className="flex items-center justify-between">
              <Input
                type="color"
                value={settings.discountColor}
                onChange={(e) => onSettingsChange({ discountColor: e.target.value })}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <Label className="text-sm text-right">צבע הנחה</Label>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <Label className="text-sm font-medium text-right block">קישורי רשתות חברתיות</Label>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-right block">פייסבוק</Label>
              <Input
                type="url"
                placeholder="https://facebook.com/yourpage"
                value={settings.socialMedia.facebook}
                onChange={(e) => onSocialMediaChange('facebook', e.target.value)}
                className="text-right"
                dir="ltr"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-right block">אינסטגרם</Label>
              <Input
                type="url"
                placeholder="https://instagram.com/yourpage"
                value={settings.socialMedia.instagram}
                onChange={(e) => onSocialMediaChange('instagram', e.target.value)}
                className="text-right"
                dir="ltr"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-right block">טיקטוק</Label>
              <Input
                type="url"
                placeholder="https://tiktok.com/@yourpage"
                value={settings.socialMedia.tiktok}
                onChange={(e) => onSocialMediaChange('tiktok', e.target.value)}
                className="text-right"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Save and Reset Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg"
          >
            <Save className="h-4 w-4 ml-2" />
            שמור עיצוב
          </Button>
          {onReset && (
            <Button 
              onClick={onReset}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 rounded-lg"
            >
              <RotateCcw className="h-4 w-4 ml-2" />
              איפוס
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}