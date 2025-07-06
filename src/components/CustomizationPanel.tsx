import { InvoiceSettings } from "./InvoiceCustomizer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, MessageSquare, X, Upload } from "lucide-react";
import { useState } from "react";
import PresetManager from "./PresetManager";

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

  const DragDropArea = ({ 
    field, 
    title, 
    inputId, 
    hasImage, 
    description 
  }: {
    field: 'bannerImage' | 'secondaryBannerImage' | 'logo';
    title: string;
    inputId: string;
    hasImage: boolean;
    description: string;
  }) => (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="font-medium">
        {title}
      </Label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragStates[field] 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => handleDragOver(e, field)}
        onDragLeave={(e) => handleDragLeave(e, field)}
        onDrop={(e) => handleDrop(e, field)}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          Drag & drop an image here, or click to browse
        </p>
        <p className="text-xs text-gray-500">{description}</p>
        {hasImage && (
          <div className="flex items-center justify-center mt-3">
            <span className="text-sm text-green-600 mr-2">✓ Image uploaded</span>
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

  return (
    <div className="space-y-6">
      <PresetManager 
        settings={settings} 
        onSettingsChange={onSettingsChange} 
      />

      <div className="space-y-4">
        <DragDropArea
          field="bannerImage"
          title="Promotional Banner"
          inputId="banner-upload"
          hasImage={!!settings.bannerImage}
          description="Recommended size: 800x200px, max 2MB"
        />

        <DragDropArea
          field="logo"
          title="Company Logo"
          inputId="logo-upload"
          hasImage={!!settings.logo}
          description="Recommended size: 200x200px, max 1MB"
        />

        <DragDropArea
          field="secondaryBannerImage"
          title="Secondary Banner"
          inputId="secondary-banner-upload"
          hasImage={!!settings.secondaryBannerImage}
          description="Recommended size: 800x100px, max 1MB"
        />

        <div className="space-y-4">
          <Label className="font-medium">Colors</Label>
          
          <div className="space-y-2">
            <Label htmlFor="background-color" className="text-sm">
              Background Color
            </Label>
            <div className="flex items-center space-x-4">
              <Input
                type="color"
                id="background-color"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                className="w-28"
                maxLength={7}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inner-frame-color" className="text-sm">
              Inner Frame Color
            </Label>
            <div className="flex items-center space-x-4">
              <Input
                type="color"
                id="inner-frame-color"
                value={settings.innerFrameColor}
                onChange={(e) => onSettingsChange({ innerFrameColor: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings.innerFrameColor}
                onChange={(e) => onSettingsChange({ innerFrameColor: e.target.value })}
                className="w-28"
                maxLength={7}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="outer-frame-color" className="text-sm">
              Outer Frame Color
            </Label>
            <div className="flex items-center space-x-4">
              <Input
                type="color"
                id="outer-frame-color"
                value={settings.outerFrameColor}
                onChange={(e) => onSettingsChange({ outerFrameColor: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={settings.outerFrameColor}
                onChange={(e) => onSettingsChange({ outerFrameColor: e.target.value })}
                className="w-28"
                maxLength={7}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="font-medium">Social Media Links</Label>
          
          <div className="flex items-center space-x-3">
            <Facebook size={20} className="text-blue-600" />
            <Input
              placeholder="Facebook URL"
              value={settings.socialMedia.facebook}
              onChange={(e) => onSocialMediaChange("facebook", e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Instagram size={20} className="text-pink-600" />
            <Input
              placeholder="Instagram URL"
              value={settings.socialMedia.instagram}
              onChange={(e) => onSocialMediaChange("instagram", e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <MessageSquare size={20} className="text-black" />
            <Input
              placeholder="TikTok URL"
              value={settings.socialMedia.tiktok}
              onChange={(e) => onSocialMediaChange("tiktok", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-[#34A853] hover:bg-[#2A8644] transition-colors"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
