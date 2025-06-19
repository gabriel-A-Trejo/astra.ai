import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Sidebar />
      <Header />
      {children}
    </>
  );
}
