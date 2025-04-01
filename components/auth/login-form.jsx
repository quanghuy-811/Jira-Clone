"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardContent } from "../ui/card";
import { loginSuccess } from "@/store/slices/authSlice";
import { authService } from "@/lib/services/authService";
import { setCookies } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(formData);

      setCookies("accessToken", response.content.accessToken);
      setCookies("userData", response.content);
      setLoading(true);

      dispatch(
        loginSuccess({
          user: response.content,
          accessToken: response.content.accessToken,
        })
      );

      router.replace("/dashboard/projects");
      toast.success("login success");
    } catch (error) {
      console.log("error: ", error);
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-0">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Login</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:underline font-semibold"
              >
                Register now
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
