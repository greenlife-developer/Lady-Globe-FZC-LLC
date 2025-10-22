import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import MessageNotification from "./MessageNotification";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectGroup, 
  SelectLabel, 
  SelectItem 
} from "@/components/ui/select";
import { UserPermission } from "@/models/UserPermissions";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  toggleSidebar: () => void;
}

const EnhancedNavbar = ({ toggleSidebar }: NavbarProps) => {
  const [activePlatform, setActivePlatform] = useState("Amazon");
  const [userPermissions, setUserPermissions] = useState<UserPermission | null>(null);
  const navigate = useNavigate();

  const handlePlatformChange = (value: string) => {
    setActivePlatform(value);
    console.log(`Platform switched to: ${value}`);
    
    const event = new CustomEvent('platform-changed', { detail: value });
    window.dispatchEvent(event);

    if (value === "Trendyol") {
      navigate("/dashboard");
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <Button
          variant="ghost"
          className="h-9 w-9 p-0"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-4">
          <Select value={activePlatform} onValueChange={handlePlatformChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Platforms</SelectLabel>
                <SelectItem value="Trendyol">Trendyol</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <MessageNotification />
        </div>
      </div>
    </header>
  );
};

export default EnhancedNavbar;
