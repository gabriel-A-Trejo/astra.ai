"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import AuthDialog from "../auth/AuthDialog";

const AuthButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={"ghost"}
        className="cursor-pointer"
        onClick={() => setIsOpen(true)}
        aria-label="Login"
      >
        Login
      </Button>
      <Button
        className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg text-white hover:bg-blue-700 cursor-pointer"
        onClick={() => setIsOpen(true)}
        aria-label="Sign up"
      >
        Sign up
      </Button>
      <AuthDialog openDialog={isOpen} closeDialog={() => setIsOpen(false)} />
    </>
  );
};

export default AuthButton;
