import React from "react";
import { Button } from "../ui/button";
import { ArrowBigRight, WandSparkles } from "lucide-react";
import { BorderTrail } from "../animations/BorderTrail";

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
      <section className="relative p-4 border mx-auto  rounded-2xl max-w-md sm:max-w-xl lg:max-w-3xl ">
        <div className="flex items-center  gap-2 p-2">
          <BorderTrail
            className="absolute inset-0 bg-gradient-to-l rounded-2xl animate-pulse from-blue-500/20 via-blue-800/30 to-gray-900/40"
            size={100}
          />
          <textarea
            placeholder="Describe what you want to build..."
            name="userInput"
            id="userInput"
            className="w-full h-25 sm:h-36 lg:h-52 max-h-54 resize-none outline-none bg-transparent text-white placeholder-gray-400 p-4   rounded-2xl   no-scrollbar"
          />
          <aside className="flex flex-col items-center justify-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer p-6 hover:bg-gray-800 transition"
              aria-label="send"
            >
              <ArrowBigRight className="size-5" />
            </Button>
            <p className="text-sm text-gray-300">↵ Enter</p>
          </aside>
        </div>
        <Button
          variant="ghost"
          size="lg"
          className="cursor-pointer p-6 hover:bg-gray-800 transition"
          aria-label="improved prompt"
        >
          <WandSparkles className="size-5" />
        </Button>
      </section>

      <section></section>
    </>
  );
};

export default Hero;
