import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WOWS NEXTJS DEMO",
  description: "Next.js 16 Demo",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <SessionProvider>
          <NextTopLoader
            color="#f59e0b"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #f59e0b,0 0 5px #f59e0b"
          />
          {children}
          <Toaster position="top-right" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}