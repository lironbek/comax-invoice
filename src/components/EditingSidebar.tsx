
import { useState } from "react";
import { Upload, Save, Plus, RotateCcw, Facebook, Instagram, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceSettings } from "./InvoiceInterface";

interface EditingSidebarProps {
  settings: InvoiceSettings;
  onSettingsChange: (settings: Partial<InvoiceSettings>) => void;
  onSocialMediaChange: (platform: keyof InvoiceSettings["socialMedia"], value: string) => void;
  onSave: () => void;
  onCreateTemplate: () => void;
  onReset: () => void;
}

export default function EditingSidebar({
  settings,
  onSettingsChange,
  onSocialMediaChange,
  onSave,
  onCreateTemplate,
  onReset,
}: EditingSidebarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [dragStates, setDragStates] = useState({
    topBanner: false,
    logo: false,
    bottomBanner: false
  });

  const handleFileUpload = (field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onSettingsChange({ [field]: url });
        console.log(`Image uploaded for ${field}:`, url);
      }
    };
    input.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnter = (e: React.DragEvent, field: keyof typeof dragStates) => {
    e.preventDefault();
    e.stopPropagation();
    setDragStates(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, field: keyof typeof dragStates) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragStates(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        onSettingsChange({ [field]: url });
        console.log(`Image uploaded for ${field}:`, url);
      } else {
        console.error("File is not an image");
      }
    }
  };

  const handleRemoveImage = (field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>) => {
    onSettingsChange({ [field]: null });
  };

  const handleColorChange = (field: string, value: string) => {
    onSettingsChange({ [field]: value });
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave();
    setIsSaving(false);
  };

  const renderUploadArea = (
    field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>,
    label: string,
    currentImage: string | null
  ) => (
    <div>
      <Label className="text-sm font-medium mb-2 block text-receipt-text">{label}</Label>
      {currentImage ? (
        <div className="relative border-2 border-receipt-border rounded-lg p-4">
          <img 
            src={currentImage} 
            alt={`Uploaded ${label}`}
            className="w-full h-24 object-cover rounded"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRemoveImage(field)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="mt-2 text-xs text-receipt-gray text-center">
            {label} uploaded successfully
          </div>
        </div>
      ) : (
        <div 
          onClick={() => handleFileUpload(field)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, field)}
          onDragLeave={(e) => handleDragLeave(e, field)}
          onDrop={(e) => handleDrop(e, field)}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
            dragStates[field] 
              ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-400 ring-opacity-50' 
              : 'border-receipt-border hover:border-receipt-gray'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-receipt-gray" />
          <p className="text-sm text-receipt-gray">
            {dragStates[field] ? 'Drop image here' : 'גרור ושחרר קובץ או'}{" "}
            {!dragStates[field] && <span className="text-blue-500 underline">לחץ כאן</span>}
          </p>
          {!dragStates[field] && (
            <p className="text-xs text-receipt-gray mt-1">
              PNG, JPG עד 1MB מומלץ 200x200px
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Template Selection */}
        <div>
          <Label className="text-base font-medium mb-3 block text-receipt-text">טמפלטים</Label>
          <Select value={settings.template} onValueChange={(value) => onSettingsChange({ template: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="לבן נקי">לבן נקי</SelectItem>
              <SelectItem value="צבעוני">צבעוני</SelectItem>
              <SelectItem value="מינימליסטי">מינימליסטי</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logo & Banners */}
        <div>
          <Label className="text-base font-medium mb-3 block text-receipt-text">לוגו ובאנרים</Label>
          <p className="text-sm text-receipt-gray mb-4">
            באמצעות עריכת התמונות יהיה ניתן להכניס טקסט הבנקת שדות התוצרת
          </p>
          
          <div className="space-y-4">
            {renderUploadArea('topBanner', 'באנר עליון', settings.topBanner)}
            {renderUploadArea('logo', 'לוגו', settings.logo)}
            {renderUploadArea('bottomBanner', 'באנר תחתון', settings.bottomBanner)}
          </div>
        </div>

        {/* Font Selection */}
        <div>
          <Label className="text-base font-medium mb-3 block text-receipt-text">גופן</Label>
          <Select value={settings.font} onValueChange={(value) => onSettingsChange({ font: value })}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Assistant">Assistant</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Colors */}
        <div>
          <Label className="text-base font-medium mb-3 block text-receipt-text">צבעים</Label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-receipt-text">רקע</Label>
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded border border-receipt-border cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm text-receipt-text">טקסט</Label>
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => handleColorChange('textColor', e.target.value)}
                className="w-8 h-8 rounded border border-receipt-border cursor-pointer"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label className="text-sm text-receipt-text">טקסט מבצע</Label>
              <input
                type="color"
                value={settings.promotionTextColor}
                onChange={(e) => handleColorChange('promotionTextColor', e.target.value)}
                className="w-8 h-8 rounded border border-receipt-border cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <Label className="text-base font-medium mb-3 block text-receipt-text">קישור לרשתות החברתיות</Label>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-blue-600" />
              <Input
                placeholder="הזן כתובת URL"
                value={settings.socialMedia.facebook}
                onChange={(e) => onSocialMediaChange('facebook', e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Instagram className="w-5 h-5 text-pink-600" />
              <Input
                placeholder="הזן כתובת URL"
                value={settings.socialMedia.instagram}
                onChange={(e) => onSocialMediaChange('instagram', e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-receipt-gray" />
              <Input
                placeholder="הזן כתובת URL"
                value={settings.socialMedia.other}
                onChange={(e) => onSocialMediaChange('other', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white border-t border-receipt-border p-6 space-y-3">
        <Button 
          onClick={handleSaveClick}
          disabled={isSaving}
          className="w-full bg-receipt-green hover:bg-receipt-green/90 text-white"
        >
          <Save className="w-4 h-4 ml-2" />
          {isSaving ? "שומר..." : "שמור שינויים"}
        </Button>
        
        <Button 
          onClick={onCreateTemplate}
          variant="outline" 
          className="w-full border-receipt-border text-receipt-text hover:bg-receipt-lightgray"
        >
          <Plus className="w-4 h-4 ml-2" />
          צור טמפלט
        </Button>
        
        <button 
          onClick={onReset}
          className="w-full text-sm text-receipt-gray hover:text-receipt-text flex items-center justify-center gap-2 py-2"
        >
          <RotateCcw className="w-4 h-4" />
          אפס הכל
        </button>
      </div>
    </div>
  );
}
