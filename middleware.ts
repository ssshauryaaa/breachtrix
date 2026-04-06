import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  // 🚨 Not logged in
  if (!token && (isDashboard || isAdmin)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) return NextResponse.next();

      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(secret)
      );

      const role = payload.role;

      // 🚨 Block non-admins
      if (isAdmin && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};