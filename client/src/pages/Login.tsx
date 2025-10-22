import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { loginUser } from "../services/authService";
import {
  SET_LOGIN,
  SET_NAME,
  SET_USER,
} from "../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const location = useLocation();

  const determineRedirectUrl = () => {
    const queryParams = new URLSearchParams(location.search);
    const redirectUrl = queryParams.get("redirect_url");
    return redirectUrl ? redirectUrl : "/dashboard";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userData = {
      email,
      password,
    }; 

    try {
      const response = await loginUser(userData);
      console.log(response);

      if (response.status === 200) {
        await dispatch(SET_LOGIN(true));
        await dispatch(SET_NAME(response.user.name));
        await dispatch(SET_USER(response.user));
        setLoading(false);
        navigate(determineRedirectUrl());
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      toast.error("An error occurred during login. Please try again.");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-iraav-bg-light flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-iraav-dark-blue">MWMW</h1>
            <p className="text-xl text-gray-600">Amazon Solution</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-iraav-dark-blue hover:bg-iraav-navy"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                {/* <button
                  type="button"
                  className="w-full bg-iraav-dark-blue hover:bg-iraav-navy"
                >
                  Login with Amazon
                </button> */}
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-iraav-dark-blue hover:underline font-medium"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
          {/* <CardFooter className="flex flex-col">
            <div className="text-sm text-gray-500 text-center mt-2">
              <p>For demo purposes use:</p>
              <p>Email: admin@mwmw.com</p>
              <p>Password: password</p>
            </div>
          </CardFooter> */}
        </Card>
      </div>
    </div>
  );
};

export default Login;
