import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export function getUserFromRequest(req: NextRequest): { id: string; role: string } | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return verifyToken(authHeader.slice(7));
  }
  const cookieToken = req.cookies.get("token")?.value;
  if (cookieToken) return verifyToken(cookieToken);
  return null;
}

export function requireAuth(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return { user: null, error: new Response(JSON.stringify({ error: "No token provided" }), { status: 401 }) };
  }
  return { user, error: null };
}

export function requireAdmin(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return { user: null, error };
  if (user!.role !== "admin") {
    return { user: null, error: new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 }) };
  }
  return { user, error: null };
}
