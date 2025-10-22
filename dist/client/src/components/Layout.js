"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Navbar_1 = require("./Navbar");
var Sidebar_1 = require("./Sidebar");
var Layout = function () {
    var _a = (0, react_1.useState)(false), sidebarCollapsed = _a[0], setSidebarCollapsed = _a[1];
    var _b = (0, react_1.useState)("Amazon"), activePlatform = _b[0], setActivePlatform = _b[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        var handlePlatformChange = function (event) {
            var customEvent = event;
            setActivePlatform(customEvent.detail);
        };
        window.addEventListener('platform-changed', handlePlatformChange);
        return function () {
            window.removeEventListener('platform-changed', handlePlatformChange);
        };
    }, [navigate]);
    var toggleSidebar = function () {
        setSidebarCollapsed(!sidebarCollapsed);
    };
    return (<div className="flex h-screen w-full overflow-hidden bg-iraav-bg-light">
      <Sidebar_1.default collapsed={sidebarCollapsed}/>
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar_1.default toggleSidebar={toggleSidebar}/>
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6">
          <div className="mx-auto animate-fade-in w-full max-w-[1600px]">
            <react_router_dom_1.Outlet />
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 py-2 text-center text-xs text-gray-500">
          IRAAV Amazon Solution - Integrated Amazon Seller API Services
        </footer>
      </div>
    </div>);
};
exports.default = Layout;
