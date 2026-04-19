"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/providers/AuthProvider";
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "oauth_cancelled") {
      setError("Login dengan Google dibatalkan.");
    }
  }, [searchParams]);

  const disabled = useMemo(
    () => !email || !password || isLoading,
    [email, password, isLoading]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal login";
      setError(message);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl shadow-orange-500/5 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30 mb-4"
            >
              <LogIn className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Selamat Datang
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Masuk untuk akses dashboard dan fitur lanjutan
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="email@contoh.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-12 pr-12 py-3 bg-gray-50/50 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={disabled}
              whileHover={{ scale: disabled ? 1 : 1.01 }}
              whileTap={{ scale: disabled ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 text-white py-3.5 font-semibold shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:shadow-none transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">atau</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google OAuth */}
          <motion.button
            type="button"
            onClick={loginWithGoogle}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white py-3 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Login dengan Google
          </motion.button>

          <p className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Memuat...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
