import React from "react";
import Logo from "./Logo";
import AuthButton from "./AuthButton";

const Header = () => {
  return (
    <header className=" top-0 left-0 right-0 z-50 p-4">
      <section className="flex justify-between items-center mx-auto ">
        <Logo />
        <nav className="flex gap-3">
          <AuthButton />
        </nav>
      </section>
    </header>
  );
};

export default Header;
