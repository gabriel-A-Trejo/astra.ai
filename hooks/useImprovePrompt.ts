import { toast } from "sonner";

export const useImprovePrompt = ({
  setIsImprovingPrompt,
  originalPromptRef,
}: {
  setIsImprovingPrompt: (value: boolean) => void;
  originalPromptRef: React.MutableRefObject<string>;
}) => {
  const hasOriginalPrompt = originalPromptRef.current !== "";

  const handleImprovePrompt = async (
    prompt: string,
    setUserInput: (input: string) => void
  ) => {
    const currentPrompt = prompt.trim();

    if (!currentPrompt) {
      toast.error("Please enter a prompt first");
      return;
    }

    if (!hasOriginalPrompt) {
      originalPromptRef.current = currentPrompt;
    }

    setIsImprovingPrompt(true);

    try {
      const response = await fetch("/api/ai/improvePrompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const aiResponse = await response.json();

      setUserInput(aiResponse.improved);

      toast.success("Prompt improved successfully!");
    } catch (error: any) {
      console.error("Improve prompt error:", error);
      toast.error(error.message || "Failed to improve prompt");
    } finally {
      setIsImprovingPrompt(false);
    }
  };

  const handleRevertPrompt = (setUserInput: (input: string) => void) => {
    if (!hasOriginalPrompt) {
      toast.error("No original prompt to revert to");
      return;
    }

    setUserInput(originalPromptRef.current);
    originalPromptRef.current = "";
    toast.success("Reverted to original prompt");
  };

  return {
    handleImprovePrompt,
    handleRevertPrompt,
    hasOriginalPrompt,
  };
};
