import { useState, useEffect } from "react";
import { Upload, Save, Plus, RotateCcw, Facebook, Instagram, MessageSquare, X, Check, Trash2, FileText, User } from "lucide-react";
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
  const [dragStates, setDragStates] = useState({
    topBanner: false,
    logo: false,
    bottomBanner: false
  });

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
    <div>
      <Label className="text-sm font-medium mb-2 block text-receipt-text">{label}</Label>
      {currentImage ? (
        <div className="relative border-2 border-green-300 rounded-lg p-3 bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">קובץ עלה בהצלחה</span>
          </div>
          <img 
            src={currentImage} 
            alt={`Uploaded ${label}`}
            className="w-full h-16 object-cover rounded"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleRemoveImage(field)}
            className="absolute top-1 right-1 h-6 w-6 p-0 text-gray-500 hover:text-red-500"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div 
          onClick={() => handleFileUpload(field)}
          onDragOver={handleDragOver}
          onDragEnter={(e) => handleDragEnter(e, field)}
          onDragLeave={(e) => handleDragLeave(e, field)}
          onDrop={(e) => handleDrop(e, field)}
          className={`border-2 border-dashed rounded-lg p-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
            dragStates[field] 
              ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-400 ring-opacity-50' 
              : 'border-receipt-border hover:border-receipt-gray'
          }`}
        >
          <Upload className="w-6 h-6 text-receipt-gray flex-shrink-0" />
          <div className="text-left">
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
        </div>
      )}
    </div>
  );

  // Combine system and custom templates for dropdown
  const allTemplates = [
    { value: "לבן נקי", label: "לבן נקי", isSystem: true },
    { value: "צבעוני", label: "צבעוני", isSystem: true },
    { value: "מינימליסטי", label: "מינימליסטי", isSystem: true },
    ...customTemplates.map(t => ({ value: t.name, label: t.name, isSystem: false }))
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="pl-1 pr-6 py-6 space-y-8">
        {/* Template Selection */}
        <div>
          <Label className="text-base font-bold mb-3 block text-receipt-text">טמפלטים</Label>
          <Select 
            value={settings.template} 
            onValueChange={handleTemplateSelect}
            dir="rtl"
          >
            <SelectTrigger className="w-full border border-gray-200 hover:border-gray-300 focus:border-[#5EA30D] focus:ring-1 focus:ring-[#5EA30D]" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto" dir="rtl">
              <div className="p-1">
                {/* System Templates Category */}
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <FileText className="w-3 h-3" />
                    <span>טמפלטים קבועים</span>
                  </div>
                </div>
                
                <div className="pb-2">
                  <SelectItem 
                    value="לבן נקי" 
                    className={`hover:bg-gray-50 focus:bg-gray-50 cursor-pointer px-3 py-2 rounded-md text-sm mr-4 ${
                      settings.template === "לבן נקי" ? "bg-green-50 text-green-700 border-r-2 border-green-500" : "text-gray-700"
                    }`}
                  >
                    לבן נקי
                  </SelectItem>
                  <SelectItem 
                    value="צבעוני" 
                    className={`hover:bg-gray-50 focus:bg-gray-50 cursor-pointer px-3 py-2 rounded-md text-sm mr-4 ${
                      settings.template === "צבעוני" ? "bg-green-50 text-green-700 border-r-2 border-green-500" : "text-gray-700"
                    }`}
                  >
                    צבעוני
                  </SelectItem>
                  <SelectItem 
                    value="מינימליסטי" 
                    className={`hover:bg-gray-50 focus:bg-gray-50 cursor-pointer px-3 py-2 rounded-md text-sm mr-4 ${
                      settings.template === "מינימליסטי" ? "bg-green-50 text-green-700 border-r-2 border-green-500" : "text-gray-700"
                    }`}
                  >
                    מינימליסטי
                  </SelectItem>
                </div>

                {/* Custom Templates Category */}
                {customTemplates.length > 0 && (
                  <>
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <User className="w-3 h-3" />
                        <span>מותאם אישית</span>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      {customTemplates.map((template) => (
                        <div key={template.name} className="flex items-center justify-between hover:bg-gray-50 px-3 py-2 rounded-md group mr-4">
                          <SelectItem 
                            value={template.name}
                            className={`flex-1 p-0 hover:bg-transparent focus:bg-transparent cursor-pointer text-sm ${
                              settings.template === template.name ? "bg-green-50 text-green-700" : "text-gray-700"
                            }`}
                          >
                            {template.name}
                          </SelectItem>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteTemplate(template.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400 hover:text-red-500 transition-opacity ml-2"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>

        {/* Logo & Banners */}
        <div>
          <Label className="text-base font-bold mb-3 block text-receipt-text">לוגו ובאנרים</Label>
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
          <Label className="text-base font-bold mb-3 block text-receipt-text">גופן</Label>
          <Select value={settings.font} onValueChange={(value) => onSettingsChange({ font: value })} dir="rtl">
            <SelectTrigger className="w-full border border-gray-200 hover:border-gray-300 focus:border-[#5EA30D] focus:ring-1 focus:ring-[#5EA30D]" dir="rtl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="Assistant">Assistant</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Colors */}
        <div>
          <Label className="text-base font-bold mb-3 block text-receipt-text">צבעים</Label>
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