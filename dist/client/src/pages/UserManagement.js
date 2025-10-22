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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var tabs_1 = require("@/components/ui/tabs");
var table_1 = require("@/components/ui/table");
var dialog_1 = require("@/components/ui/dialog");
var checkbox_1 = require("@/components/ui/checkbox");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var authService_1 = require("../services/authService");
var UserManagement = function () {
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
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
                        console.log("Fetched users:", response);
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
    // utils/permissions.ts or inline above your component
    var buildPermissionObject = function (selectedPermissions, messaging) {
        var permissionObj = {
            officePlatform: false,
            amazonPlatform: false,
            meeshoPlatform: false,
            websitePlatform: false,
            dashboard: false,
            categories: false,
            products: false,
            stocks: false,
            customers: false,
            vendors: false,
            salesInvoice: false,
            purchaseInvoice: false,
            creditDebitNote: false,
            expenses: false,
            reports: false,
            settings: false,
            amazonDashboard: false,
            orders: false,
            catalog: false,
            inventory: false,
            advertising: false,
            amazonVendors: false,
            returns: false,
            payments: false,
            amazonReports: false,
            messaging: false,
        };
        // Platforms
        permissionObj.officePlatform = selectedPermissions.some(function (p) {
            return p.startsWith("office-");
        });
        permissionObj.amazonPlatform = selectedPermissions.some(function (p) {
            return p.startsWith("amazon-");
        });
        permissionObj.meeshoPlatform = selectedPermissions.some(function (p) {
            return p.startsWith("meesho-");
        });
        permissionObj.websitePlatform = selectedPermissions.some(function (p) {
            return p.startsWith("website-");
        });
        // Individual permissions
        selectedPermissions.forEach(function (perm) {
            var _a = perm.split("-"), prefix = _a[0], key = _a[1];
            switch (key) {
                case "stock":
                    permissionObj.stocks = true;
                    break;
                case "customer":
                    permissionObj.customers = true;
                    break;
                case "vendor":
                    permissionObj.vendors = true;
                    break;
                case "creditDebit":
                    permissionObj.creditDebitNote = true;
                    break;
                default:
                    // Only set valid keys
                    if (key in permissionObj) {
                        permissionObj[key] = true;
                    }
            }
        });
        permissionObj.messaging = messaging;
        return permissionObj;
    };
    var _b = (0, react_1.useState)({
        name: "",
        email: "",
        password: "",
        role: "Staff",
        permissions: [],
        messaging: false,
    }), newUser = _b[0], setNewUser = _b[1];
    var _c = (0, react_1.useState)(false), dialogOpen = _c[0], setDialogOpen = _c[1];
    var handleCreateUser = function () { return __awaiter(void 0, void 0, void 0, function () {
        var user, response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = {
                        // id: Math.random().toString(36).substring(7),
                        name: newUser.name,
                        email: newUser.email,
                        password: newUser.password, // Password should be hashed in a real app
                        role: newUser.role,
                        permissions: buildPermissionObject(newUser.permissions, newUser.messaging),
                        messaging: newUser.messaging,
                        createdAt: new Date().toISOString().split("T")[0],
                        lastActive: new Date().toISOString().split("T")[0],
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, authService_1.registerUser)(user)];
                case 2:
                    response = _a.sent();
                    if (response) {
                        sonner_1.toast.success("User created successfully");
                        setDialogOpen(false);
                        setUsers(__spreadArray(__spreadArray([], users, true), [user], false));
                        // Reset form
                        setNewUser({
                            name: "",
                            email: "",
                            password: "",
                            role: "Staff",
                            permissions: [],
                            messaging: false,
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error creating user:", error_2);
                    sonner_1.toast.error("Failed to create user. Please try again.");
                    return [2 /*return*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Grouped permissions by platform
    var officePermissions = [
        { id: "dashboard", label: "Dashboard Access" },
        { id: "categories", label: "Categories Access" },
        { id: "products", label: "Products Access" },
        { id: "stock", label: "Stock Access" },
        { id: "customer", label: "Customer Access" },
        { id: "vendor", label: "Vendor Access" },
        { id: "salesInvoice", label: "Sales Invoice Access" },
        { id: "purchaseInvoice", label: "Purchase Invoice Access" },
        { id: "creditDebit", label: "Credit & Debit Note Access" },
        { id: "expenses", label: "Expenses Access" },
        { id: "reports", label: "Reports Access" },
        { id: "settings", label: "Settings Access" },
    ];
    var amazonPermissions = [
        { id: "amazonDashboard", label: "Dashboard Access" },
        { id: "orders", label: "Orders Access" },
        { id: "catalog", label: "Catalog Access" },
        { id: "inventory", label: "Inventory Access" },
        { id: "advertising", label: "Advertising Access" },
        { id: "vendors", label: "Vendor Access" },
        { id: "returns", label: "Returns Access" },
        { id: "payments", label: "Payments Access" },
        { id: "amazonReports", label: "Reports Access" },
    ];
    var meeshoPermissions = [
        { id: "meeshoDashboard", label: "Dashboard Access" },
    ];
    var flipkartPermissions = [
        { id: "flipkartDashboard", label: "Dashboard Access" },
    ];
    var websitePermissions = [
        { id: "websiteDashboard", label: "Dashboard Access" },
    ];
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-iraav-dark-blue">
            User Management
          </h2>
          <p className="text-muted-foreground">
            Manage user access and permissions
          </p>
        </div>

        <dialog_1.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <dialog_1.DialogTrigger asChild>
            <button_1.Button className="bg-iraav-dark-blue hover:bg-iraav-navy">
              <lucide_react_1.UserPlus className="mr-2 h-4 w-4"/> Add User
            </button_1.Button>
          </dialog_1.DialogTrigger>
          <dialog_1.DialogContent className="w-[70vw] max-w-[70vw] p-8 max-h-screen overflow-y-auto">
            <dialog_1.DialogHeader>
              <dialog_1.DialogTitle>Create New User</dialog_1.DialogTitle>
              <dialog_1.DialogDescription>
                Add a new user account and set their permissions.
              </dialog_1.DialogDescription>
            </dialog_1.DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="name" className="text-right">
                  Name
                </label_1.Label>
                <input_1.Input id="name" value={newUser.name} onChange={function (e) {
            return setNewUser(__assign(__assign({}, newUser), { name: e.target.value }));
        }} className="col-span-3"/>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="email" className="text-right">
                  Email
                </label_1.Label>
                <input_1.Input id="email" type="email" value={newUser.email} onChange={function (e) {
            return setNewUser(__assign(__assign({}, newUser), { email: e.target.value }));
        }} className="col-span-3"/>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="password" className="text-right">
                  Password
                </label_1.Label>
                <input_1.Input id="password" type="password" value={newUser.password} onChange={function (e) {
            return setNewUser(__assign(__assign({}, newUser), { password: e.target.value }));
        }} className="col-span-3"/>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="role" className="text-right">
                  Role
                </label_1.Label>
                <select_1.Select value={newUser.role} onValueChange={function (value) {
            return setNewUser(__assign(__assign({}, newUser), { role: value }));
        }}>
                  <select_1.SelectTrigger className="col-span-3">
                    <select_1.SelectValue placeholder="Select a role"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Admin">Admin</select_1.SelectItem>
                    <select_1.SelectItem value="Manager">Manager</select_1.SelectItem>
                    <select_1.SelectItem value="Staff">Staff</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>

              {/* Messaging permission */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label_1.Label htmlFor="messaging" className="text-right">
                  Messaging
                </label_1.Label>
                <div className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <checkbox_1.Checkbox id="messaging" checked={newUser.messaging} onCheckedChange={function (checked) {
            setNewUser(__assign(__assign({}, newUser), { messaging: !!checked }));
        }}/>
                    <label_1.Label htmlFor="messaging">Allow Messaging</label_1.Label>
                  </div>
                </div>
              </div>

              <tabs_1.Tabs defaultValue="office" className="col-span-4">
                <tabs_1.TabsList className="w-full">
                  <tabs_1.TabsTrigger value="office">Office</tabs_1.TabsTrigger>
                  <tabs_1.TabsTrigger value="amazon">Amazon</tabs_1.TabsTrigger>
                  <tabs_1.TabsTrigger value="meesho">Meesho</tabs_1.TabsTrigger>
                  <tabs_1.TabsTrigger value="flipkart">Flipkart</tabs_1.TabsTrigger>
                  <tabs_1.TabsTrigger value="website">Website</tabs_1.TabsTrigger>
                </tabs_1.TabsList>

                <tabs_1.TabsContent value="office">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {officePermissions.map(function (permission) { return (<div key={permission.id} className="flex items-center space-x-2">
                        <checkbox_1.Checkbox id={"office-".concat(permission.id)} checked={newUser.permissions.includes("office-".concat(permission.id))} onCheckedChange={function (checked) {
                if (checked) {
                    setNewUser(__assign(__assign({}, newUser), { permissions: __spreadArray(__spreadArray([], newUser.permissions, true), [
                            "office-".concat(permission.id),
                        ], false) }));
                }
                else {
                    setNewUser(__assign(__assign({}, newUser), { permissions: newUser.permissions.filter(function (p) { return p !== "office-".concat(permission.id); }) }));
                }
            }}/>
                        <label_1.Label htmlFor={"office-".concat(permission.id)}>
                          {permission.label}
                        </label_1.Label>
                      </div>); })}
                  </div>
                </tabs_1.TabsContent>

                <tabs_1.TabsContent value="amazon">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {amazonPermissions.map(function (permission) { return (<div key={permission.id} className="flex items-center space-x-2">
                        <checkbox_1.Checkbox id={"amazon-".concat(permission.id)} checked={newUser.permissions.includes("amazon-".concat(permission.id))} onCheckedChange={function (checked) {
                if (checked) {
                    setNewUser(__assign(__assign({}, newUser), { permissions: __spreadArray(__spreadArray([], newUser.permissions, true), [
                            "amazon-".concat(permission.id),
                        ], false) }));
                }
                else {
                    setNewUser(__assign(__assign({}, newUser), { permissions: newUser.permissions.filter(function (p) { return p !== "amazon-".concat(permission.id); }) }));
                }
            }}/>
                        <label_1.Label htmlFor={"amazon-".concat(permission.id)}>
                          {permission.label}
                        </label_1.Label>
                      </div>); })}
                  </div>
                </tabs_1.TabsContent>

                {/* Similar layout for other platforms */}
                <tabs_1.TabsContent value="meesho">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {meeshoPermissions.map(function (permission) { return (<div key={permission.id} className="flex items-center space-x-2">
                        <checkbox_1.Checkbox id={"meesho-".concat(permission.id)} checked={newUser.permissions.includes("meesho-".concat(permission.id))} onCheckedChange={function (checked) {
                if (checked) {
                    setNewUser(__assign(__assign({}, newUser), { permissions: __spreadArray(__spreadArray([], newUser.permissions, true), [
                            "meesho-".concat(permission.id),
                        ], false) }));
                }
                else {
                    setNewUser(__assign(__assign({}, newUser), { permissions: newUser.permissions.filter(function (p) { return p !== "meesho-".concat(permission.id); }) }));
                }
            }}/>
                        <label_1.Label htmlFor={"meesho-".concat(permission.id)}>
                          {permission.label}
                        </label_1.Label>
                      </div>); })}
                  </div>
                </tabs_1.TabsContent>

                <tabs_1.TabsContent value="flipkart">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {flipkartPermissions.map(function (permission) { return (<div key={permission.id} className="flex items-center space-x-2">
                        <checkbox_1.Checkbox id={"flipkart-".concat(permission.id)} checked={newUser.permissions.includes("flipkart-".concat(permission.id))} onCheckedChange={function (checked) {
                if (checked) {
                    setNewUser(__assign(__assign({}, newUser), { permissions: __spreadArray(__spreadArray([], newUser.permissions, true), [
                            "flipkart-".concat(permission.id),
                        ], false) }));
                }
                else {
                    setNewUser(__assign(__assign({}, newUser), { permissions: newUser.permissions.filter(function (p) { return p !== "flipkart-".concat(permission.id); }) }));
                }
            }}/>
                        <label_1.Label htmlFor={"flipkart-".concat(permission.id)}>
                          {permission.label}
                        </label_1.Label>
                      </div>); })}
                  </div>
                </tabs_1.TabsContent>

                <tabs_1.TabsContent value="website">
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {websitePermissions.map(function (permission) { return (<div key={permission.id} className="flex items-center space-x-2">
                        <checkbox_1.Checkbox id={"website-".concat(permission.id)} checked={newUser.permissions.includes("website-".concat(permission.id))} onCheckedChange={function (checked) {
                if (checked) {
                    setNewUser(__assign(__assign({}, newUser), { permissions: __spreadArray(__spreadArray([], newUser.permissions, true), [
                            "website-".concat(permission.id),
                        ], false) }));
                }
                else {
                    setNewUser(__assign(__assign({}, newUser), { permissions: newUser.permissions.filter(function (p) { return p !== "website-".concat(permission.id); }) }));
                }
            }}/>
                        <label_1.Label htmlFor={"website-".concat(permission.id)}>
                          {permission.label}
                        </label_1.Label>
                      </div>); })}
                  </div>
                </tabs_1.TabsContent>
              </tabs_1.Tabs>
            </div>

            <dialog_1.DialogFooter>
              <button_1.Button variant="outline" onClick={function () { return setDialogOpen(false); }}>
                Cancel
              </button_1.Button>
              <button_1.Button className="bg-iraav-dark-blue hover:bg-iraav-navy" onClick={handleCreateUser}>
                Create User
              </button_1.Button>
            </dialog_1.DialogFooter>
          </dialog_1.DialogContent>
        </dialog_1.Dialog>
      </div>

      <tabs_1.Tabs defaultValue="all">
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="all">All Users</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="admin">Admins</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="manager">Managers</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="staff">Staff</tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="all" className="mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>User Accounts</card_1.CardTitle>
              <card_1.CardDescription>
                Manage user accounts and permissions.
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead>Name</table_1.TableHead>
                    <table_1.TableHead>Email</table_1.TableHead>
                    <table_1.TableHead>Role</table_1.TableHead>
                    <table_1.TableHead>Messaging</table_1.TableHead>
                    <table_1.TableHead>Created</table_1.TableHead>
                    <table_1.TableHead>Last Active</table_1.TableHead>
                    <table_1.TableHead>Actions</table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {users === null || users === void 0 ? void 0 : users.map(function (user) { return (<table_1.TableRow key={user._id}>
                      <table_1.TableCell className="font-medium">{user.name}</table_1.TableCell>
                      <table_1.TableCell>{user.email}</table_1.TableCell>
                      <table_1.TableCell>{user.role}</table_1.TableCell>
                      <table_1.TableCell>
                        {user.messaging ? (<div className="flex items-center text-green-600">
                            <lucide_react_1.MessageSquare className="h-4 w-4 mr-1"/>
                            <span>Enabled</span>
                          </div>) : (<span className="text-gray-500">Disabled</span>)}
                      </table_1.TableCell>
                      <table_1.TableCell>{user.createdAt}</table_1.TableCell>
                      <table_1.TableCell>{user.lastActive}</table_1.TableCell>
                      <table_1.TableCell>
                        <button_1.Button variant="outline" size="sm">
                          Edit
                        </button_1.Button>
                      </table_1.TableCell>
                    </table_1.TableRow>); })}
                </table_1.TableBody>
              </table_1.Table>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        {/* Similar content for other tabs */}
        <tabs_1.TabsContent value="admin" className="mt-6">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Admin Users</card_1.CardTitle>
              <card_1.CardDescription>
                Users with administrator privileges
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead>Name</table_1.TableHead>
                    <table_1.TableHead>Email</table_1.TableHead>
                    <table_1.TableHead>Messaging</table_1.TableHead>
                    <table_1.TableHead>Created</table_1.TableHead>
                    <table_1.TableHead>Last Active</table_1.TableHead>
                    <table_1.TableHead>Actions</table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {users === null || users === void 0 ? void 0 : users.filter(function (user) { return user.role === "Admin"; }).map(function (user) { return (<table_1.TableRow key={user._id}>
                        <table_1.TableCell className="font-medium">
                          {user.name}
                        </table_1.TableCell>
                        <table_1.TableCell>{user.email}</table_1.TableCell>
                        <table_1.TableCell>
                          {user.messaging ? (<div className="flex items-center text-green-600">
                              <lucide_react_1.MessageSquare className="h-4 w-4 mr-1"/>
                              <span>Enabled</span>
                            </div>) : (<span className="text-gray-500">Disabled</span>)}
                        </table_1.TableCell>
                        <table_1.TableCell>{user.createdAt}</table_1.TableCell>
                        <table_1.TableCell>{user.lastActive}</table_1.TableCell>
                        <table_1.TableCell>
                          <button_1.Button variant="outline" size="sm">
                            Edit
                          </button_1.Button>
                        </table_1.TableCell>
                      </table_1.TableRow>); })}
                </table_1.TableBody>
              </table_1.Table>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
};
exports.default = UserManagement;
