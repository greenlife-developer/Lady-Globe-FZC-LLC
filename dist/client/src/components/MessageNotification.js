"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var MessagingPanel_1 = require("./MessagingPanel");
var MessageNotification = function () {
    var _a = (0, react_1.useState)(false), isOpen = _a[0], setIsOpen = _a[1];
    var _b = (0, react_1.useState)(0), unreadCount = _b[0], setUnreadCount = _b[1];
    // Mock current user ID - in real app this would come from authentication
    var currentUserId = "1";
    // Mock fetch unread messages count
    (0, react_1.useEffect)(function () {
        // For demo purposes, we'll just set a static unread count
        // In a real app, this would be fetched from an API
        var mockMessages = [
            { id: "1", senderId: "2", recipientId: "1", read: false },
            { id: "2", senderId: "3", recipientId: "1", read: false },
        ];
        var count = mockMessages.filter(function (msg) { return msg.recipientId === currentUserId && !msg.read; }).length;
        setUnreadCount(count);
        // Simulate receiving a new message after 10 seconds
        var timeout = setTimeout(function () {
            setUnreadCount(function (prev) { return prev + 1; });
            // Play notification sound
            if (!isOpen) {
                var audio = new Audio('/message-notification.mp3');
                audio.play().catch(function (e) { return console.log('Audio play failed:', e); });
            }
        }, 10000);
        return function () { return clearTimeout(timeout); };
    }, [isOpen]);
    var togglePanel = function () {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Mark messages as read when opening panel
            setUnreadCount(0);
        }
    };
    return (<>
      <button_1.Button variant="ghost" size="icon" className="relative" onClick={togglePanel}>
        <lucide_react_1.MessageSquare className="h-5 w-5"/>
        {unreadCount > 0 && (<badge_1.Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500" variant="destructive">
            {unreadCount}
          </badge_1.Badge>)}
      </button_1.Button>
      <MessagingPanel_1.default isOpen={isOpen} onClose={function () { return setIsOpen(false); }}/>
    </>);
};
exports.default = MessageNotification;
