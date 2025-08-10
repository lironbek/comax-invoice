import { useState, useEffect } from "react";
import { Upload, Save, Plus, RotateCcw, Facebook, Instagram, MessageSquare, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceSettings } from "./InvoiceInterface";
import TemplateModal from "./TemplateModal";

interface EditingSidebarProps {
  settings: InvoiceSettings;
  onSettingsChange: (settings: Partial<InvoiceSettings>) => void;
  onSocialMediaChange: (platform: keyof InvoiceSettings["socialMedia"], value: string) => void;
  onSave: () => void;
  onCreateTemplate: () => void;
  onReset: () => void;
}

interface CustomTemplate {
  name: string;
  settings: InvoiceSettings;
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
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  
  // Load custom templates from localStorage on mount
  useEffect(() => {
    const loadedTemplates: CustomTemplate[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('custom_template_')) {
        const templateName = key.replace('custom_template_', '');
        const templateData = localStorage.getItem(key);
        if (templateData) {
          try {
            const settings = JSON.parse(templateData);
            loadedTemplates.push({ name: templateName, settings });
          } catch (e) {
            console.error('Failed to parse template data', e);
          }
        }
      }
    }
    setCustomTemplates(loadedTemplates);
  }, []);

  const systemTemplates = [
    { value: "לבן נקי", label: "לבן נקי" },
    { value: "צבעוני", label: "צבעוני" },
    { value: "מינימליסטי", label: "מינימליסטי" }
  ];

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

  const handleCreateTemplateClick = () => {
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = (templateName: string) => {
    const templateKey = `custom_template_${templateName}`;
    localStorage.setItem(templateKey, JSON.stringify(settings));
    
    const newTemplate = { name: templateName, settings: { ...settings } };
    setCustomTemplates(prev => [...prev, newTemplate]);
    
    setIsTemplateModalOpen(false);
  };

  const handleDeleteTemplate = (templateName: string) => {
    const templateKey = `custom_template_${templateName}`;
    localStorage.removeItem(templateKey);
    setCustomTemplates(prev => prev.filter(t => t.name !== templateName));
  };

  const handleTemplateSelect = (templateValue: string) => {
    // Check if it's a custom template
    const customTemplate = customTemplates.find(t => t.name === templateValue);
    if (customTemplate) {
      onSettingsChange(customTemplate.settings);
    } else {
      // System template
      onSettingsChange({ template: templateValue });
    }
  };

  const renderUploadArea = (
    field: keyof Pick<InvoiceSettings, 'topBanner' | 'logo' | 'bottomBanner'>,
    label: string,
    currentImage: string | null
  ) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-receipt-text">{label}</Label>
      {currentImage ? (
        <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">קובץ עלה בהצלחה</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRemoveImage(field)}
              className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <img 
            src={currentImage} 
            alt={`Uploaded ${label}`}
            className="w-full h-20 object-cover rounded border"
          />
        </div>
      ) : (
        <div 
          onClick={() => handleFileUpload(field)}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">
            גרור ושחרר קובץ או <span className="text-blue-500 underline">לחץ כאן</span>
          </p>
          <p className="text-xs text-gray-500">
            גודל מומלץ 200x200px מקסימום 1MB
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-8">
        {/* Template Selection */}
        <div>
          <Label className="text-base font-medium mb-3 block text-receipt-text">טמפלטים קיימים</Label>
          
          {/* System Templates */}
          <div className="space-y-2 mb-4">
            {systemTemplates.map((template) => (
              <div
                key={template.value}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                  settings.template === template.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTemplateSelect(template.value)}
              >
                <span className="text-sm font-medium text-receipt-text">{template.label}</span>
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                  {settings.template === template.value && (
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Custom Templates */}
          {customTemplates.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-receipt-text mb-2">הטמפלטים שלי</h4>
              {customTemplates.map((template) => (
                <div
                  key={template.name}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleTemplateSelect(template.name)}
                  >
                    <span className="text-sm font-medium text-receipt-text">{template.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTemplate(template.name)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
          onClick={handleCreateTemplateClick}
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
      
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}