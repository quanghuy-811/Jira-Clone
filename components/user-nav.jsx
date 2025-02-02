"use client";

import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";

export function UserNav() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">
        {user?.name || user?.email}
      </span>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
