"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    createSessionFromToken,
    ensureOAuthPrefs,
} from "@/lib/auth/auth-service";
import { useAuth } from "@/app/providers/AuthProvider";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { refresh } = useAuth();
    const [error, setError] = useState("");
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        const userId = searchParams.get("userId");
        const secret = searchParams.get("secret");

        async function handleCallback() {
            try {
                // Exchange OAuth token for session
                if (userId && secret) {
                    await createSessionFromToken(userId, secret);
                }

                // Set role prefs for new users
                const user = await ensureOAuthPrefs();
                await refresh();

                // Route based on role and status
                if (user.role === "owner") {
                    const submissionKey = `umkm-owner-submission-${user.id}`;
                    const existing = localStorage.getItem(submissionKey);
                    if (!existing) {
                        router.replace("/onboarding");
                        return;
                    }

                    try {
                        const globalRaw = localStorage.getItem("umkm-owner-submissions");
                        const globalList = globalRaw ? JSON.parse(globalRaw) : [];
                        const fromGlobal = globalList.find(
                            (s: { ownerId: string }) => s.ownerId === user.id
                        );
                        const status =
                            fromGlobal?.status || JSON.parse(existing).status;
                        if (status === "pending" || status === "rejected") {
                            router.replace("/");
                            return;
                        }
                    } catch {
                        // parse error — continue to dashboard
                    }
                    router.replace("/dashboard/owner");
                    return;
                }

                if (user.role === "admin") {
                    router.replace("/dashboard/admin");
                } else {
                    router.replace("/");
                }
            } catch (err) {
                console.error("OAuth callback error:", err);
                const msg = err instanceof Error ? err.message : "Login gagal";
                setError(msg);
                setTimeout(() => router.replace("/login"), 3000);
            }
        }

        handleCallback();
    }, [searchParams, refresh, router]);

    if (error) {
        return (
            <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-orange-50 via-white to-pink-50">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Login Gagal</h1>
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <p className="text-xs text-gray-400">
                        Mengalihkan ke halaman login...
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-orange-50 via-white to-pink-50">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Memproses login...</p>
                <p className="text-sm text-gray-400 mt-1">Mohon tunggu sebentar</p>
            </div>
        </section>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-orange-50 via-white to-pink-50">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Memproses login...</p>
                    </div>
                </section>
            }
        >
            <CallbackContent />
        </Suspense>
    );
}
