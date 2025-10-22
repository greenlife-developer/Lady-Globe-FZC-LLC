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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var switch_1 = require("@/components/ui/switch");
var UserPermissions_1 = require("@/models/UserPermissions");
var tabs_1 = require("@/components/ui/tabs");
var card_1 = require("@/components/ui/card");
var UserForm = function (_a) {
    var user = _a.user, onSubmit = _a.onSubmit, onCancel = _a.onCancel, isEditing = _a.isEditing;
    var _b = (0, react_1.useState)({
        _id: user._id || crypto.randomUUID(),
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        role: user.role || "Staff", // Default to Staff
        permissions: user.permissions || __assign({}, UserPermissions_1.defaultPermissions),
        createdAt: user.createdAt || new Date().toISOString().split('T')[0]
    }), userData = _b[0], setUserData = _b[1];
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setUserData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleRoleChange = function (e) {
        setUserData(function (prev) { return (__assign(__assign({}, prev), { role: e.target.value })); });
    };
    var handlePermissionChange = function (permission) {
        setUserData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), { permissions: __assign(__assign({}, prev.permissions), (_a = {}, _a[permission] = !prev.permissions[permission], _a)) }));
        });
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        // Remove email from submitted data if it's empty, as the field is gone
        var dataToSubmit = __assign({}, userData);
        if (!dataToSubmit.email) {
            delete dataToSubmit.email;
        }
        onSubmit(dataToSubmit);
    };
    return (<form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-100px)] overflow-y-auto pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label_1.Label htmlFor="name">Username</label_1.Label>
          <input_1.Input id="name" name="name" value={userData.name} onChange={handleInputChange} required/>
        </div>
        
        {/* Email field removed */}
        <div className="space-y-2">
          <label_1.Label htmlFor="email">Email</label_1.Label>
          <input_1.Input id="email" name="email" type="email" value={userData.email || ""} // Handle potentially undefined email
     onChange={handleInputChange}/>
        </div>
       
        
        <div className="space-y-2">
          <label_1.Label htmlFor="password">Password</label_1.Label>
          <input_1.Input id="password" name="password" type="password" value={(userData.password.length < 12 ? userData.password : "")} onChange={handleInputChange} required={!isEditing} placeholder={isEditing ? "Leave blank to keep current password" : ""}/>
        </div>
        
        <div className="space-y-2">
          <label_1.Label htmlFor="role">Role</label_1.Label>
          <select id="role" name="role" value={userData.role} onChange={handleRoleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Accountant">Accountant</option>
            <option value="Reviewer">Reviewer</option>
          </select>
        </div>
      </div>

      <tabs_1.Tabs defaultValue="platform">
        <tabs_1.TabsList className="grid grid-cols-4 w-full">
          <tabs_1.TabsTrigger value="platform">Platform Access</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="office">Office Permissions</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="amazon">Amazon Permissions</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="other">Other Permissions</tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        
        <tabs_1.TabsContent value="platform">
          <card_1.Card>
            <card_1.CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="officePlatform">Office Platform</label_1.Label>
                  <switch_1.Switch id="officePlatform" checked={userData.permissions.officePlatform} onCheckedChange={function () { return handlePermissionChange("officePlatform"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="amazonPlatform">Amazon Platform</label_1.Label>
                  <switch_1.Switch id="amazonPlatform" checked={userData.permissions.amazonPlatform} onCheckedChange={function () { return handlePermissionChange("amazonPlatform"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="meeshoPlatform">Meesho Platform</label_1.Label>
                  <switch_1.Switch id="meeshoPlatform" checked={userData.permissions.meeshoPlatform} onCheckedChange={function () { return handlePermissionChange("meeshoPlatform"); }}/>
                </div>
                
                {/* Flipkart Platform removed
        <div className="flex items-center justify-between">
          <Label htmlFor="flipkartPlatform">Flipkart Platform</Label>
          <Switch
            id="flipkartPlatform"
            checked={userData.permissions.flipkartPlatform}
            onCheckedChange={() => handlePermissionChange("flipkartPlatform")}
          />
        </div>
        */}
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="websitePlatform">Website Platform</label_1.Label>
                  <switch_1.Switch id="websitePlatform" checked={userData.permissions.websitePlatform} onCheckedChange={function () { return handlePermissionChange("websitePlatform"); }}/>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        {/* ... keep existing code (Office, Amazon, Other permission tabs) */}
        <tabs_1.TabsContent value="office">
          <card_1.Card>
            <card_1.CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="dashboard">Dashboard</label_1.Label>
                  <switch_1.Switch id="dashboard" checked={userData.permissions.dashboard} onCheckedChange={function () { return handlePermissionChange("dashboard"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="categories">Categories</label_1.Label>
                  <switch_1.Switch id="categories" checked={userData.permissions.categories} onCheckedChange={function () { return handlePermissionChange("categories"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="products">Products</label_1.Label>
                  <switch_1.Switch id="products" checked={userData.permissions.products} onCheckedChange={function () { return handlePermissionChange("products"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="stocks">Stocks</label_1.Label>
                  <switch_1.Switch id="stocks" checked={userData.permissions.stocks} onCheckedChange={function () { return handlePermissionChange("stocks"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="customers">Customers</label_1.Label>
                  <switch_1.Switch id="customers" checked={userData.permissions.customers} onCheckedChange={function () { return handlePermissionChange("customers"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="vendors">Vendors</label_1.Label>
                  <switch_1.Switch id="vendors" checked={userData.permissions.vendors} onCheckedChange={function () { return handlePermissionChange("vendors"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="salesInvoice">Sales Invoice</label_1.Label>
                  <switch_1.Switch id="salesInvoice" checked={userData.permissions.salesInvoice} onCheckedChange={function () { return handlePermissionChange("salesInvoice"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="purchaseInvoice">Purchase Invoice</label_1.Label>
                  <switch_1.Switch id="purchaseInvoice" checked={userData.permissions.purchaseInvoice} onCheckedChange={function () { return handlePermissionChange("purchaseInvoice"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="creditDebitNote">Credit/Debit Note</label_1.Label>
                  <switch_1.Switch id="creditDebitNote" checked={userData.permissions.creditDebitNote} onCheckedChange={function () { return handlePermissionChange("creditDebitNote"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="expenses">Expenses</label_1.Label>
                  <switch_1.Switch id="expenses" checked={userData.permissions.expenses} onCheckedChange={function () { return handlePermissionChange("expenses"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="reports">Reports</label_1.Label>
                  <switch_1.Switch id="reports" checked={userData.permissions.reports} onCheckedChange={function () { return handlePermissionChange("reports"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="settings">Settings</label_1.Label>
                  <switch_1.Switch id="settings" checked={userData.permissions.settings} onCheckedChange={function () { return handlePermissionChange("settings"); }}/>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="amazon">
          <card_1.Card>
            <card_1.CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="amazonDashboard">Dashboard</label_1.Label>
                  <switch_1.Switch id="amazonDashboard" checked={userData.permissions.amazonDashboard} onCheckedChange={function () { return handlePermissionChange("amazonDashboard"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="orders">Orders</label_1.Label>
                  <switch_1.Switch id="orders" checked={userData.permissions.orders} onCheckedChange={function () { return handlePermissionChange("orders"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="catalog">Catalog</label_1.Label>
                  <switch_1.Switch id="catalog" checked={userData.permissions.catalog} onCheckedChange={function () { return handlePermissionChange("catalog"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="inventory">Inventory</label_1.Label>
                  <switch_1.Switch id="inventory" checked={userData.permissions.inventory} onCheckedChange={function () { return handlePermissionChange("inventory"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="advertising">Advertising</label_1.Label>
                  <switch_1.Switch id="advertising" checked={userData.permissions.advertising} onCheckedChange={function () { return handlePermissionChange("advertising"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="amazonVendors">Vendors</label_1.Label>
                  <switch_1.Switch id="amazonVendors" checked={userData.permissions.amazonVendors} onCheckedChange={function () { return handlePermissionChange("amazonVendors"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="returns">Returns</label_1.Label>
                  <switch_1.Switch id="returns" checked={userData.permissions.returns} onCheckedChange={function () { return handlePermissionChange("returns"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="payments">Payments</label_1.Label>
                  <switch_1.Switch id="payments" checked={userData.permissions.payments} onCheckedChange={function () { return handlePermissionChange("payments"); }}/>
                </div>
                
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="amazonReports">Reports</label_1.Label>
                  <switch_1.Switch id="amazonReports" checked={userData.permissions.amazonReports} onCheckedChange={function () { return handlePermissionChange("amazonReports"); }}/>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="other">
          <card_1.Card>
            <card_1.CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label_1.Label htmlFor="messaging">Messaging</label_1.Label>
                  <switch_1.Switch id="messaging" checked={userData.permissions.messaging} onCheckedChange={function () { return handlePermissionChange("messaging"); }}/>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
      
      <div className="flex justify-end space-x-2">
        <button_1.Button type="button" variant="outline" onClick={onCancel}>Cancel</button_1.Button>
        <button_1.Button type="submit">{isEditing ? "Update User" : "Create User"}</button_1.Button>
      </div>
    </form>);
};
exports.default = UserForm;
