import React from "react";
import Logo from "./Logo";
import AuthButton from "./AuthButton";
import { getAuthSession } from "@/app/actions/auth/isAuth";
import HeroTitle from "@/components/header/HeaderTitle";

const Header = async () => {
  const { userId } = await getAuthSession();

  return (
    <header className="  p-4">
      <section
        className={`flex ${!userId ? "justify-between" : "justify-around"} justify-between items-center mx-auto `}
      >
        <Logo />
        {userId && <HeroTitle userKindeId={userId} />}

        <nav className="flex gap-3">{!userId && <AuthButton />}</nav>
      </section>
    </header>
  );
};

export default Header;
