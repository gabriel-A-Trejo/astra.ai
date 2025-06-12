"use client";
import { Button } from "../ui/button";
import { ArrowBigRight, Sparkles } from "lucide-react";
import { BorderTrail } from "../animations/BorderTrail";
import { SUGGESTIONS } from "@/constants/Suggestion";
import { useState } from "react";
import AuthDialog from "../auth/AuthDialog";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useMessage } from "@/store/messagesStore";
import { v4 as uuidv4 } from "uuid";
import { Id } from "@/convex/_generated/dataModel";

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
  const { setMessage, clearMessages } = useMessage();
  const router = useRouter();

  const createWorkspace = useMutation(api.workspace.createWorkspaceWithMessage);
  const updateMessage = useMutation(api.messages.addMessage);

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

    setIsLoading(true);
    try {
      const currentInput = userInput;
      setUserInput("");

      const workspaceStringId = uuidv4();
      const workspace = await createWorkspace({
        userKindeId: userId,
        workspaceStringId: workspaceStringId,
        initialMessage: {
          role: "You",
          content: userInput,
        },
      });

      if (!workspace || typeof workspace !== "string") {
        throw new Error("Invalid workspace returned");
      }

      GenerateResponse(currentInput, workspace);

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

  const GenerateResponse = async (
    prompt: string,
    getWorkspaceId: Id<"workspace">
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/chatResponse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      const AiResponse = await response.json();

      await updateMessage({
        workspaceId: getWorkspaceId as Id<"workspace">,
        content: AiResponse.response,
        role: "AI",
      });
    } catch (error) {
      toast.error("Failed to send message");
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

  const handleImprovedPrompt = ({ userInput }: { userInput: string }) => {
    if (!isAuthenticated) {
      setIsOpen(true);
      return;
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />;
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
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {userInput && (
            <aside className="flex flex-col items-center justify-center gap-2">
              <Button
                variant="outline"
                size="lg"
                className={
                  isloading
                    ? "animate-pulse cursor-pointer p-6 hover:bg-gray-800 transition "
                    : "cursor-pointer p-6 hover:bg-gray-800 transition"
                }
                aria-label="send"
                onClick={() => handleGenerate({ userInput: userInput })}
              >
                <ArrowBigRight
                  className={isloading ? "animated-pulse size-5 " : "size-5"}
                />
              </Button>
              <p className="text-sm text-gray-300">↵ Enter</p>
            </aside>
          )}
        </div>
        <Button
          variant="ghost"
          size="lg"
          className="cursor-pointer p-6 hover:bg-gray-800 transition"
          aria-label="improved prompt"
          disabled={userInput.trim().split(/\s+/).filter(Boolean).length <= 6}
          onClick={() => handleImprovedPrompt({ userInput: userInput })}
        >
          <Sparkles className={"size-5"} />
        </Button>
      </section>
      <section className="flex flex-wrap justify-center items-center gap-5 max-w-2xl mx-auto py-4 ">
        {SUGGESTIONS.map((Suggestion) => (
          <Button
            variant="outline"
            key={Suggestion}
            className="rounded-2xl cursor-pointer"
            size="default"
            onClick={() => handleGenerate({ userInput: Suggestion })}
          >
            <p>{Suggestion}</p>
          </Button>
        ))}
      </section>
      <AuthDialog openDialog={isOpen} closeDialog={() => setIsOpen(false)} />
    </>
  );
};

export default HeroTextareaAndBtn;
