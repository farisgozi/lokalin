import localFont from "next/font/local";
import { DM_Sans } from "next/font/google";

export const clashDisplay = localFont({
  src: [
    {
      path: '../../public/assets/fonts/ClashDisplay-Regular.woff2',
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/ClashDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

export const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});
