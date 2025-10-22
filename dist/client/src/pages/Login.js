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
var authService_1 = require("../services/authService");
var authSlice_1 = require("../redux/features/auth/authSlice");
var react_redux_1 = require("react-redux");
var Login = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(""), email = _a[0], setEmail = _a[1];
    var _b = (0, react_1.useState)(""), password = _b[0], setPassword = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    var dispatch = (0, react_redux_1.useDispatch)();
    var location = (0, react_router_dom_1.useLocation)();
    var determineRedirectUrl = function () {
        var queryParams = new URLSearchParams(location.search);
        var redirectUrl = queryParams.get("redirect_url");
        return redirectUrl ? redirectUrl : "/dashboard";
    };
    var handleLogin = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var userData, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setLoading(true);
                    userData = {
                        email: email,
                        password: password,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, (0, authService_1.loginUser)(userData)];
                case 2:
                    response = _a.sent();
                    console.log(response);
                    if (!(response.status === 200)) return [3 /*break*/, 6];
                    return [4 /*yield*/, dispatch((0, authSlice_1.SET_LOGIN)(true))];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, dispatch((0, authSlice_1.SET_NAME)(response.user.name))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, dispatch((0, authSlice_1.SET_USER)(response.user))];
                case 5:
                    _a.sent();
                    setLoading(false);
                    navigate(determineRedirectUrl());
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    console.error("Login error:", err_1);
                    setLoading(false);
                    sonner_1.toast.error("An error occurred during login. Please try again.");
                    return [2 /*return*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-iraav-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-iraav-dark-blue">MWMW</h1>
            <p className="text-xl text-gray-600">Amazon Solution</p>
          </div>
        </div>

        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Login</card_1.CardTitle>
            <card_1.CardDescription>
              Enter your credentials to access your account
            </card_1.CardDescription>
          </card_1.CardHeader>
          <card_1.CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label_1.Label htmlFor="email">Email</label_1.Label>
                  <input_1.Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={function (e) { return setEmail(e.target.value); }} required/>
                </div>
                <div className="grid gap-2">
                  <label_1.Label htmlFor="password">Password</label_1.Label>
                  <input_1.Input id="password" type="password" placeholder="••••••••" value={password} onChange={function (e) { return setPassword(e.target.value); }} required/>
                </div>
                <button_1.Button type="submit" className="w-full bg-iraav-dark-blue hover:bg-iraav-navy" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button_1.Button>
                {/* <button
          type="button"
          className="w-full bg-iraav-dark-blue hover:bg-iraav-navy"
        >
          Login with Amazon
        </button> */}
              </div>
            </form>
          </card_1.CardContent>
          <card_1.CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-iraav-dark-blue hover:underline font-medium">
                Sign up
              </a>
            </p>
          </card_1.CardFooter>
          {/* <CardFooter className="flex flex-col">
          <div className="text-sm text-gray-500 text-center mt-2">
            <p>For demo purposes use:</p>
            <p>Email: admin@mwmw.com</p>
            <p>Password: password</p>
          </div>
        </CardFooter> */}
        </card_1.Card>
      </div>
    </div>);
};
exports.default = Login;
