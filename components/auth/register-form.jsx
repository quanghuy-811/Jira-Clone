"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { authService } from "@/lib/services/authService";
import { toast } from "sonner";

const RegisterForm = () => {
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

      toast.success("Sign up success. Please login");
      router.push("/auth/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
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
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button type="submit" className="w-full btn" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs md:text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
