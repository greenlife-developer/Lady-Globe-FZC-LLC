"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var scroll_area_1 = require("@/components/ui/scroll-area");
var select_1 = require("@/components/ui/select");
var react_redux_1 = require("react-redux");
var messageSlice_1 = require("@/redux/features/messages/messageSlice");
var authService_1 = require("@/services/authService");
var sonner_1 = require("sonner");
var MessagingPanel = function (_a) {
    var _b;
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _c = (0, react_1.useState)(""), selectedUser = _c[0], setSelectedUser = _c[1];
    var _d = (0, react_1.useState)(""), messageText = _d[0], setMessageText = _d[1];
    var _e = (0, react_1.useState)(false), messageSent = _e[0], setMessageSent = _e[1];
    var _f = (0, react_1.useState)([]), users = _f[0], setUsers = _f[1];
    var dispatch = (0, react_redux_1.useDispatch)();
    var messages = (0, react_redux_1.useSelector)(function (state) { return state.messages; }).messages;
    var currentUser = (0, react_redux_1.useSelector)(function (state) { return state.auth.user; });
    var filteredMessages = selectedUser
        ? messages.filter(function (msg) {
            return (msg.sender === currentUser._id && msg.recipient === selectedUser) ||
                (msg.sender === selectedUser && msg.recipient === currentUser._id);
        })
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
    (0, react_1.useEffect)(function () {
        var fetchUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, authService_1.getUsers)()];
                    case 1:
                        response = _a.sent();
                        setUsers(response);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching users:", error_1);
                        sonner_1.toast.error("Failed to fetch users. Please try again.");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchUsers();
    }, []);
    (0, react_1.useEffect)(function () {
        if (selectedUser && currentUser) {
            dispatch((0, messageSlice_1.getAllMessages)({ userId: currentUser._id, recipientId: selectedUser }));
            setMessageSent(false); // reset trigger
        }
    }, [messageSent, selectedUser, currentUser, dispatch]);
    (0, react_1.useEffect)(function () {
        if (selectedUser && currentUser) {
            dispatch((0, messageSlice_1.getAllMessages)({ userId: currentUser.id, recipientId: selectedUser }));
        }
    }, [messageSent, selectedUser, currentUser, dispatch]);
    (0, react_1.useEffect)(function () {
        var interval = setInterval(function () {
            if (selectedUser && currentUser) {
                dispatch((0, messageSlice_1.getAllMessages)({
                    userId: currentUser._id,
                    recipientId: selectedUser,
                }));
            }
        }, 5000);
        return function () { return clearInterval(interval); };
    }, [selectedUser, currentUser, dispatch]);
    var sendMessage = function () {
        if (!messageText.trim() || !selectedUser)
            return;
        dispatch((0, messageSlice_1.sendMessage)({
            sender: currentUser._id,
            senderName: currentUser.name,
            recipient: selectedUser,
            content: messageText,
            timestamp: new Date().toISOString(),
            read: false,
        }));
        setMessageText("");
        setMessageSent(true);
        sonner_1.toast.success("Message sent");
    };
    return (<div className={"fixed inset-y-0 right-0 z-50 w-80 bg-background shadow-xl transform transition-transform duration-300 ease-in-out ".concat(isOpen ? "translate-x-0" : "translate-x-full")}>
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center">
            <lucide_react_1.MessageSquare className="h-5 w-5 mr-2 text-iraav-dark-blue"/>
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          <button_1.Button variant="ghost" size="icon" onClick={onClose}>
            <lucide_react_1.X className="h-5 w-5"/>
          </button_1.Button>
        </div>

        <div className="p-3 border-b">
          <select_1.Select value={selectedUser} onValueChange={setSelectedUser}>
            <select_1.SelectTrigger>
              <select_1.SelectValue placeholder="Select a user"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {(_b = users === null || users === void 0 ? void 0 : users.filter(function (user) { return user._id !== currentUser._id; })) === null || _b === void 0 ? void 0 : _b.map(function (user) { return (<select_1.SelectItem key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </select_1.SelectItem>); })}
            </select_1.SelectContent>
          </select_1.Select>
        </div>

        {selectedUser ? (<>
            <scroll_area_1.ScrollArea className="flex-1 p-3">
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (filteredMessages.map(function (msg) { return (<div key={msg._id} className={"flex ".concat(msg.sender === currentUser._id
                    ? "justify-end"
                    : "justify-start")}>
                      <div className={"max-w-[80%] p-3 rounded-lg ".concat(msg.sender === currentUser._id
                    ? "bg-iraav-dark-blue text-white"
                    : "bg-gray-100")}>
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                        </p>
                      </div>
                    </div>); })) : (<div className="text-center text-muted-foreground py-8">
                    <lucide_react_1.MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-20"/>
                    <p>No messages yet</p>
                    <p className="text-sm">
                      Send a message to start the conversation
                    </p>
                  </div>)}
              </div>
            </scroll_area_1.ScrollArea>

            <div className="p-3 border-t">
              <form className="flex items-center gap-2" onSubmit={function (e) {
                e.preventDefault();
                sendMessage();
            }}>
                <input_1.Input placeholder="Type your message..." value={messageText} onChange={function (e) { return setMessageText(e.target.value); }} className="flex-1"/>
                <button_1.Button type="submit" size="icon" className="bg-iraav-dark-blue hover:bg-iraav-navy">
                  <lucide_react_1.Send className="h-4 w-4"/>
                </button_1.Button>
              </form>
            </div>
          </>) : (<div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground p-4">
              <lucide_react_1.MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20"/>
              <p className="font-medium">Select a user</p>
              <p className="text-sm mt-1">Choose a user to start messaging</p>
            </div>
          </div>)}
      </div>
    </div>);
};
exports.default = MessagingPanel;
