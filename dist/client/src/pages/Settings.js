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
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var tabs_1 = require("@/components/ui/tabs");
var label_1 = require("@/components/ui/label");
var button_1 = require("@/components/ui/button");
var switch_1 = require("@/components/ui/switch");
var sonner_1 = require("sonner");
// import AmazonServices from "@/components/AmazonServices";
var UserManagementTab_1 = require("@/components/UserManagementTab");
var Settings = function () {
    var _a = (0, react_1.useState)({
        clientId: "",
        clientSecret: "",
        refreshToken: "",
        region: "us-east-1",
    }), amazonCredentials = _a[0], setAmazonCredentials = _a[1];
    var _b = (0, react_1.useState)({
        autoBackup: false,
        backupFrequency: "daily",
        lastBackup: "Never"
    }), backupSettings = _b[0], setBackupSettings = _b[1];
    var handleCredentialsChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setAmazonCredentials(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleSaveCredentials = function () {
        sonner_1.toast.success("API credentials saved successfully");
    };
    var handleCreateBackup = function () {
        // In a real implementation, this would create a JSON backup of all data
        var mockData = {
            timestamp: new Date().toISOString(),
            orders: "Sample orders data",
            inventory: "Sample inventory data",
            returns: "Sample returns data",
            expenses: "Sample expenses data",
            payments: "Sample payments data"
        };
        var blob = new Blob([JSON.stringify(mockData, null, 2)], { type: "application/json" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "iraav-backup-".concat(new Date().toISOString().split("T")[0], ".json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setBackupSettings(function (prev) { return (__assign(__assign({}, prev), { lastBackup: new Date().toLocaleString() })); });
        sonner_1.toast.success("Backup created successfully");
    };
    var handleImportBackup = function (e) {
        var _a;
        var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            // In a real implementation, this would parse and restore the backup
            sonner_1.toast.success("Backup imported successfully");
            e.target.value = '';
        }
    };
    return (<div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-iraav-dark-blue flex items-center">
          <lucide_react_1.Settings className="h-7 w-7"/>
          <span className="ml-2">Settings</span>
        </h2>
        <p className="text-muted-foreground">Configure your application preferences</p>
      </div>

      <tabs_1.Tabs defaultValue="preferences" className="w-full">
        <tabs_1.TabsList className="grid grid-cols-6 w-full max-w-4xl">
          <tabs_1.TabsTrigger value="preferences">Preferences</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="notifications">Notifications</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="users">Users</tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        
        <tabs_1.TabsContent value="preferences" className="space-y-4 mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Application Preferences</card_1.CardTitle>
              <card_1.CardDescription>
                Customize how the application looks and behaves.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <switch_1.Switch id="darkMode"/>
                  <label_1.Label htmlFor="darkMode">Dark Mode</label_1.Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <switch_1.Switch id="compactMode"/>
                  <label_1.Label htmlFor="compactMode">Compact View</label_1.Label>
                </div>
                
                <div className="space-y-2">
                  <label_1.Label htmlFor="currency">Currency</label_1.Label>
                  <select id="currency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </card_1.CardContent>
            <card_1.CardFooter>
              <button_1.Button>
                <lucide_react_1.Save className="mr-2 h-4 w-4"/>
                Save Preferences
              </button_1.Button>
            </card_1.CardFooter>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="notifications" className="space-y-4 mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Notification Settings</card_1.CardTitle>
              <card_1.CardDescription>
                Configure how and when you receive notifications.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <switch_1.Switch id="emailNotifications" defaultChecked/>
                  <label_1.Label htmlFor="emailNotifications">Email Notifications</label_1.Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <switch_1.Switch id="desktopNotifications"/>
                  <label_1.Label htmlFor="desktopNotifications">Desktop Notifications</label_1.Label>
                </div>
                
                <div className="space-y-2">
                  <label_1.Label>Notify me about:</label_1.Label>
                  <div className="space-y-2 pl-6">
                    <div className="flex items-center space-x-2">
                      <switch_1.Switch id="orderNotifications" defaultChecked/>
                      <label_1.Label htmlFor="orderNotifications">New Orders</label_1.Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <switch_1.Switch id="returnNotifications" defaultChecked/>
                      <label_1.Label htmlFor="returnNotifications">New Returns</label_1.Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <switch_1.Switch id="inventoryAlerts" defaultChecked/>
                      <label_1.Label htmlFor="inventoryAlerts">Low Inventory</label_1.Label>
                    </div>
                  </div>
                </div>
              </div>
            </card_1.CardContent>
            <card_1.CardFooter>
              <button_1.Button>
                <lucide_react_1.Save className="mr-2 h-4 w-4"/>
                Save Notification Settings
              </button_1.Button>
            </card_1.CardFooter>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="users" className="space-y-4 mt-6">
          <UserManagementTab_1.default />
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
};
exports.default = Settings;
