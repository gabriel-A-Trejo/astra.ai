import React from "react";

import HeroTextareaAndBtn from "./HeroTextareaAndSuggestion";

const Hero = () => {
  return (
    <>
      <header className="flex flex-col items-center justify-center gap-2 py-16">
        <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl text-center">
          What do you want to build?
        </h1>
        <p className="text-gray-300 text-sm sm:text-lg lg:text-2xl text-center">
          prompt, run, edit, and deploy full-stack web and mobile apps.
        </p>
      </header>
      <HeroTextareaAndBtn />
    </>
  );
};

export default Hero;
