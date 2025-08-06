
import { useState } from "react";
import { Upload, Save, Plus, RotateCcw, Facebook, Instagram, MessageSquare } from "lucide-react";
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
  const [draggedField, setDraggedField] = useState<string | null>(null);

  const handleFileUpload = (field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onSettingsChange({ [field]: url });
      }
    };
    input.click();
  };

  const handleDrop = (e: React.DragEvent, field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>) => {
    e.preventDefault();
    setDraggedField(null);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onSettingsChange({ [field]: url });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    setDraggedField(field);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedField(null);
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

  const ImageUploadArea = ({ 
    field, 
    label, 
    currentImage 
  }: { 
    field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>; 
    label: string;
    currentImage: string | null;
  }) => (
    <div>
      <Label className="text-sm font-medium mb-2 block text-receipt-text">{label}</Label>
      <div 
        onClick={() => handleFileUpload(field)}
        onDrop={(e) => handleDrop(e, field)}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, field)}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          draggedField === field 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-receipt-border hover:border-receipt-gray'
        }`}
      >
        {currentImage ? (
          <img 
            src={currentImage} 
            alt={label}
            className="w-full h-20 object-contain mb-2"
          />
        ) : (
          <img 
            src="/lovable-uploads/b4e45a56-ff10-4f6e-90e8-95d04d396c1c.png" 
            alt="Placeholder"
            className="w-16 h-16 mx-auto mb-2 opacity-50"
          />
        )}
        <Upload className="w-8 h-8 mx-auto mb-2 text-receipt-gray" />
        <p className="text-sm text-receipt-gray">
          גרור ושחרר קובץ או{" "}
          <span className="text-blue-500 underline">לחץ כאן</span>
        </p>
        <p className="text-xs text-receipt-gray mt-1">
          PNG, JPG עד 1MB מומלץ 200x200px
        </p>
      </div>
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
            <ImageUploadArea 
              field="topBanner" 
              label="באנר עליון" 
              currentImage={settings.topBanner}
            />
            
            <ImageUploadArea 
              field="logo" 
              label="לוגו" 
              currentImage={settings.logo}
            />
            
            <ImageUploadArea 
              field="bottomBanner" 
              label="באנר תחתון" 
              currentImage={settings.bottomBanner}
            />
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
