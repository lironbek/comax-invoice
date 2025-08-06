import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface AppHeaderProps {
  onReset: () => void;
}

export default function AppHeader({ onReset }: AppHeaderProps) {
  return (
    <header className="app-header py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            איפוס הכל
          </Button>
          
          <Button variant="outline" size="sm" className="bg-white text-primary hover:bg-white/90">
            שמור עיצוב
          </Button>
        </div>
      </div>
    </header>
  );
}