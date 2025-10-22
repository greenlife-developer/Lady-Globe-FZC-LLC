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
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
var UserForm_1 = require("./UserForm");
var card_1 = require("@/components/ui/card");
var sonner_1 = require("sonner");
var authService_1 = require("../services/authService");
var UserManagementTab = function () {
    var _a = (0, react_1.useState)([]), users = _a[0], setUsers = _a[1];
    // let's start here.
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
    var _b = (0, react_1.useState)(false), showUserForm = _b[0], setShowUserForm = _b[1];
    var _c = (0, react_1.useState)(null), editingUser = _c[0], setEditingUser = _c[1];
    var handleUserSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var response_1, err_1, newUser, response, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editingUser) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, authService_1.updateUser)(data._id, data)];
                case 2:
                    response_1 = _a.sent();
                    if (!response_1) {
                        throw new Error("Failed to update user");
                    }
                    setUsers(users.map(function (user) {
                        return user._id === data._id
                            ? __assign(__assign({}, response_1.user), { 
                                // If password is empty in edit mode, keep the current password
                                password: data.password || user.password }) : user;
                    }));
                    sonner_1.toast.success("User updated successfully");
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error("Error updating user:", err_1);
                    sonner_1.toast.error("Failed to update user. Please try again.");
                    return [2 /*return*/];
                case 4: return [3 /*break*/, 9];
                case 5:
                    newUser = __assign({}, data);
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, authService_1.registerUser)(newUser)];
                case 7:
                    response = _a.sent();
                    if (response) {
                        setUsers(__spreadArray(__spreadArray([], users, true), [newUser], false));
                        sonner_1.toast.success("User created successfully");
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    console.error("Error creating user:", err_2);
                    sonner_1.toast.error("Failed to create user. Please try again.");
                    return [2 /*return*/];
                case 9:
                    setShowUserForm(false);
                    setEditingUser(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var deleteUser = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var response, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this user?")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, authService_1.deleteUserRecord)(id)];
                case 2:
                    response = _a.sent();
                    console.log("Delete response:", response);
                    if (response.status === 200) {
                        setUsers(users.filter(function (user) { return user._id !== id; }));
                        sonner_1.toast.success("User deleted successfully");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    console.error("Error deleting user:", err_3);
                    sonner_1.toast.error("Failed to delete user. Please try again.");
                    return [2 /*return*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var openEditUserForm = function (user) {
        setEditingUser(user);
        setShowUserForm(true);
    };
    if (showUserForm) {
        return (<card_1.Card className="h-[calc(100vh-200px)] overflow-hidden">
        <card_1.CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <button_1.Button variant="ghost" onClick={function () {
                setShowUserForm(false);
                setEditingUser(null);
            }} className="mr-2">
              <lucide_react_1.ArrowLeft className="h-4 w-4"/>
            </button_1.Button>
            <card_1.CardTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </card_1.CardTitle>
          </div>
        </card_1.CardHeader>
        <card_1.CardContent className="overflow-y-auto pb-6">
          <UserForm_1.default user={editingUser || {}} onSubmit={handleUserSubmit} onCancel={function () {
                setShowUserForm(false);
                setEditingUser(null);
            }} isEditing={!!editingUser}/>
        </card_1.CardContent>
      </card_1.Card>);
    }
    return (<card_1.Card>
      <card_1.CardHeader className="flex flex-row items-center justify-between">
        <card_1.CardTitle>User Management</card_1.CardTitle>
        <button_1.Button onClick={function () {
            setEditingUser(null);
            setShowUserForm(true);
        }}>
          <lucide_react_1.Plus className="h-4 w-4 mr-2"/> Add User
        </button_1.Button>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map(function (user) { return (<card_1.Card key={user._id} className="border border-gray-200">
              <card_1.CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <card_1.CardTitle className="text-lg">{user.name}</card_1.CardTitle>
                  <div className="flex space-x-1">
                    <button_1.Button size="sm" variant="ghost" onClick={function () { return openEditUserForm(user); }}>
                      <lucide_react_1.UserCog className="h-4 w-4"/>
                    </button_1.Button>
                    <button_1.Button size="sm" variant="ghost" onClick={function () { return deleteUser(user._id); }}>
                      <lucide_react_1.Trash2 className="h-4 w-4 text-red-500"/>
                    </button_1.Button>
                  </div>
                </div>
              </card_1.CardHeader>
              <card_1.CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Email:
                    </span>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Role:</span>
                    <p>{user.role}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Access:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.permissions.officePlatform && (<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Office
                        </span>)}
                      {user.permissions.amazonPlatform && (<span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Amazon
                        </span>)}
                      {user.permissions.meeshoPlatform && (<span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                          Meesho
                        </span>)}
                      {user.permissions.websitePlatform && (<span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Website
                        </span>)}
                    </div>
                  </div>
                </div>
              </card_1.CardContent>
            </card_1.Card>); })}
        </div>
      </card_1.CardContent>
    </card_1.Card>);
};
exports.default = UserManagementTab;
