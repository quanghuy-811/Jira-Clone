"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { loginSuccess } from "@/store/slices/authSlice";
import { authService } from "@/lib/services/authService";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(formData);

      const loginResponse = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("accessToken", loginResponse.content.accessToken);
      localStorage.setItem("userData", JSON.stringify(loginResponse.content));

      dispatch(
        loginSuccess({
          user: loginResponse.content,
          accessToken: loginResponse.content.accessToken,
        })
      );

      window.location.href = "/dashboard/projects";
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex justify-center items-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="text-gray-600 mt-2">
              Start your journey with our Jira Clone
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Input
                    placeholder="Phone Number (Optional)"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign up"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Image & Text */}
      <div className="hidden lg:flex flex-1 bg-blue-600">
        <div className="w-full flex flex-col justify-center items-center p-12 text-center">
          <div className="max-w-md space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                Welcome to Jira Clone
              </h1>
              <p className="text-lg text-white/90">
                Plan, track, and manage your agile and software development
                projects with efficiency.
              </p>
            </div>
            <div className="relative w-full aspect-square max-w-md">
              <img
                src="/welcome-illustration.svg"
                alt="Collaboration Illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
