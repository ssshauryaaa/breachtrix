"use client";

import AuthRedirect from "@/components/AuthRedirect";

export default function DashboardLayout({ children }: any) {
  return <AuthRedirect>{children}</AuthRedirect>;
}