
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MessagingPanel from "./MessagingPanel";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  read: boolean;
}

const MessageNotification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Mock current user ID - in real app this would come from authentication
  const currentUserId = "1";
  
  // Mock fetch unread messages count
  useEffect(() => {
    // For demo purposes, we'll just set a static unread count
    // In a real app, this would be fetched from an API
    const mockMessages: Message[] = [
      { id: "1", senderId: "2", recipientId: "1", read: false },
      { id: "2", senderId: "3", recipientId: "1", read: false },
    ];
    
    const count = mockMessages.filter(
      msg => msg.recipientId === currentUserId && !msg.read
    ).length;
    
    setUnreadCount(count);
    
    // Simulate receiving a new message after 10 seconds
    const timeout = setTimeout(() => {
      setUnreadCount(prev => prev + 1);
      
      // Play notification sound
      if (!isOpen) {
        const audio = new Audio('/message-notification.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [isOpen]);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark messages as read when opening panel
      setUnreadCount(0);
    }
  };
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        className="relative"
        onClick={togglePanel}
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500"
            variant="destructive"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
      <MessagingPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MessageNotification;
