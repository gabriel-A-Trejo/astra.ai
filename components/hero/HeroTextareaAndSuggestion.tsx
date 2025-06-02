import React from "react";
import { Button } from "../ui/button";
import { ArrowBigRight, WandSparkles } from "lucide-react";
import { BorderTrail } from "../animations/BorderTrail";
import { SUGGESTIONS } from "@/constants/Suggestion";

const HeroTextareaAndBtn = () => {
  return (
    <>
      <section className="relative p-4 border mx-auto  rounded-2xl max-w-md sm:max-w-xl lg:max-w-3xl  ">
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
          disabled
        >
          <WandSparkles className="size-5" />
        </Button>
      </section>

      <section className="flex flex-wrap justify-center items-center gap-5 max-w-2xl mx-auto py-4 ">
        {SUGGESTIONS.map((Suggestion) => (
          <Button variant="outline" key={Suggestion} className="rounded-2xl">
            {Suggestion}
          </Button>
        ))}
      </section>
    </>
  );
};

export default HeroTextareaAndBtn;
