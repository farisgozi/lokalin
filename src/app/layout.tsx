import type { Metadata } from "next";
import { dmSans, clashDisplay } from "../fonts/fonts";
import "./globals.css";
import Navbar from "./components/layouts/Navbar";
import MotionFooter from "./components/layouts/MotionFooter";
import ClientWrapper from "./motion/providers/ClientWrapper";
import { AuthProvider } from "./providers/AuthProvider";
import { LayoutRouteGuard } from "./components/layouts/LayoutRouteGuard";

export const metadata: Metadata = {
  title: "Lokalin - Platform Bisnis Lokal",
  description:
    "Temukan dan dukung UMKM di sekitar Anda. Dari warung kopi legendaris hingga usaha kreatif, semua ada di satu tempat.",
  keywords: "UMKM, bisnis lokal, warung, kedai, usaha kecil, Indonesia",
  authors: [{ name: "Lokalin" }],
  openGraph: {
    title: "Lokalin - Platform Bisnis Lokal",
    description: "Temukan dan dukung UMKM di sekitar Anda",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${clashDisplay.variable} ${dmSans.variable}`}
    >
      <body
        className="antialiased font-sans"
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <ClientWrapper pageKey="root">
            <LayoutRouteGuard>
              <Navbar />
            </LayoutRouteGuard>
            <main className="relative overflow-hidden">
              {children}
            </main>
            <LayoutRouteGuard>
              <MotionFooter />
            </LayoutRouteGuard>
          </ClientWrapper>
        </AuthProvider>
      </body>

    </html>
  );
}