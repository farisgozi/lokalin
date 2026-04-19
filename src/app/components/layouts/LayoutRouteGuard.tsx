"use client";

import { usePathname } from "next/navigation";

const HIDDEN_ROUTES = ["/dashboard", "/onboarding", "/auth/callback"];

export function LayoutRouteGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const shouldHide = HIDDEN_ROUTES.some((route) => pathname?.startsWith(route));

    if (shouldHide) return null;
    return <>{children}</>;
}
