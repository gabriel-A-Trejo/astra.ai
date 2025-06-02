import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className=" relative bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen flex flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
