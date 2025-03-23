import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("accessToken"); // Lấy token từ cookies

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], // Chỉ áp dụng middleware cho trang dashboard
};
