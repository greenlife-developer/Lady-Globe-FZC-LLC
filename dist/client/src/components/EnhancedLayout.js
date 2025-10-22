"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("./Sidebar");
var Navbar_1 = require("./Navbar");
var useRedirectLoggedOutUser_1 = require("@/hooks/useRedirectLoggedOutUser");
var EnhancedLayout = function () {
    var location = (0, react_router_dom_1.useLocation)();
    (0, useRedirectLoggedOutUser_1.default)("/login?redirect_url=".concat(location.pathname));
    var _a = (0, react_1.useState)(false), sidebarCollapsed = _a[0], setSidebarCollapsed = _a[1];
    var toggleSidebar = function () {
        setSidebarCollapsed(!sidebarCollapsed);
    };
    return (<div className="flex h-screen overflow-hidden">
      <Sidebar_1.default collapsed={sidebarCollapsed}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar_1.default toggleSidebar={toggleSidebar}/>
        <main className="flex-1 overflow-auto p-4">
          <react_router_dom_1.Outlet />
        </main>
      </div>
    </div>);
};
exports.default = EnhancedLayout;
