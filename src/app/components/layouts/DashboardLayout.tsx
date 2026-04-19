"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ShieldCheck,
    Upload,
    Sparkles,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Home,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: ReactNode;
    roles: string[];
}

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard/owner",
        icon: <LayoutDashboard className="w-5 h-5" />,
        roles: ["owner"],
    },
    {
        label: "Performa & AI",
        href: "/dashboard/owner#ai",
        icon: <Sparkles className="w-5 h-5" />,
        roles: ["owner"],
    },
    {
        label: "Dashboard",
        href: "/dashboard/admin",
        icon: <ShieldCheck className="w-5 h-5" />,
        roles: ["admin"],
    },
    {
        label: "Upload UMKM",
        href: "/umkm/upload",
        icon: <Upload className="w-5 h-5" />,
        roles: ["user"],
    },
    {
        label: "Ke Beranda",
        href: "/",
        icon: <Home className="w-5 h-5" />,
        roles: ["owner", "admin", "user"],
    },
];

interface DashboardLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const role = user?.role || "user";
    const filteredNav = navItems.filter((item) => item.roles.includes(role));

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    async function handleLogout() {
        await logout();
        router.push("/login");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-50">
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-xl border-r border-gray-100 shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Sidebar Header */}
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                                U
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 text-sm">Lokalin</h2>
                                <p className="text-xs text-gray-400 capitalize">{role === "owner" ? "Owner Panel" : role === "admin" ? "Admin Panel" : "User Panel"}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Menu
                    </p>
                    {filteredNav.map((item) => {
                        const isActive = item.href === pathname;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20"
                                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                                    }`}
                            >
                                <span className={`transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-orange-500"}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-100 space-y-3">
                    {user && (
                        <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
                            <div className="w-9 h-9 bg-gradient-to-br from-orange-300 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{user.name || "User"}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-72 min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                {title && <h1 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h1>}
                                {subtitle && <p className="text-xs sm:text-sm text-gray-400">{subtitle}</p>}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
