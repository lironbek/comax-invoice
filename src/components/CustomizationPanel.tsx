import { InvoiceSettings } from "./InvoiceCustomizer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, MessageSquare, X, Upload } from "lucide-react";
import { useState } from "react";
import PresetManager from "./PresetManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_FONTS } from "@/types/presets";

interface CustomizationPanelProps {
  settings: InvoiceSettings;
  onSettingsChange: (settings: Partial<InvoiceSettings>) => void;
  onSocialMediaChange: (platform: keyof InvoiceSettings["socialMedia"], value: string) => void;
  onFileRemove: (field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function CustomizationPanel({
  settings,
  onSettingsChange,
  onSocialMediaChange,
  onFileRemove,
  onSave,
  isSaving
}: CustomizationPanelProps) {
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

  const handleFontChange = (font: string) => {
    onSettingsChange({ font });
  };

  const DragDropArea = ({ 
    field, 
    title, 
    description,
    currentImage
  }: {
    field: 'bannerImage' | 'secondaryBannerImage' | 'logo';
    title: string;
    description: string;
    currentImage: string | null;
  }) => {
    const inputId = `${field}-upload`;
    
    return (
      <div className="space-y-2">
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragStates[field] 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => handleDragOver(e, field)}
          onDragLeave={(e) => handleDragLeave(e, field)}
          onDrop={(e) => handleDrop(e, field)}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          <Upload className="mx-auto h-6 w-6 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 mb-1 font-hebrew">
            {title}
          </p>
          <p className="text-xs text-gray-500">{description}</p>
          {currentImage && (
            <div className="flex items-center justify-center mt-3">
              <span className="text-sm text-green-600 mr-2">✓ תמונה הועלתה</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove(field);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <input
            type="file"
            id={inputId}
            className="sr-only"
            accept="image/*"
            onChange={(e) => handleInputFileUpload(e, field)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 rtl">
      {/* Header */}
      <div className="text-center pb-4 border-b">
        <h2 className="text-lg font-semibold font-hebrew">התאמה אישית</h2>
        <p className="text-sm text-muted-foreground">התאם את החשבונית לפי הטעם שלך</p>
      </div>

      {/* Preset Manager */}
      <div>
        <Label className="font-medium mb-3 block font-hebrew">טמפלטים</Label>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">זרקן ווקי</p>
          <PresetManager 
            settings={settings} 
            onSettingsChange={onSettingsChange}
          />
        </div>
      </div>

      {/* Logo and Banners */}
      <div className="space-y-4">
        <Label className="font-medium mb-2 block font-hebrew">לוגו ובאנרים</Label>
        <p className="text-sm text-muted-foreground mb-3">
          באפשרותך להעלות את הלוגו או הבאנר שירצית לחצוגה
        </p>
        
        <div className="space-y-3">
          <DragDropArea 
            field="bannerImage"
            currentImage={settings.bannerImage}
            title="גרור ושחרר קלק א בוקצ קגא"
            description="גודל מומלץ 200x200px, מקסימום 1MB"
          />
          
          <DragDropArea 
            field="logo"
            currentImage={settings.logo}
            title="לוגו"
            description="גודל מומלץ 200x200px, מקסימום 1MB"
          />
          
          <DragDropArea 
            field="secondaryBannerImage"
            currentImage={settings.secondaryBannerImage}
            title="באנר תחתון"
            description="גודל מומלץ 200x200px, מקסימום 1MB"
          />
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-2">
        <Label className="font-medium font-hebrew">גופן</Label>
        <Select value={settings.font} onValueChange={handleFontChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_FONTS.map((font) => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: font }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <Label className="font-medium font-hebrew">צבעים</Label>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
              className="w-8 h-8 p-0 border-0 rounded"
            />
            <Label className="text-sm font-hebrew">רקע</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={settings.textColor}
              onChange={(e) => onSettingsChange({ textColor: e.target.value })}
              className="w-8 h-8 p-0 border-0 rounded"
            />
            <Label className="text-sm font-hebrew">טקסט</Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={settings.discountColor}
              onChange={(e) => onSettingsChange({ discountColor: e.target.value })}
              className="w-8 h-8 p-0 border-0 rounded"
            />
            <Label className="text-sm font-hebrew">הנחת מבצע</Label>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <Label className="font-medium font-hebrew">קישור לרשתות החברתיות</Label>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <Input
              placeholder="כתן כתובת URL"
              value={settings.socialMedia.facebook}
              onChange={(e) => onSocialMediaChange('facebook', e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-600 flex-shrink-0" />
            <Input
              placeholder="כתן כתובת URL"
              value={settings.socialMedia.instagram}
              onChange={(e) => onSocialMediaChange('instagram', e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-gray-600 flex-shrink-0" />
            <Input
              placeholder="כתן כתובת URL"
              value={settings.socialMedia.tiktok}
              onChange={(e) => onSocialMediaChange('tiktok', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button 
        onClick={onSave} 
        disabled={isSaving}
        className="w-full bg-primary hover:bg-primary/90 text-white font-hebrew"
      >
        {isSaving ? "שמירה..." : "שמור שינויים"}
      </Button>
    </div>
  );
}