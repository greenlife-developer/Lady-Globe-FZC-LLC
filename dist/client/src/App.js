"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toaster_1 = require("@/components/ui/toaster");
var sonner_1 = require("@/components/ui/sonner");
var tooltip_1 = require("@/components/ui/tooltip");
var react_query_1 = require("@tanstack/react-query");
var react_router_dom_1 = require("react-router-dom");
// Pages
var Index_1 = require("./pages/Index");
var Login_1 = require("./pages/Login");
var Inventory_1 = require("./pages/Inventory");
// import Returns from "./pages/Returns";
var Settings_1 = require("./pages/Settings");
var NotFound_1 = require("./pages/NotFound");
var UserManagement_1 = require("./pages/UserManagement");
var Messages_1 = require("./pages/Messages");
// Components
var EnhancedLayout_1 = require("./components/EnhancedLayout");
var Register_1 = require("./pages/Register");
var queryClient = new react_query_1.QueryClient();
var App = function () { return (<react_query_1.QueryClientProvider client={queryClient}>
    <tooltip_1.TooltipProvider>
      <toaster_1.Toaster />
      <sonner_1.Toaster />
      <react_router_dom_1.BrowserRouter>
        <react_router_dom_1.Routes>
          <react_router_dom_1.Route path="/" element={<Index_1.default />}/>
          <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
          <react_router_dom_1.Route path="/register" element={<Register_1.default />}/>
          <react_router_dom_1.Route path="/messages" element={<Messages_1.default />}/>
          
          {/* Protected Routes with Enhanced Layout */}
          <react_router_dom_1.Route element={<EnhancedLayout_1.default />}>
            <react_router_dom_1.Route path="/dashboard" element={<Inventory_1.default />}/>
            
            {/* Amazon Routes */}
            <react_router_dom_1.Route path="/catalogue" element={<NotFound_1.default />}/>
            <react_router_dom_1.Route path="/catalogue/add-product" element={<NotFound_1.default />}/>
            <react_router_dom_1.Route path="/catalogue/listing-quality" element={<NotFound_1.default />}/>
            <react_router_dom_1.Route path="/inventory" element={<Inventory_1.default />}/>
            <react_router_dom_1.Route path="/inventory/manage" element={<Inventory_1.default />}/>
            <react_router_dom_1.Route path="/inventory/planning" element={<NotFound_1.default />}/>
            <react_router_dom_1.Route path="/advertising" element={<NotFound_1.default />}/>
            <react_router_dom_1.Route path="/advertising/campaigns" element={<NotFound_1.default />}/>
            <react_router_dom_1.Route path="/advertising/content" element={<NotFound_1.default />}/>
            
            {/* Settings and Admin Routes */}
            <react_router_dom_1.Route path="/settings" element={<Settings_1.default />}/>
            <react_router_dom_1.Route path="/settings/users" element={<UserManagement_1.default />}/>
            <react_router_dom_1.Route path="/settings/messages" element={<Messages_1.default />}/>
          </react_router_dom_1.Route>
          
          {/* Catch all */}
          <react_router_dom_1.Route path="*" element={<NotFound_1.default />}/>
        </react_router_dom_1.Routes>
      </react_router_dom_1.BrowserRouter>
    </tooltip_1.TooltipProvider>
  </react_query_1.QueryClientProvider>); };
exports.default = App;
