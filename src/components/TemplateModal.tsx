import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateName: string) => void;
}

export default function TemplateModal({ isOpen, onClose, onSave }: TemplateModalProps) {
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (!templateName.trim()) return;
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(templateName.trim());
    setIsSaving(false);
    setIsSaved(true);
    
    // Auto close after showing success
    setTimeout(() => {
      setIsSaved(false);
      setTemplateName("");
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setTemplateName("");
    setIsSaved(false);
    setIsSaving(false);
    onClose();
  };

  if (isSaved) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">התבנית נשמרה בהצלחה!</h3>
            <p className="text-sm text-gray-600 text-center">
              התבנית "{templateName}" נוספה לרשימת התבניות שלך
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">יצירת תבנית חדשה</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div>
            <p className="text-sm text-gray-600 mb-3 text-center">
              בחר שם לתבנית החדשה שלך ושמור לשימוש חוזר
            </p>
            
            <Input
              placeholder="הזן שם לתבנית שלך"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && templateName.trim() && handleSave()}
              className="w-full focus:border-[#5EA30D] focus:ring-[#5EA30D]"
              autoFocus
            />
          </div>
          
          <Button
            onClick={handleSave}
            disabled={!templateName.trim() || isSaving}
            className="w-full text-white"
            style={{ backgroundColor: '#5EA30D' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a8a0b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5EA30D'}
          >
            {isSaving ? "שומר..." : "שמור"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}