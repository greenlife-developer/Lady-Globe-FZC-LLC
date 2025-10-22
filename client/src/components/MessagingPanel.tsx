import { useState, useEffect } from "react";
import { X, Send, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllMessages,
  // ,
  sendMessage as sendNewMessage,
} from "@/redux/features/messages/messageSlice";
import { registerUser, getUsers } from "@/services/authService";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import { PlatformPermissions } from "@/models/UserPermissions";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  // avatar?: string;
}

interface MessagingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserType {
  _id?: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  permissions: PlatformPermissions;
  messaging: boolean; // Added messaging permission
  createdAt: string;
  lastActive: string;
}

const MessagingPanel = ({ isOpen, onClose }: MessagingPanelProps) => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  const [messageSent, setMessageSent] = useState<Boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const dispatch = useDispatch();
  const { messages } = useSelector((state: RootState) => state.messages);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const filteredMessages = selectedUser
    ? messages.filter(
        (msg: any) =>
          (msg.sender === currentUser._id && msg.recipient === selectedUser) ||
          (msg.sender === selectedUser && msg.recipient === currentUser._id)
      )
    : [];

  // Play notification sound when new message arrives
  // useEffect(() => {
  //   const audio = new Audio("/message-notification.mp3"); // You would need to add this audio file
  //   if (isOpen) {
  //     const unreadMessages = messages.filter(
  //       (msg) => !msg.read && msg.recipientId === currentUser.id
  //     );
  //     if (unreadMessages.length > 0) {
  //       // Mark messages as read
  //       setMessages(
  //         messages.map((msg) =>
  //           msg.recipientId === currentUser.id && !msg.read
  //             ? { ...msg, read: true }
  //             : msg
  //         )
  //       );
  //     }
  //   } else {
  //     const hasUnread = messages.some(
  //       (msg) => !msg.read && msg.recipientId === currentUser.id
  //     );
  //     if (hasUnread) {
  //       audio.play().catch((e) => console.log("Audio play failed:", e));
  //     }
  //   }
  // }, [isOpen, messages, currentUser._id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser && currentUser) {
      dispatch(
        getAllMessages({ userId: currentUser._id, recipientId: selectedUser })
      );
      setMessageSent(false); // reset trigger
    }
  }, [messageSent, selectedUser, currentUser, dispatch]);

  useEffect(() => {
    if (selectedUser && currentUser) {
      dispatch(
        getAllMessages({ userId: currentUser.id, recipientId: selectedUser })
      );
    }
  }, [messageSent, selectedUser, currentUser, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedUser && currentUser) {
        dispatch(
          getAllMessages({
            userId: currentUser._id,
            recipientId: selectedUser,
          })
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedUser, currentUser, dispatch]);

  const sendMessage = () => {
    if (!messageText.trim() || !selectedUser) return;

    dispatch(
      sendNewMessage({
        sender: currentUser._id,
        senderName: currentUser.name,
        recipient: selectedUser,
        content: messageText,
        timestamp: new Date().toISOString(),
        read: false,
      })
    );

    setMessageText("");
    setMessageSent(true);
    toast.success("Message sent");
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-80 bg-background shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-iraav-dark-blue" />
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-3 border-b">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger>
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users
                ?.filter((user: any) => user._id !== currentUser._id)
                ?.map((user: any) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUser ? (
          <>
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg: any) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.sender === currentUser._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === currentUser._id
                            ? "bg-iraav-dark-blue text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No messages yet</p>
                    <p className="text-sm">
                      Send a message to start the conversation
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <Input
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-iraav-dark-blue hover:bg-iraav-navy"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground p-4">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">Select a user</p>
              <p className="text-sm mt-1">Choose a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPanel;
