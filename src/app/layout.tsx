import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Attendance & Leave Guidelines | DOLE Central Luzon",
  description: "A personnel FAQ reference for work schedules, attendance records, DTR submissions, and official business at DOLE Central Luzon.",
  icons: { icon: "/images/dole.jpg" },
  openGraph: {
    title: "Attendance & Leave Guidelines | DOLE Central Luzon",
    description: "Find answers about work schedules, attendance, DTR submissions, and official business.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser extensions (e.g. Grammarly) inject attributes on <html>/<body> before hydration.
  return <html lang="en" className={sans.variable} suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}
