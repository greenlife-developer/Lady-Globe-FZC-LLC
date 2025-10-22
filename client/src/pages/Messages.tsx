
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, User, UserCheck, Users, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: string;
  senderName: string;
  recipient: string;
  content: string;
  timestamp: Date;
  read: boolean;
  hasAttachment?: boolean;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
  lastMessage?: string;
  unread: number;
}

const Messages = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "user2",
      senderName: "Amazon Manager",
      recipient: "user1",
      content: "Hi, I need help with setting up a new product listing.",
      timestamp: new Date(2023, 4, 19, 9, 30),
      read: true
    },
    {
      id: "2",
      sender: "user1",
      senderName: "Admin User",
      recipient: "user2",
      content: "Sure, what product are you trying to list?",
      timestamp: new Date(2023, 4, 19, 9, 32),
      read: true
    },
    {
      id: "3",
      sender: "user2",
      senderName: "Amazon Manager",
      recipient: "user1",
      content: "It's a new electronics item. I'm not sure about the categories.",
      timestamp: new Date(2023, 4, 19, 9, 35),
      read: true
    },
    {
      id: "4",
      sender: "user3",
      senderName: "Office Staff",
      recipient: "user1",
      content: "Hello, can you check the stock report I sent yesterday?",
      timestamp: new Date(2023, 4, 19, 14, 15),
      read: false
    }
  ]);
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "user2",
      name: "Amazon Manager",
      role: "Manager",
      online: true,
      lastMessage: "It's a new electronics item. I'm not sure about the categories.",
      unread: 0
    },
    {
      id: "user3",
      name: "Office Staff",
      role: "Staff",
      online: false,
      lastMessage: "Hello, can you check the stock report I sent yesterday?",
      unread: 1
    },
    {
      id: "user4",
      name: "Flipkart Manager",
      role: "Manager",
      online: true,
      lastMessage: "",
      unread: 0
    }
  ]);
  
  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      sender: "user1", // current user
      senderName: "Admin User",
      recipient: activeChat,
      content: message,
      timestamp: new Date(),
      read: false
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Also update the contacts last message
    const updatedContacts = contacts.map(contact => {
      if (contact.id === activeChat) {
        return {
          ...contact,
          lastMessage: message
        };
      }
      return contact;
    });
    
    setContacts(updatedContacts);
    toast.success("Message sent");
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In a real app, this would upload the file
      toast.success(`File "${file.name}" attached. Ready to send.`);
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Filter messages for the active chat
  const activeMessages = messages.filter(
    msg => (msg.sender === activeChat && msg.recipient === "user1") || 
           (msg.sender === "user1" && msg.recipient === activeChat)
  ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // Get the active contact name
  const activeContactName = contacts.find(c => c.id === activeChat)?.name || "";
  
  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <Card className="w-80 border-r">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </CardTitle>
          <CardDescription>Communicate with your team</CardDescription>
        </CardHeader>
        <Tabs defaultValue="all">
          <div className="px-4">
            <TabsList className="w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-2">
                {contacts.map(contact => (
                  <div
                    key={contact.id}
                    className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
                      activeChat === contact.id ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setActiveChat(contact.id);
                      // Mark messages as read
                      if (contact.unread > 0) {
                        const updatedContacts = contacts.map(c => 
                          c.id === contact.id ? {...c, unread: 0} : c
                        );
                        setContacts(updatedContacts);
                      }
                    }}
                  >
                    <Avatar>
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{contact.name}</h4>
                        {contact.unread > 0 && (
                          <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {contact.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 ml-2">
                      {contact.online && <div className="w-2 h-2 rounded-full bg-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-2">
                {contacts.filter(c => c.unread > 0).map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setActiveChat(contact.id)}
                  >
                    <Avatar>
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{contact.name}</h4>
                        <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                          {contact.unread}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {contact.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="groups" className="m-0">
            <div className="p-4 text-center text-muted-foreground">
              No group chats available
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      <Card className="flex-1 ml-0 rounded-l-none">
        {!activeChat ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-muted-foreground max-w-sm">
              Select a conversation from the list to start messaging or create a new conversation.
            </p>
            <Button className="mt-4 bg-iraav-dark-blue hover:bg-iraav-navy">
              <UserCheck className="mr-2 h-4 w-4" /> New Message
            </Button>
          </div>
        ) : (
          <>
            <CardHeader className="border-b flex-row items-center justify-between p-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-2">
                  <AvatarFallback>{activeContactName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{activeContactName}</CardTitle>
                  <CardDescription className="text-xs">
                    {contacts.find(c => c.id === activeChat)?.online 
                      ? "Online" 
                      : "Offline"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activeMessages.map((msg) => {
                    const isSelf = msg.sender === "user1";
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isSelf ? "justify-end" : ""}`}
                      >
                        <div
                          className={`rounded-lg p-3 max-w-[80%] ${
                            isSelf 
                              ? "bg-iraav-dark-blue text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isSelf ? "text-blue-100" : "text-gray-500"}`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </ScrollArea>
            
            <CardFooter className="border-t p-3">
              <div className="flex w-full items-center space-x-2">
                <Button variant="outline" size="icon" className="shrink-0" asChild>
                  <label>
                    <Paperclip className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  className="bg-iraav-dark-blue hover:bg-iraav-navy shrink-0"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default Messages;
