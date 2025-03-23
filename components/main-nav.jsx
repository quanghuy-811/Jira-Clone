"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { loginSuccess, logout } from "@/store/slices/authSlice";
import { getClientAuthToken, removeCookies } from "@/lib/utils";
import { useEffect, useState } from "react";
import FormCreateTask from "./board/formCreateTask";
import { Avatar, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Menu, User } from "lucide-react";
import { Tooltip } from "antd";

export function MainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isOpenFormCreateTask, setIsOpenFormCreateTask] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => {
    return state.auth;
  });

  useEffect(() => {
    const token = getClientAuthToken("accessToken");
    const userData = getClientAuthToken("userData");
    if (token) {
      dispatch(
        loginSuccess({
          user: userData,
          accessToken: token,
        })
      );
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    removeCookies("accessToken");
    removeCookies("userData");

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
    <div>
      <header className="bg-white border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-7">
            <Link
              href="/dashboard/projects"
              className="text-xl md:text-2xl font-medium font-sans"
            >
              Jira Clone
            </Link>
            <div className="flex items-center text-gray-800">
              <Button variant="ghost" className="hover:bg-blue-100 btn">
                <Link
                  prefetch={true}
                  href="/dashboard/projects"
                  className={`font-normal text-sm md:text-base font-serif  ${
                    pathname === "/dashboard/projects"
                      ? "text-blue-600 border-b-2 border-blue-700"
                      : ""
                  }`}
                >
                  Projects
                </Link>
              </Button>
              <Button variant="ghost" className="hover:bg-blue-100 btn">
                <Link
                  href="/dashboard/user"
                  prefetch={true}
                  className={`font-normal text-sm md:text-base font-serif ${
                    pathname === "/dashboard/user"
                      ? "text-blue-600 border-b-2 border-blue-700"
                      : ""
                  }`}
                >
                  User
                </Link>
              </Button>
              <Button variant="ghost" className="hover:bg-blue-100 btn">
                <Link
                  href="#"
                  onClick={() => setIsOpenFormCreateTask(true)}
                  className={`font-normal text-sm md:text-base font-serif `}
                >
                  Create Task
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              <Tooltip placement="top" title={"Profile"}>
                <Link href="/dashboard/profile" prefetch={true}>
                  <Avatar className=" bg-gray-300 w-7 h-7 border-2 border-white transition-transform duration-200 hover:scale-125">
                    <AvatarImage src={user.avatar} />
                  </Avatar>
                </Link>
              </Tooltip>
            </span>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  <Menu size={4} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/profile"
                    prefetch={true}
                    className="w-full flex items-center space-x-2"
                  >
                    <User size={14} className="mr-3" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      {/* Dialog create Task */}
      {isOpenFormCreateTask && (
        <FormCreateTask
          isOpen={isOpenFormCreateTask}
          onClose={() => setIsOpenFormCreateTask(false)}
        />
      )}
    </div>
  );
}
