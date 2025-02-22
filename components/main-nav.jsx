"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logout } from "@/store/slices/authSlice";
import { removeCookies } from "@/lib/utils";

export function MainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => {
    return state.auth;
  });

  const handleLogout = () => {
    dispatch(logout());
    removeCookies("accessToken");
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <header className="bg-white border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Jira Clone
          </Link>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Get started</Link>
            </Button>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="bg-white border-b">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            href="/dashboard/projects"
            className="text-2xl font-medium font-sans"
          >
            Jira Clone
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/projects"
              className={`text-gray-600 hover:text-gray-900 font-normal text-base font-serif  ${
                pathname === "/dashboard/projects" ? "text-gray-900" : ""
              }`}
            >
              Projects
            </Link>
            <Link
              href="/dashboard/profile"
              className={`text-gray-600 hover:text-gray-900 font-normal text-base font-serif ${
                pathname === "/dashboard/profile" ? "text-gray-900" : ""
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {user?.name || user?.email}
          </span>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
