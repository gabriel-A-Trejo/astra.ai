import Header from "@/components/header/Header";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
