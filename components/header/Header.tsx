import Link from "next/link";
import React from "react";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 py-2">
      <div className="absolute inset-0 bg-gradient-to-b to-transparent from-black/80 via-black/40"></div>
      <div className="relative  px-12 py-4 mx-auto max-w-8xl">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            aria-label="Astra AI Home"
            className="flex items-center  transition-opacity hover:opacity-80"
          >
            <Logo />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
