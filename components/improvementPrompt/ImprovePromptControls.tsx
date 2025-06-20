"use client";

import { Button } from "../ui/button";
import { Sparkles, Loader2, Undo2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type Props = {
  userInput: string;
  setUserInput: (input: string) => void;
  isloading: boolean;
  isImprovingPrompt: boolean;
  handleImprovePrompt: (
    prompt: string,
    setUserInput: (input: string) => void
  ) => void;
  handleRevertPrompt: (setUserInput: (input: string) => void) => void;
  hasOriginalPrompt: boolean;
};

export const ImprovePromptControls = ({
  userInput,
  setUserInput,
  isloading,
  isImprovingPrompt,
  handleImprovePrompt,
  handleRevertPrompt,
  hasOriginalPrompt,
}: Props) => {
  const wordCount = userInput.trim().split(/\s+/).filter(Boolean).length;
  const canImprovePrompt = wordCount > 6 && !isloading && !isImprovingPrompt;

  return (
    <TooltipProvider delayDuration={100}>
      <section className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="cursor-pointer p-6 hover:bg-gray-800 transition disabled:opacity-50"
              aria-label="improve prompt"
              disabled={!canImprovePrompt}
              onClick={() => handleImprovePrompt(userInput, setUserInput)}
            >
              {isImprovingPrompt ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Sparkles className="size-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{hasOriginalPrompt ? "Improve Again" : "Improve Prompt"}</p>
          </TooltipContent>
        </Tooltip>

        {hasOriginalPrompt && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                className="cursor-pointer p-6 hover:bg-gray-800 transition text-gray-400 hover:text-white"
                aria-label="revert to original prompt"
                disabled={isloading || isImprovingPrompt}
                onClick={() => handleRevertPrompt(setUserInput)}
              >
                <Undo2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Revert to Original Prompt</p>
            </TooltipContent>
          </Tooltip>
        )}
      </section>
    </TooltipProvider>
  );
};
