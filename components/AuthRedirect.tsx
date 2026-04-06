"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthRedirect({ children }: any) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.login); // ⚠️ we'll fix below
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✅ Wait for Zustand hydration
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => unsub();
  }, []);

  // ✅ Sync with backend session
  useEffect(() => {
    if (!hydrated) return;

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          useAuthStore.setState({ user: data }); // ✅ correct way
        } else {
          router.replace("/login");
        }
      } catch (err) {
        router.replace("/login");
      } finally {
        setCheckingAuth(false);
      }
    };

    // Only fetch if Zustand has no user
    if (!user) {
      checkAuth();
    } else {
      setCheckingAuth(false);
    }
  }, [hydrated]);

  // 🚨 Block EVERYTHING until ready
  if (!hydrated || checkingAuth) return null;

  if (!user) return null;

  return children;
}