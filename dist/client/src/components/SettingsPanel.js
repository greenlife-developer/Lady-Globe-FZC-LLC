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
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var button_1 = require("@/components/ui/button");
var switch_1 = require("@/components/ui/switch");
var react_router_dom_1 = require("react-router-dom");
var sonner_1 = require("sonner");
var AmazonServices_1 = require("@/components/AmazonServices");
var SettingsPanel = function () {
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
        link.download = "mivyna-backup-".concat(new Date().toISOString().split("T")[0], ".json");
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

      <tabs_1.Tabs defaultValue="api" className="w-full">
        <tabs_1.TabsList className="grid grid-cols-7 w-full max-w-4xl">
          <tabs_1.TabsTrigger value="api">API Integration</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="amazon-services">Amazon Services</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="user-management">User Management</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="messages">Messages</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="backup">Backup</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="preferences">Preferences</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="notifications">Notifications</tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        
        <tabs_1.TabsContent value="api" className="space-y-4 mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Amazon Seller API Configuration</card_1.CardTitle>
              <card_1.CardDescription>
                Enter your Amazon Seller API credentials to connect to your Amazon seller account.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label_1.Label htmlFor="clientId">Client ID</label_1.Label>
                  <input_1.Input id="clientId" name="clientId" placeholder="Your Amazon API Client ID" value={amazonCredentials.clientId} onChange={handleCredentialsChange}/>
                </div>
                
                <div className="space-y-2">
                  <label_1.Label htmlFor="clientSecret">Client Secret</label_1.Label>
                  <input_1.Input id="clientSecret" name="clientSecret" type="password" placeholder="Your Amazon API Client Secret" value={amazonCredentials.clientSecret} onChange={handleCredentialsChange}/>
                </div>
                
                <div className="space-y-2">
                  <label_1.Label htmlFor="refreshToken">Refresh Token</label_1.Label>
                  <input_1.Input id="refreshToken" name="refreshToken" placeholder="Your Amazon API Refresh Token" value={amazonCredentials.refreshToken} onChange={handleCredentialsChange}/>
                </div>
                
                <div className="space-y-2">
                  <label_1.Label htmlFor="region">AWS Region</label_1.Label>
                  <select id="region" name="region" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={amazonCredentials.region} onChange={function (e) { return setAmazonCredentials(function (prev) { return (__assign(__assign({}, prev), { region: e.target.value })); }); }}>
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="eu-west-1">Europe (Ireland)</option>
                    <option value="ap-northeast-1">Asia Pacific (Tokyo)</option>
                  </select>
                </div>
              </div>
            </card_1.CardContent>
            <card_1.CardFooter>
              <button_1.Button className="bg-iraav-dark-blue hover:bg-iraav-navy" onClick={handleSaveCredentials}>
                <lucide_react_1.Key className="mr-2 h-4 w-4"/>
                Save API Credentials
              </button_1.Button>
            </card_1.CardFooter>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="amazon-services" className="space-y-4 mt-6">
          <AmazonServices_1.default />
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="user-management" className="space-y-4 mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center">
                <lucide_react_1.Users className="mr-2 h-5 w-5"/>
                User Management
              </card_1.CardTitle>
              <card_1.CardDescription>
                Manage user accounts, permissions and access controls
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <p>
                Create and manage user accounts for your team members. Control what parts of the system each user can access.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <card_1.Card>
                  <card_1.CardHeader className="pb-2">
                    <card_1.CardTitle className="text-lg">User Accounts</card_1.CardTitle>
                    <card_1.CardDescription>Manage employee accounts</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <p className="text-sm">Create, edit, or delete user accounts and control access permissions.</p>
                  </card_1.CardContent>
                  <card_1.CardFooter>
                    <button_1.Button asChild className="w-full bg-iraav-dark-blue hover:bg-iraav-navy">
                      <react_router_dom_1.Link to="/settings/users">
                        <lucide_react_1.Users className="mr-2 h-4 w-4"/>
                        Manage Users
                      </react_router_dom_1.Link>
                    </button_1.Button>
                  </card_1.CardFooter>
                </card_1.Card>
                <card_1.Card>
                  <card_1.CardHeader className="pb-2">
                    <card_1.CardTitle className="text-lg">Messaging System</card_1.CardTitle>
                    <card_1.CardDescription>Configure internal communication</card_1.CardDescription>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <p className="text-sm">Control who can message whom and manage messaging permissions.</p>
                  </card_1.CardContent>
                  <card_1.CardFooter>
                    <button_1.Button asChild className="w-full bg-iraav-dark-blue hover:bg-iraav-navy">
                      <react_router_dom_1.Link to="/settings/messages">
                        <lucide_react_1.MessageSquare className="mr-2 h-4 w-4"/>
                        Manage Messages
                      </react_router_dom_1.Link>
                    </button_1.Button>
                  </card_1.CardFooter>
                </card_1.Card>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="messages" className="space-y-4 mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center">
                <lucide_react_1.MessageSquare className="mr-2 h-5 w-5"/>
                Messaging System
              </card_1.CardTitle>
              <card_1.CardDescription>
                Configure internal communications and messaging features
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <p>
                Manage how users can communicate within the application. Control messaging permissions and file sharing capabilities.
              </p>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <react_router_dom_1.Link to="/messages" className="block">
                  <button_1.Button className="w-full bg-iraav-dark-blue hover:bg-iraav-navy">
                    <lucide_react_1.MessageSquare className="mr-2 h-4 w-4"/> Open Messaging System
                  </button_1.Button>
                </react_router_dom_1.Link>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label_1.Label htmlFor="allowFileSharing">Allow File Sharing</label_1.Label>
                      <switch_1.Switch id="allowFileSharing" defaultChecked/>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Allow users to share files in messages
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label_1.Label htmlFor="restrictCommunication">Restrict Communication</label_1.Label>
                      <switch_1.Switch id="restrictCommunication"/>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Only allow users to message within their department
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label_1.Label htmlFor="messageHistory">Message History</label_1.Label>
                      <select id="messageHistory" className="flex h-9 w-36 rounded-md border border-input bg-background px-3 py-1 text-sm">
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      How long to keep message history
                    </p>
                  </div>
                </div>
              </div>
            </card_1.CardContent>
            <card_1.CardFooter>
              <button_1.Button className="bg-iraav-dark-blue hover:bg-iraav-navy">
                <lucide_react_1.Save className="mr-2 h-4 w-4"/>
                Save Message Settings
              </button_1.Button>
            </card_1.CardFooter>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="backup" className="space-y-4 mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Data Backup and Restore</card_1.CardTitle>
              <card_1.CardDescription>
                Create backups of your data and restore from previous backups.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <switch_1.Switch id="autoBackup" checked={backupSettings.autoBackup} onCheckedChange={function (checked) { return setBackupSettings(function (prev) { return (__assign(__assign({}, prev), { autoBackup: checked })); }); }}/>
                    <label_1.Label htmlFor="autoBackup">Automatic Backups</label_1.Label>
                  </div>
                  
                  {backupSettings.autoBackup && (<div className="space-y-2">
                      <label_1.Label htmlFor="backupFrequency">Backup Frequency</label_1.Label>
                      <select id="backupFrequency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={backupSettings.backupFrequency} onChange={function (e) { return setBackupSettings(function (prev) { return (__assign(__assign({}, prev), { backupFrequency: e.target.value })); }); }}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>)}
                  
                  <div className="text-sm text-muted-foreground">
                    Last Backup: {backupSettings.lastBackup}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button_1.Button className="w-full bg-iraav-dark-blue hover:bg-iraav-navy" onClick={handleCreateBackup}>
                    <lucide_react_1.Download className="mr-2 h-4 w-4"/>
                    Create Backup
                  </button_1.Button>
                  
                  <div className="space-y-2">
                    <label_1.Label htmlFor="importBackup">Import Backup</label_1.Label>
                    <div className="flex items-center">
                      <input_1.Input id="importBackup" type="file" accept=".json" onChange={handleImportBackup} className="hidden"/>
                      <button_1.Button variant="outline" onClick={function () { var _a; return (_a = document.getElementById("importBackup")) === null || _a === void 0 ? void 0 : _a.click(); }} className="w-full">
                        <lucide_react_1.Upload className="mr-2 h-4 w-4"/>
                        Upload Backup File
                      </button_1.Button>
                    </div>
                  </div>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
        
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
                  <select id="currency" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" defaultValue="INR">
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
      </tabs_1.Tabs>
    </div>);
};
exports.default = SettingsPanel;
