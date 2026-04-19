"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { getUMKMByOwnerId } from "@/lib/appwrite/database";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }

    if (user.role === "owner") {
      // Check UMKM data via database service (Appwrite or localStorage)
      getUMKMByOwnerId(user.id).then((doc) => {
        if (!doc) {
          router.replace("/onboarding");
          return;
        }

        if (doc.status === "PENDING" || doc.status === "REJECTED") {
          router.replace("/");
          return;
        }

        router.replace("/dashboard/owner");
      }).catch(() => {
        router.replace("/onboarding");
      });
      return;
    }

    // Regular user → upload page
    router.replace("/umkm/upload");
  }, [isReady, router, user]);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Mengarahkan ke dashboard...</p>
      </div>
    </section>
  );
}
