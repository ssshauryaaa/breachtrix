import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      login: async (username: string, password: string) => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Login failed");
        }

        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        set({ user: userData });
      },

      register: async (username: string, password: string) => {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Registration failed");
        }

        const userRes = await fetch("/api/auth/me", { credentials: "include" });
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        set({ user: userData });
      },

      logout: async () => {
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        set({ user: null });
      },
    }),
    { name: "auth-storage" }
  )
);
