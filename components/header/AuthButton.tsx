import React from "react";
import { Button } from "../ui/button";

const AuthButton = () => {
  return (
    <>
      <Button variant={"ghost"} className="cursor-pointer">
        Login
      </Button>
      <Button className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-lg text-white hover:bg-blue-700 cursor-pointer">
        Sign up
      </Button>
    </>
  );
};

export default AuthButton;
