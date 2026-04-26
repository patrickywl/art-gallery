import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import DatadogInit from "@/components/DatadogInit";
import RumRouteTracker from "@/components/RumRouteTracker";
import RumErrorBoundary from "@/components/RumErrorBoundary";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "성은공방 | Art Gallery",
  description: "독립 작가의 도자기 작품을 만나보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <DatadogInit />
        <RumRouteTracker />
        <RumErrorBoundary>{children}</RumErrorBoundary>
      </body>
    </html>
  );
}
