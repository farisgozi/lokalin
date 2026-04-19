"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import type { UserRole } from "@/lib/auth/types";

interface AuthGateProps {
  children: React.ReactNode;
  allow: UserRole[];
  redirectTo?: string;
}

export default function AuthGate({ children, allow, redirectTo = "/login" }: AuthGateProps) {
  const router = useRouter();
  const { user, isReady, isLoading } = useAuth();

  useEffect(() => {
    if (!isReady || isLoading) return;
    if (!user) {
      router.replace(redirectTo);
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace("/");
    }
  }, [allow, isLoading, isReady, redirectTo, router, user]);

  if (!isReady || isLoading || !user || !allow.includes(user.role)) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-6">
        <p className="text-gray-600">Memuat akses halaman...</p>
      </section>
    );
  }

  return <>{children}</>;
}
