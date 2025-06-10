import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { ConvexClientProvider } from "@/components/providers/ConvexProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Astra AI",
  description:
    "Astra AI lets you prompt, run, edit, and deploy full-stack web and mobile applications. Build, scale, and deploy faster with Astra.",
  keywords: ["astra", "ai", "prompt", "run", "edit", "deploy"],
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_CONVEX_URL} />
          <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_CONVEX_URL} />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className=" fixed bg-gradient-to-br from-gray-900 via-black to-gray-900 w-full h-full flex flex-col">
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
