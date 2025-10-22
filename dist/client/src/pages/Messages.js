"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var tabs_1 = require("@/components/ui/tabs");
var avatar_1 = require("@/components/ui/avatar");
var scroll_area_1 = require("@/components/ui/scroll-area");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var Messages = function () {
    var _a, _b;
    var _c = (0, react_1.useState)(null), activeChat = _c[0], setActiveChat = _c[1];
    var _d = (0, react_1.useState)(""), message = _d[0], setMessage = _d[1];
    var _e = (0, react_1.useState)([
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
    ]), messages = _e[0], setMessages = _e[1];
    var _f = (0, react_1.useState)([
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
    ]), contacts = _f[0], setContacts = _f[1];
    var handleSendMessage = function () {
        if (!message.trim() || !activeChat)
            return;
        var newMessage = {
            id: Math.random().toString(36).substring(7),
            sender: "user1", // current user
            senderName: "Admin User",
            recipient: activeChat,
            content: message,
            timestamp: new Date(),
            read: false
        };
        setMessages(__spreadArray(__spreadArray([], messages, true), [newMessage], false));
        setMessage("");
        // Also update the contacts last message
        var updatedContacts = contacts.map(function (contact) {
            if (contact.id === activeChat) {
                return __assign(__assign({}, contact), { lastMessage: message });
            }
            return contact;
        });
        setContacts(updatedContacts);
        sonner_1.toast.success("Message sent");
    };
    var handleFileUpload = function (e) {
        if (e.target.files && e.target.files[0]) {
            var file = e.target.files[0];
            // In a real app, this would upload the file
            sonner_1.toast.success("File \"".concat(file.name, "\" attached. Ready to send."));
        }
    };
    var formatTime = function (date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    // Filter messages for the active chat
    var activeMessages = messages.filter(function (msg) { return (msg.sender === activeChat && msg.recipient === "user1") ||
        (msg.sender === "user1" && msg.recipient === activeChat); }).sort(function (a, b) { return a.timestamp.getTime() - b.timestamp.getTime(); });
    // Get the active contact name
    var activeContactName = ((_a = contacts.find(function (c) { return c.id === activeChat; })) === null || _a === void 0 ? void 0 : _a.name) || "";
    return (<div className="flex h-[calc(100vh-8rem)]">
      <card_1.Card className="w-80 border-r">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center">
            <lucide_react_1.MessageSquare className="mr-2 h-5 w-5"/>
            Messages
          </card_1.CardTitle>
          <card_1.CardDescription>Communicate with your team</card_1.CardDescription>
        </card_1.CardHeader>
        <tabs_1.Tabs defaultValue="all">
          <div className="px-4">
            <tabs_1.TabsList className="w-full">
              <tabs_1.TabsTrigger value="all">All</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="unread">Unread</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="groups">Groups</tabs_1.TabsTrigger>
            </tabs_1.TabsList>
          </div>
          
          <tabs_1.TabsContent value="all" className="m-0">
            <scroll_area_1.ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-2">
                {contacts.map(function (contact) { return (<div key={contact.id} className={"flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ".concat(activeChat === contact.id ? "bg-gray-100" : "")} onClick={function () {
                setActiveChat(contact.id);
                // Mark messages as read
                if (contact.unread > 0) {
                    var updatedContacts = contacts.map(function (c) {
                        return c.id === contact.id ? __assign(__assign({}, c), { unread: 0 }) : c;
                    });
                    setContacts(updatedContacts);
                }
            }}>
                    <avatar_1.Avatar>
                      <avatar_1.AvatarFallback>{contact.name.charAt(0)}</avatar_1.AvatarFallback>
                    </avatar_1.Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{contact.name}</h4>
                        {contact.unread > 0 && (<span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                            {contact.unread}
                          </span>)}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {contact.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 ml-2">
                      {contact.online && <div className="w-2 h-2 rounded-full bg-green-500"/>}
                    </div>
                  </div>); })}
              </div>
            </scroll_area_1.ScrollArea>
          </tabs_1.TabsContent>
          
          <tabs_1.TabsContent value="unread" className="m-0">
            <scroll_area_1.ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="p-4 space-y-2">
                {contacts.filter(function (c) { return c.unread > 0; }).map(function (contact) { return (<div key={contact.id} className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors" onClick={function () { return setActiveChat(contact.id); }}>
                    <avatar_1.Avatar>
                      <avatar_1.AvatarFallback>{contact.name.charAt(0)}</avatar_1.AvatarFallback>
                    </avatar_1.Avatar>
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
                  </div>); })}
              </div>
            </scroll_area_1.ScrollArea>
          </tabs_1.TabsContent>
          
          <tabs_1.TabsContent value="groups" className="m-0">
            <div className="p-4 text-center text-muted-foreground">
              No group chats available
            </div>
          </tabs_1.TabsContent>
        </tabs_1.Tabs>
      </card_1.Card>
      
      <card_1.Card className="flex-1 ml-0 rounded-l-none">
        {!activeChat ? (<div className="h-full flex flex-col items-center justify-center text-center p-8">
            <lucide_react_1.Users className="h-12 w-12 text-muted-foreground mb-4"/>
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-muted-foreground max-w-sm">
              Select a conversation from the list to start messaging or create a new conversation.
            </p>
            <button_1.Button className="mt-4 bg-iraav-dark-blue hover:bg-iraav-navy">
              <lucide_react_1.UserCheck className="mr-2 h-4 w-4"/> New Message
            </button_1.Button>
          </div>) : (<>
            <card_1.CardHeader className="border-b flex-row items-center justify-between p-4">
              <div className="flex items-center">
                <avatar_1.Avatar className="h-9 w-9 mr-2">
                  <avatar_1.AvatarFallback>{activeContactName.charAt(0)}</avatar_1.AvatarFallback>
                </avatar_1.Avatar>
                <div>
                  <card_1.CardTitle className="text-lg">{activeContactName}</card_1.CardTitle>
                  <card_1.CardDescription className="text-xs">
                    {((_b = contacts.find(function (c) { return c.id === activeChat; })) === null || _b === void 0 ? void 0 : _b.online)
                ? "Online"
                : "Offline"}
                  </card_1.CardDescription>
                </div>
              </div>
            </card_1.CardHeader>
            
            <scroll_area_1.ScrollArea className="h-[calc(100vh-16rem)]">
              <card_1.CardContent className="p-6">
                <div className="space-y-4">
                  {activeMessages.map(function (msg) {
                var isSelf = msg.sender === "user1";
                return (<div key={msg.id} className={"flex ".concat(isSelf ? "justify-end" : "")}>
                        <div className={"rounded-lg p-3 max-w-[80%] ".concat(isSelf
                        ? "bg-iraav-dark-blue text-white"
                        : "bg-gray-100 text-gray-800")}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={"text-xs mt-1 ".concat(isSelf ? "text-blue-100" : "text-gray-500")}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>);
            })}
                </div>
              </card_1.CardContent>
            </scroll_area_1.ScrollArea>
            
            <card_1.CardFooter className="border-t p-3">
              <div className="flex w-full items-center space-x-2">
                <button_1.Button variant="outline" size="icon" className="shrink-0" asChild>
                  <label>
                    <lucide_react_1.Paperclip className="h-4 w-4"/>
                    <input type="file" className="hidden" onChange={handleFileUpload}/>
                  </label>
                </button_1.Button>
                <input_1.Input placeholder="Type a message..." value={message} onChange={function (e) { return setMessage(e.target.value); }} onKeyDown={function (e) {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            }}/>
                <button_1.Button size="sm" className="bg-iraav-dark-blue hover:bg-iraav-navy shrink-0" onClick={handleSendMessage} disabled={!message.trim()}>
                  <lucide_react_1.Send className="h-4 w-4"/>
                </button_1.Button>
              </div>
            </card_1.CardFooter>
          </>)}
      </card_1.Card>
    </div>);
};
exports.default = Messages;
