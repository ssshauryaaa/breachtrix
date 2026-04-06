// lib/jwt.ts
import jwt from "jsonwebtoken";

export const SECRET = process.env.JWT_SECRET || "breachtrix_secret";

export function generateToken(user: { id: string; role: string }): string {
  return jwt.sign(user, SECRET, { expiresIn: "6h" });
}

export function verifyToken(token: string): { id: string; role: string } | null {
  try {
    return jwt.verify(token, SECRET) as { id: string; role: string };
  } catch {
    return null;
  }
}
