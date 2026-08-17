import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppNav from "../components/AppNav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "FlyMovie — AI-Powered Movie Discovery",
    template: "%s | FlyMovie",
  },
  description:
    "Discover, save, and get AI-powered recommendations for movies you'll love. Built with Next.js and Claude AI.",
  keywords: ["movies", "AI recommendations", "watchlist", "movie discovery"],
  authors: [{ name: "FlyMovie" }],
  openGraph: {
    title: "FlyMovie — AI-Powered Movie Discovery",
    description: "Discover movies and get personalised AI recommendations.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        {/* Shared navigation — rendered on every route */}
        <AppNav />

        {/* Page content */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Global footer */}
        <footer className="border-t border-zinc-900 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600 font-medium">
            <p>© 2026 FlyMovie · FlyRank AI Frontend Engineering Capstone</p>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI-assisted development</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
