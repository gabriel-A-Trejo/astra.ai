"use client";
import { Button } from "../ui/button";
import { ArrowBigRight, Loader2 } from "lucide-react";
import { BorderTrail } from "../animations/BorderTrail";
import { SUGGESTIONS } from "@/constants/Suggestion";
import { useRef, useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useImprovePrompt } from "@/hooks/useImprovePrompt"; // <-- new hook
import { ImprovePromptControls } from "../improvementPrompt/ImprovePromptControls";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AiModelsDropDown } from "../AiModels/AiModelsDropDown";

type HeroTextareaAndBtnProps = Readonly<{
  isAuthenticated: boolean | null;
  userId: string | null;
}>;

const HeroTextareaAndBtn = ({
  isAuthenticated,
  userId,
}: HeroTextareaAndBtnProps) => {
  const [userInput, setUserInput] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isloading, setIsLoading] = useState(false);

  const router = useRouter();
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);
  const originalPromptRef = useRef<string>("");

  const { handleImprovePrompt, handleRevertPrompt, hasOriginalPrompt } =
    useImprovePrompt({
      setIsImprovingPrompt,
      originalPromptRef,
    });

  const createWorkspace = useMutation(api.workspace.createWorkspaceWithMessage);

  const handleGenerate = async ({ userInput }: { userInput: string }) => {
    if (!isAuthenticated || !userId) {
      setIsOpen(true);
      toast.error("Please sign up or login to generate code");
      return;
    }

    if (!userInput.trim()) {
      toast.error("Please enter a prompt to generate code");
      return;
    }
    if (userInput.length > 600) {
      toast.error("Prompt must be less than 600 characters");
      return;
    }

    setIsLoading(true);
    try {
      setUserInput("");

      const workspaceStringId = uuidv4();
      const workspace = await createWorkspace({
        userKindeId: userId,
        workspaceStringId: workspaceStringId,
        initialMessage: {
          role: "You",
          content: userInput,
        },
        title: userInput,
      });

      if (!workspace || typeof workspace !== "string") {
        throw new Error("Invalid workspace returned");
      }

      toast.success("Workspace created!", {
        description: "Redirecting to your new workspace...",
      });

      router.push(`/workspaces/${workspaceStringId}`);
    } catch (error: any) {
      console.error("Error during workspace creation:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerate({ userInput: userInput });
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <section className="relative p-4 border mx-auto rounded-2xl max-w-md sm:max-w-xl lg:max-w-3xl">
        <div className="flex items-center gap-2 p-2">
          <BorderTrail
            className="absolute inset-0 bg-gradient-to-l rounded-2xl animate-pulse from-blue-500/20 via-blue-800/30 to-gray-900/40"
            size={100}
          />
          <textarea
            placeholder="Describe what you want to build..."
            name="userInput"
            id="userInput"
            className="w-full h-25 sm:h-36 lg:h-52 max-h-54 resize-none outline-none bg-transparent text-white placeholder-gray-400 p-4 rounded-2xl no-scrollbar"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isloading || isImprovingPrompt}
          />
          {userInput && (
            <aside className="flex flex-col items-center justify-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className={
                  isloading
                    ? "animate-pulse cursor-pointer p-6 hover:bg-gray-800 transition"
                    : "cursor-pointer p-6 hover:bg-gray-800 transition"
                }
                aria-label="send"
                disabled={isloading || isImprovingPrompt}
                onClick={() => handleGenerate({ userInput: userInput })}
              >
                {isloading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ArrowBigRight className="size-5" />
                )}
              </Button>
              {!isloading && !isImprovingPrompt && (
                <p className="text-sm text-gray-300">↵ Enter</p>
              )}
            </aside>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <ImprovePromptControls
            userInput={userInput}
            setUserInput={setUserInput}
            isloading={isloading}
            isImprovingPrompt={isImprovingPrompt}
            handleImprovePrompt={handleImprovePrompt}
            handleRevertPrompt={handleRevertPrompt}
            hasOriginalPrompt={hasOriginalPrompt}
          />
          <AiModelsDropDown />
        </div>
      </section>

      <section className="flex flex-wrap justify-center items-center gap-5 max-w-2xl mx-auto py-4">
        {SUGGESTIONS.map((Suggestion) => (
          <Tooltip key={Suggestion}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                key={Suggestion}
                className="rounded-2xl cursor-pointer"
                size="default"
                disabled={isloading || isImprovingPrompt}
                onClick={() => handleGenerate({ userInput: Suggestion })}
                aria-label={Suggestion}
              >
                <p>{Suggestion}</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate using: {Suggestion}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </section>

      <AuthDialog openDialog={isOpen} closeDialog={() => setIsOpen(false)} />
    </>
  );
};

export default HeroTextareaAndBtn;
