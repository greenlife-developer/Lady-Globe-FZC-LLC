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
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var card_1 = require("@/components/ui/card");
var sonner_1 = require("@/components/ui/sonner");
var authService_1 = require("@/services/authService"); // make sure you have this service
var Register = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(""), name = _a[0], setName = _a[1];
    var _b = (0, react_1.useState)(""), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)(""), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(""), confirmPassword = _d[0], setConfirmPassword = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    var handleRegister = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var userData, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (password !== confirmPassword) {
                        sonner_1.toast.error("Passwords do not match");
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    userData = {
                        name: name,
                        email: email,
                        password: password,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, (0, authService_1.registerUser)(userData)];
                case 2:
                    response = _a.sent();
                    if (response.message === "User created") {
                        sonner_1.toast.success("Registration successful! Please log in.");
                        navigate("/login");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error("Registration error:", err_1);
                    sonner_1.toast.error("An error occurred during registration. Please try again.");
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-iraav-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-iraav-dark-blue">MWMW</h1>
            <p className="text-xl text-gray-600">Trendyol Solution</p>
          </div>
        </div>

        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Create an Account</card_1.CardTitle>
            <card_1.CardDescription>
              Fill in your details to register
            </card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label_1.Label htmlFor="name">Name</label_1.Label>
                  <input_1.Input id="name" type="text" placeholder="John Doe" value={name} onChange={function (e) { return setName(e.target.value); }} required/>
                </div>
                <div className="grid gap-2">
                  <label_1.Label htmlFor="email">Email</label_1.Label>
                  <input_1.Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={function (e) { return setEmail(e.target.value); }} required/>
                </div>
                <div className="grid gap-2">
                  <label_1.Label htmlFor="password">Password</label_1.Label>
                  <input_1.Input id="password" type="password" placeholder="••••••••" value={password} onChange={function (e) { return setPassword(e.target.value); }} required/>
                </div>
                <div className="grid gap-2">
                  <label_1.Label htmlFor="confirmPassword">Confirm Password</label_1.Label>
                  <input_1.Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={function (e) { return setConfirmPassword(e.target.value); }} required/>
                </div>
                <button_1.Button type="submit" className="w-full bg-iraav-dark-blue hover:bg-iraav-navy" disabled={loading}>
                  {loading ? "Signing up..." : "Sign up"}
                </button_1.Button>
              </div>
            </form>
          </card_1.CardContent>
          <card_1.CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <react_router_dom_1.Link to="/login" className="text-iraav-dark-blue hover:underline font-medium">
                Login
              </react_router_dom_1.Link>
            </p>
          </card_1.CardFooter>
        </card_1.Card>
      </div>
    </div>);
};
exports.default = Register;
