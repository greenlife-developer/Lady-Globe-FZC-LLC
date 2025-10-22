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
var react_router_dom_1 = require("react-router-dom");
var utils_1 = require("@/lib/utils");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var react_redux_1 = require("react-redux");
var authService_1 = require("../services/authService");
var authSlice_1 = require("../redux/features/auth/authSlice");
var Sidebar = function (_a) {
    var collapsed = _a.collapsed;
    var location = (0, react_router_dom_1.useLocation)();
    var _b = (0, react_1.useState)("Trendyol"), activePlatform = _b[0], setActivePlatform = _b[1];
    var _c = (0, react_1.useState)({}), expandedItems = _c[0], setExpandedItems = _c[1];
    var dispatch = (0, react_redux_1.useDispatch)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        var handlePlatformChange = function (event) {
            var customEvent = event;
            setActivePlatform(customEvent.detail);
            setExpandedItems({});
        };
        window.addEventListener("platform-changed", handlePlatformChange);
        return function () {
            window.removeEventListener("platform-changed", handlePlatformChange);
        };
    }, []);
    var toggleSubmenu = function (title) {
        setExpandedItems(function (prev) {
            var _a;
            return (_a = {},
                _a[title] = !prev[title],
                _a);
        });
    };
    var handleLogOut = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, authService_1.logoutUser)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dispatch((0, authSlice_1.SET_LOGIN)(false))];
                case 2:
                    _a.sent();
                    navigate("/login");
                    return [2 /*return*/];
            }
        });
    }); };
    var trendyolItems = [
        {
            title: "Inventory",
            href: "/inventory",
            icon: lucide_react_1.Package,
            submenu: [
                { title: "Manage Inventory", href: "/inventory/manage" },
                // { title: "Inventory Planning", href: "/inventory/planning" },
                // { title: "Items", href: "/inventory/items" },
            ],
        }
    ];
    var renderItems = function (items) {
        return items.map(function (item) { return (<div key={item.title} className="mb-1">
        {item.submenu ? (<>
            <button onClick={function () { return toggleSubmenu(item.title); }} className={(0, utils_1.cn)("flex items-center w-full px-2 py-3 rounded-md transition-colors text-left", location.pathname === item.href ||
                    location.pathname.startsWith("".concat(item.href, "/"))
                    ? "bg-iraav-navy text-white"
                    : "text-white/70 hover:bg-iraav-navy hover:text-white")}>
              <item.icon className="h-5 w-5 mr-3"/>
              {!collapsed && (<>
                  <span className="flex-1">{item.title}</span>
                  {expandedItems[item.title] ? (<lucide_react_1.ChevronDown className="h-4 w-4"/>) : (<lucide_react_1.ChevronRight className="h-4 w-4"/>)}
                </>)}
            </button>

            {!collapsed && expandedItems[item.title] && (<div className="ml-7 mt-1 space-y-1 border-l-2 border-iraav-navy/40 pl-2">
                {item.submenu.map(function (subItem) { return (<react_router_dom_1.Link key={subItem.title} to={subItem.href} className={(0, utils_1.cn)("flex items-center px-2 py-2 text-sm rounded-md transition-colors", location.pathname === subItem.href
                            ? "bg-iraav-navy/70 text-white"
                            : "text-white/70 hover:bg-iraav-navy/40 hover:text-white")}>
                    <span>{subItem.title}</span>
                  </react_router_dom_1.Link>); })}
              </div>)}
          </>) : (<react_router_dom_1.Link to={item.href} className={(0, utils_1.cn)("flex items-center px-2 py-3 rounded-md transition-colors", item.href === location.pathname
                    ? "bg-iraav-navy text-white"
                    : "text-white/70 hover:bg-iraav-navy hover:text-white")}>
            <item.icon className="h-5 w-5 mr-3"/>
            {!collapsed && <span>{item.title}</span>}
          </react_router_dom_1.Link>)}
      </div>); });
    };
    return (<div className={(0, utils_1.cn)("bg-iraav-dark-blue text-white h-full flex flex-col transition-all duration-300 ease-in-out", collapsed ? "w-16" : "w-64")}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 mt-4">
          {!collapsed && (<div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-tight">
                {activePlatform}
              </h2>
              {/* <p className="text-sm text-muted_override">Navigation Panel</p> */}
            </div>)}
        </div>

        <nav className="space-y-1 px-2">
          {activePlatform === "Trendyol" && renderItems(trendyolItems)}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span onClick={handleLogOut} className={(0, utils_1.cn)("flex items-center px-2 py-3 rounded-md transition-colors text-white/70 hover:bg-iraav-navy hover:text-white")}>
            <lucide_react_1.LogIn className={(0, utils_1.cn)("h-5 w-5", collapsed ? "mx-auto" : "mr-3")}/>
            {!collapsed && <span>Logout</span>}
          </span>

          <react_router_dom_1.Link to="/settings" className={(0, utils_1.cn)("flex items-center px-2 py-3 rounded-md transition-colors text-white/70 hover:bg-iraav-navy hover:text-white")}>
            <lucide_react_1.FlipHorizontal className="h-5 w-5"/>
          </react_router_dom_1.Link>
        </div>
      </div>
    </div>);
};
exports.default = Sidebar;
