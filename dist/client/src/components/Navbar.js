"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var MessageNotification_1 = require("./MessageNotification");
var select_1 = require("@/components/ui/select");
var react_router_dom_1 = require("react-router-dom");
var EnhancedNavbar = function (_a) {
    var toggleSidebar = _a.toggleSidebar;
    var _b = (0, react_1.useState)("Amazon"), activePlatform = _b[0], setActivePlatform = _b[1];
    var _c = (0, react_1.useState)(null), userPermissions = _c[0], setUserPermissions = _c[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var handlePlatformChange = function (value) {
        setActivePlatform(value);
        console.log("Platform switched to: ".concat(value));
        var event = new CustomEvent('platform-changed', { detail: value });
        window.dispatchEvent(event);
        if (value === "Trendyol") {
            navigate("/dashboard");
        }
    };
    return (<header className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <button_1.Button variant="ghost" className="h-9 w-9 p-0" onClick={toggleSidebar}>
          <lucide_react_1.Menu className="h-5 w-5"/>
          <span className="sr-only">Toggle Menu</span>
        </button_1.Button>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center space-x-4">
          <select_1.Select value={activePlatform} onValueChange={handlePlatformChange}>
            <select_1.SelectTrigger className="w-[180px]">
              <select_1.SelectValue placeholder="Select platform"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectGroup>
                <select_1.SelectLabel>Platforms</select_1.SelectLabel>
                <select_1.SelectItem value="Trendyol">Trendyol</select_1.SelectItem>
              </select_1.SelectGroup>
            </select_1.SelectContent>
          </select_1.Select>
          
          <MessageNotification_1.default />
        </div>
      </div>
    </header>);
};
exports.default = EnhancedNavbar;
