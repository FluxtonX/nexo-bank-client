import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { AppProviders } from "@/providers/app-providers";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Canadian National Trust Bank — Banking Meets Crypto Intelligence",
  description: "A regulated Canadian digital bank with a built-in crypto engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <NextTopLoader color="#2563eb" height={3} showSpinner={false} crawl={true} crawlSpeed={200} initialPosition={0.08} />
        <AppProviders>
          <MaintenanceGuard appType="client" />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
